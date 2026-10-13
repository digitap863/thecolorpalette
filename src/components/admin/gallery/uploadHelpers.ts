// ─── Cloudinary direct-browser upload helper ──────────────────────────────────

export async function uploadToCloudinary(
  file: File,
  onProgress: (progress: number) => void
): Promise<string> {
  // 1. Get a signed signature from our secure backend
  const sigRes = await fetch("/api/admin/gallery/sign-upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder: "gallery" }),
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

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 90)); // cap at 90% — last 10% is DB save
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        onProgress(100);
        resolve(res.secure_url);
      } else {
        reject(new Error("Cloudinary upload failed"));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}
