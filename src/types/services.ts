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
  image: string;
  featured: boolean;
  isActive: boolean;
  order: number;
}
