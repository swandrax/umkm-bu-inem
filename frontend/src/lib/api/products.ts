import { apiClient } from "./client";
import { Product } from "@/types/product";

export interface ProductFilterParams {
  query?: string;
  categoryId?: number;
  onlyActive?: boolean;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export const DUMMY_PRODUCTS: Product[] = [
  { id: 1, code: "PRD-001", name: "Kue Lemper Ayam", categoryId: 1, categoryName: "Makanan Basah", price: 3500, stock: 50, active: true },
  { id: 2, code: "PRD-002", name: "Risol Mayo Spesial", categoryId: 1, categoryName: "Makanan Basah", price: 4000, stock: 40, active: true },
  { id: 3, code: "PRD-003", name: "Kue Pastel Telur", categoryId: 1, categoryName: "Makanan Basah", price: 3500, stock: 35, active: true },
  { id: 4, code: "PRD-004", name: "Kue Dadar Gulung", categoryId: 1, categoryName: "Makanan Basah", price: 3000, stock: 45, active: true },
  { id: 5, code: "PRD-005", name: "Kue Nagasari Pisang", categoryId: 1, categoryName: "Makanan Basah", price: 3000, stock: 30, active: true },
  { id: 6, code: "PRD-006", name: "Bala-Bala / Bakwan", categoryId: 2, categoryName: "Gorengan", price: 1500, stock: 100, active: true },
  { id: 7, code: "PRD-007", name: "Tahu Isi Pedas", categoryId: 2, categoryName: "Gorengan", price: 2000, stock: 80, active: true },
  { id: 8, code: "PRD-008", name: "Pisang Goreng Crispy", categoryId: 2, categoryName: "Gorengan", price: 2500, stock: 60, active: true },
  { id: 9, code: "PRD-009", name: "Es Teh Manis Jumbo", categoryId: 3, categoryName: "Minuman", price: 4000, stock: 120, active: true },
  { id: 10, code: "PRD-010", name: "Es Kopi Susu Gula Aren", categoryId: 3, categoryName: "Minuman", price: 8000, stock: 75, active: true },
  { id: 11, code: "PRD-011", name: "Keripik Singkong Balado", categoryId: 4, categoryName: "Snack Kering", price: 12000, stock: 40, active: true },
  { id: 12, code: "PRD-012", name: "Rempeyek Kacang Renyah", categoryId: 4, categoryName: "Snack Kering", price: 10000, stock: 50, active: true },
];

export const productsApi = {
  getAll: async (params?: ProductFilterParams): Promise<Product[]> => {
    try {
      const searchParams = new URLSearchParams();
      if (params?.query) searchParams.append("query", params.query);
      if (params?.categoryId && params.categoryId > 0) searchParams.append("categoryId", params.categoryId.toString());
      if (params?.onlyActive !== undefined) searchParams.append("onlyActive", params.onlyActive.toString());
      if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());

      const qs = searchParams.toString();
      const res = await apiClient.get<Product[]>(`/products${qs ? `?${qs}` : ""}`);
      if (res && res.length > 0) return res;
      return DUMMY_PRODUCTS;
    } catch {
      let filtered = [...DUMMY_PRODUCTS];
      if (params?.categoryId && params.categoryId > 0) {
        filtered = filtered.filter((p) => p.categoryId === params.categoryId);
      }
      if (params?.query) {
        const q = params.query.toLowerCase();
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q));
      }
      return filtered;
    }
  },

  getById: async (id: number) => {
    try {
      return await apiClient.get<Product>(`/products/${id}`);
    } catch {
      return DUMMY_PRODUCTS.find((p) => p.id === id) || DUMMY_PRODUCTS[0];
    }
  },

  create: (data: Partial<Product>) => apiClient.post<Product>("/products", data),

  update: (id: number, data: Partial<Product>) => apiClient.put<Product>(`/products/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/products/${id}`),
};
