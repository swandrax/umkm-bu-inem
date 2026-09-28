import { apiClient } from "./client";
import { ServiceProduct, ServiceProductRequest } from "@/types/service";

export async function getServices(onlyActive = true, categoryId?: number): Promise<ServiceProduct[]> {
  const params = new URLSearchParams();
  if (onlyActive !== undefined) params.append("onlyActive", String(onlyActive));
  if (categoryId !== undefined) params.append("categoryId", String(categoryId));
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiClient.get<ServiceProduct[]>(`/services${query}`);
}

export async function getServiceById(id: number): Promise<ServiceProduct> {
  return apiClient.get<ServiceProduct>(`/services/${id}`);
}

export async function getServiceBySlug(slug: string): Promise<ServiceProduct> {
  return apiClient.get<ServiceProduct>(`/services/slug/${encodeURIComponent(slug)}`);
}

export async function createService(data: ServiceProductRequest): Promise<ServiceProduct> {
  return apiClient.post<ServiceProduct>("/services", data);
}

export async function updateService(id: number, data: ServiceProductRequest): Promise<ServiceProduct> {
  return apiClient.put<ServiceProduct>(`/services/${id}`, data);
}

export async function deleteService(id: number): Promise<void> {
  return apiClient.delete<void>(`/services/${id}`);
}
