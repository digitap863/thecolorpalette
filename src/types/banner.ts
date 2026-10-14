export interface BannerSlide {
  id?: string;
  _id?: string;
  title?: string;
  subtitle?: string;
  images: string[];
  mobileImages?: string[];
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
