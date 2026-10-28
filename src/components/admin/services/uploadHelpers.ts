import { convertToWebP } from "@/lib/imageUtils";

export async function uploadServiceImageToCloudinary(
  file: File,
  onProgress: (progress: number) => void
): Promise<string> {
  // Automatically convert to WebP before uploading
  const processedFile = await convertToWebP(file);

  // 1. Get signed signature from backend
  const sigRes = await fetch("/api/admin/gallery/sign-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "services" }),
  });

  if (!sigRes.ok) {
    const errData = await sigRes.json().catch(() => ({}));
    throw new Error(errData?.error || "Failed to generate upload signature");
  }

  const { signature, timestamp, folder, apiKey, cloudName } =
    await sigRes.json();

  if (!cloudName || cloudName === "your_cloud_name") {
    throw new Error(
      "Cloudinary is not configured with real credentials in .env. Please provide a direct image URL or configure Cloudinary."
    );
  }

  // 2. Direct upload to Cloudinary via XHR
  const formData = new FormData();
  formData.append("file", processedFile);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    );

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        onProgress(100);
        resolve(res.secure_url);
      } else {
        try {
          const errRes = JSON.parse(xhr.responseText);
          reject(new Error(errRes?.error?.message || "Cloudinary upload failed"));
        } catch {
          reject(new Error("Cloudinary upload failed"));
        }
      }
    };

    xhr.onerror = () => reject(new Error("Network error during image upload"));
    xhr.send(formData);
  });
}
