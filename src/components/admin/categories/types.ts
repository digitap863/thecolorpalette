export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  image?: string;
  order: number;
  isActive: boolean;
  serviceCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryFormData {
  name: string;
  slug: string;
  shortDescription: string;
  image?: string;
  order: number;
  isActive: boolean;
}
