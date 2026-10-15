export interface AdminServiceItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description?: string;
  image: string;
  images?: string[];
  points?: string[];
  pdfUrl?: string | null;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminCategoryItem {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  image?: string;
  order?: number;
  isActive?: boolean;
}

export interface ServiceFormData {
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  description: string;
  image: string;
  images: string[];
  points: string[];
  pdfUrl: string;
  isActive: boolean;
  order: number;
}
