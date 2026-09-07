import { apiClient } from "./client";
import { Customer } from "@/types/customer";

export const customersApi = {
  getAll: (keyword?: string) => {
    const url = keyword ? `/customers?keyword=${encodeURIComponent(keyword)}` : "/customers";
    return apiClient.get<Customer[]>(url);
  },

  getById: (id: number) => apiClient.get<Customer>(`/customers/${id}`),

  create: (data: { name: string; phone?: string; address?: string }) =>
    apiClient.post<Customer>("/customers", data),

  update: (id: number, data: { name: string; phone?: string; address?: string }) =>
    apiClient.put<Customer>(`/customers/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/customers/${id}`),
};
