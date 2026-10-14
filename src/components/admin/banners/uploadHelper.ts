export async function uploadBannerImageToCloudinary(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  // 1. Get a signed signature from our secure backend for folder "banners"
  const sigRes = await fetch("/api/admin/banners/sign-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "banners" }),
  });

  if (!sigRes.ok) {
    throw new Error("Failed to get upload signature");
  }

  const { signature, timestamp, folder, apiKey, cloudName } =
    await sigRes.json();

  // 2. Upload directly to Cloudinary via XHR for progress tracking
  const formData = new FormData();
  formData.append("file", file);
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

    if (onProgress) {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        resolve(res.secure_url);
      } else {
        reject(new Error("Cloudinary upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during image upload"));
    xhr.send(formData);
  });
}
