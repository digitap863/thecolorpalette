import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Generates a signed upload signature for direct browser-to-Cloudinary upload.
 * This keeps the API secret server-side only.
 */
export function generateUploadSignature(folder: string = "gallery") {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const params: Record<string, string | number> = {
    folder,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    signature,
    timestamp,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
  };
}

/**
 * Deletes an image from Cloudinary by its public_id.
 */
export async function deleteCloudinaryImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw error;
  }
}

/**
 * Extracts the public_id from a Cloudinary URL.
 * e.g. https://res.cloudinary.com/demo/image/upload/v1234/gallery/abc.jpg → gallery/abc
 */
export function extractPublicId(cloudinaryUrl: string): string | null {
  try {
    const url = new URL(cloudinaryUrl);
    // Path looks like: /demo/image/upload/v1234/folder/filename.ext
    const parts = url.pathname.split("/");
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx === -1) return null;

    // Skip the version segment (vXXXXXXXX) if present
    let startIdx = uploadIdx + 1;
    if (parts[startIdx] && /^v\d+$/.test(parts[startIdx])) {
      startIdx++;
    }

    const withExt = parts.slice(startIdx).join("/");
    // Remove file extension
    return withExt.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}
