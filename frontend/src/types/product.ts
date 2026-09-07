export interface Product {
  id: number;
  code: string;
  name: string;
  categoryId: number;
  categoryName?: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductInput {
  code: string;
  name: string;
  categoryId: number;
  price: number;
  stock: number;
  active: boolean;
}