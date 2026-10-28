/**
 * Utility functions for client-side image processing.
 */

export interface WebPOptions {
  /** Quality between 0 and 1. Default: 0.85 */
  quality?: number;
  /** Max width constraint. Default: 2560px */
  maxWidth?: number;
  /** Max height constraint. Default: 2560px */
  maxHeight?: number;
}

/**
 * Automatically converts an image File (JPEG, PNG, etc.) to WebP format in the browser.
 * 
 * - Skips conversion if the file is already WebP.
 * - Skips SVG and animated GIF to preserve vectors and animations.
 * - Scales down oversized images (exceeding maxWidth/maxHeight) to maintain performance.
 * - Gracefully falls back to the original file if conversion fails or is unsupported.
 */
export async function convertToWebP(
  file: File,
  options: WebPOptions = {}
): Promise<File> {
  const { quality = 0.85, maxWidth = 2560, maxHeight = 2560 } = options;

  // Verify browser environment
  if (typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  // Only process images
  if (!file.type || !file.type.startsWith("image/")) {
    return file;
  }

  // Already WebP - no need to re-encode
  if (file.type === "image/webp" || file.name.toLowerCase().endsWith(".webp")) {
    return file;
  }

  // Keep SVGs (vector) and GIFs (animations) intact
  if (
    file.type === "image/svg+xml" ||
    file.name.toLowerCase().endsWith(".svg") ||
    file.type === "image/gif" ||
    file.name.toLowerCase().endsWith(".gif")
  ) {
    return file;
  }

  try {
    // Attempt modern createImageBitmap or fallback to HTMLImageElement
    let sourceWidth = 0;
    let sourceHeight = 0;
    let drawableSource: ImageBitmap | HTMLImageElement;

    if (typeof createImageBitmap === "function") {
      try {
        const bitmap = await createImageBitmap(file);
        sourceWidth = bitmap.width;
        sourceHeight = bitmap.height;
        drawableSource = bitmap;
      } catch {
        // Fallback to Image element if createImageBitmap fails on specific format
        const img = await loadImageElement(file);
        sourceWidth = img.naturalWidth || img.width;
        sourceHeight = img.naturalHeight || img.height;
        drawableSource = img;
      }
    } else {
      const img = await loadImageElement(file);
      sourceWidth = img.naturalWidth || img.width;
      sourceHeight = img.naturalHeight || img.height;
      drawableSource = img;
    }

    if (!sourceWidth || !sourceHeight) {
      return file;
    }

    // Calculate dimensions maintaining aspect ratio
    let targetWidth = sourceWidth;
    let targetHeight = sourceHeight;

    if (targetWidth > maxWidth || targetHeight > maxHeight) {
      const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight);
      targetWidth = Math.round(targetWidth * ratio);
      targetHeight = Math.round(targetHeight * ratio);
    }

    // Draw on offscreen canvas
    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return file;
    }

    // High quality scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(drawableSource, 0, 0, targetWidth, targetHeight);

    // Clean up ImageBitmap if used
    if ("close" in drawableSource && typeof drawableSource.close === "function") {
      drawableSource.close();
    }

    // Convert to WebP blob
    const webpBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        "image/webp",
        quality
      );
    });

    if (!webpBlob || webpBlob.type !== "image/webp") {
      // Browser didn't support image/webp output or returned null
      return file;
    }

    // Create a new File with .webp extension
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    const webpFileName = `${baseName}.webp`;

    const webpFile = new File([webpBlob], webpFileName, {
      type: "image/webp",
      lastModified: Date.now(),
    });

    console.info(
      `[ImageUtils] Converted "${file.name}" (${(file.size / 1024).toFixed(1)} KB) -> "${webpFileName}" (${(webpFile.size / 1024).toFixed(1)} KB, WebP)`
    );

    return webpFile;
  } catch (err) {
    console.warn("[ImageUtils] WebP conversion failed, using original file:", err);
    return file;
  }
}

/**
 * Helper to load a File into an HTMLImageElement
 */
function loadImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };

    img.src = url;
  });
}
