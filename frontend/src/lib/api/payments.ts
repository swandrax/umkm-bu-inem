import { apiClient } from "./client";

export interface PaymentRecord {
  id: number;
  saleId: number;
  paymentMethod: string;
  amount: number;
  referenceNumber: string;
  status: string;
  paymentDate: string;
}

export const paymentsApi = {
  getAll: () => apiClient.get<PaymentRecord[]>("/payments"),
  getBySaleId: (saleId: number) => apiClient.get<PaymentRecord[]>(`/payments/sale/${saleId}`),
};

