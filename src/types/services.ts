export interface ServiceCategoryData {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  image: string;
  order: number;
  isActive: boolean;
}

export interface ServiceData {
  id: string;
  categoryId: string; // references category slug or id
  name: string;
  slug: string;
  shortDescription: string;
  description?: string;
  image: string;
  images?: string[];
  points?: string[];
  pdfUrl?: string | null;
  featured: boolean;
  isActive: boolean;
  order: number;
}
