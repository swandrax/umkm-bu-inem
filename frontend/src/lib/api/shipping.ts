import { apiClient } from "./client";

export interface ShippingRecord {
  id: number;
  saleId: number;
  shippingType: string;
  shippingStatus: string;
  customerNotes?: string;
  courierNotes?: string;
}

export const shippingApi = {
  getAll: () => apiClient.get<ShippingRecord[]>("/shipping"),
  updateStatus: (id: number, status: string, notes?: string) =>
    apiClient.put<void>(`/shipping/${id}/status`, { status, notes }),
};
