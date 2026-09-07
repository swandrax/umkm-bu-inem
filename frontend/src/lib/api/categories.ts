import { apiClient } from "./client";
import { Category } from "@/types/category";

export const categoriesApi = {
  getAll: () => apiClient.get<Category[]>("/categories"),

  getById: (id: number) => apiClient.get<Category>(`/categories/${id}`),

  create: (data: { name: string; description?: string }) =>
    apiClient.post<Category>("/categories", data),

  update: (id: number, data: { name: string; description?: string }) =>
    apiClient.put<Category>(`/categories/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/categories/${id}`),
};
