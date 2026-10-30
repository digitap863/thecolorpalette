// ─── Shared types & constants for the Admin Gallery feature ───────────────────

export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  order: number;
  isActive: boolean;
  socialUrl?: string;
  socialPlatform?: string;
  isSocialPost?: boolean;
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
  socialUrl?: string;
  socialPlatform?: string;
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

export const REEL_PLATFORMS = [
  { id: "instagram", name: "Instagram Reel", placeholder: "https://www.instagram.com/reel/... or post" },
  { id: "tiktok", name: "TikTok Reel", placeholder: "https://www.tiktok.com/@.../video/..." },
  { id: "youtube", name: "YouTube Shorts", placeholder: "https://www.youtube.com/shorts/... or watch" },
] as const;

export const SOCIAL_PLATFORMS = REEL_PLATFORMS;
