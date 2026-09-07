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

export const productsApi = {
  getAll: (params?: ProductFilterParams) => {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.append("query", params.query);
    if (params?.categoryId && params.categoryId > 0) searchParams.append("categoryId", params.categoryId.toString());
    if (params?.onlyActive !== undefined) searchParams.append("onlyActive", params.onlyActive.toString());
    if (params?.sortBy) searchParams.append("sortBy", params.sortBy);
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const qs = searchParams.toString();
    return apiClient.get<Product[]>(`/products${qs ? `?${qs}` : ""}`);
  },

  getById: (id: number) => apiClient.get<Product>(`/products/${id}`),

  create: (data: Partial<Product>) => apiClient.post<Product>("/products", data),

  update: (id: number, data: Partial<Product>) => apiClient.put<Product>(`/products/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/products/${id}`),
};
