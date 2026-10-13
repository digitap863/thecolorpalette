// ─── Shared types & constants for the Admin Gallery feature ───────────────────

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  order: number;
  isActive: boolean;
}

export interface UploadingFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "pending" | "uploading" | "saving" | "done" | "error";
  error?: string;
  // Form fields
  title: string;
  alt: string;
  category: string;
  order: number;
}

export const GALLERY_CATEGORIES = [
  "Hair",
  "Skin",
  "Nails",
  "Makeup",
  "Facial",
  "Body",
  "Bridal",
  "Other",
] as const;
