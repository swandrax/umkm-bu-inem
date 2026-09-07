import { apiClient } from "./client";
import { Category } from "@/types/category";

export const DUMMY_CATEGORIES: Category[] = [
  { id: 1, name: "Makanan Basah", description: "Kue basah tradisional khas Ibu Inem" },
  { id: 2, name: "Gorengan", description: "Aneka gorengan hangat dan renyah" },
  { id: 3, name: "Minuman", description: "Minuman segar dan hangat" },
  { id: 4, name: "Snack Kering", description: "Cemilan kering dan keripik" },
];

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    try {
      const res = await apiClient.get<Category[]>("/categories");
      if (res && res.length > 0) return res;
      return DUMMY_CATEGORIES;
    } catch {
      return DUMMY_CATEGORIES;
    }
  },

  getById: async (id: number) => {
    try {
      return await apiClient.get<Category>(`/categories/${id}`);
    } catch {
      return DUMMY_CATEGORIES.find((c) => c.id === id) || DUMMY_CATEGORIES[0];
    }
  },

  create: (data: { name: string; description?: string }) =>
    apiClient.post<Category>("/categories", data),

  update: (id: number, data: { name: string; description?: string }) =>
    apiClient.put<Category>(`/categories/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/categories/${id}`),
};
