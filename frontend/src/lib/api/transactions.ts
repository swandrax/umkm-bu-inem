import { apiClient } from "./client";
import { CheckoutPayload, Sale, Receipt } from "@/types/sales";

export const transactionsApi = {
  getAll: (startDate?: string, endDate?: string, transactionNumber?: string) => {
    const sp = new URLSearchParams();
    if (startDate) sp.append("startDate", startDate);
    if (endDate) sp.append("endDate", endDate);
    if (transactionNumber) sp.append("transactionNumber", transactionNumber);
    const qs = sp.toString();
    return apiClient.get<Sale[]>(`/transactions${qs ? `?${qs}` : ""}`);
  },

  getById: (id: number) => apiClient.get<Sale>(`/transactions/${id}`),

  create: (payload: CheckoutPayload) => apiClient.post<Sale>("/transactions", payload),

  getReceipt: (id: number) => apiClient.get<Receipt>(`/transactions/${id}/receipt`),
};
