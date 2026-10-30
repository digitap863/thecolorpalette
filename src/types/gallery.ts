export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  order?: number;
  isActive?: boolean;
  socialUrl?: string;
  socialPlatform?: "instagram" | "facebook" | "tiktok" | "youtube" | "pinterest" | "other" | string;
  isSocialPost?: boolean;
}
