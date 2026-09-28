export interface ServiceProduct {
  id: number;
  slug: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  categoryId?: number;
  basePrice: number;
  discountType?: "PERCENTAGE" | "FIXED" | null;
  discountValue?: number;
  finalPrice: number;
  duration?: string;
  features?: string[];
  active: boolean;
  featured: boolean;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceProductRequest {
  slug: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  categoryId?: number;
  basePrice: number;
  discountType?: "PERCENTAGE" | "FIXED" | null;
  discountValue?: number;
  duration?: string;
  features?: string[];
  active?: boolean;
  featured?: boolean;
  imageUrl?: string;
}
