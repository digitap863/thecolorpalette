export interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
  order?: number;
  isActive?: boolean;
}
