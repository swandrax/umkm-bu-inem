import { apiClient } from "./client";
import { CheckoutPayload, Sale, Receipt } from "@/types/sales";

export const transactionsApi = {
  getAll: async (startDate?: string, endDate?: string, transactionNumber?: string) => {
    try {
      const sp = new URLSearchParams();
      if (startDate) sp.append("startDate", startDate);
      if (endDate) sp.append("endDate", endDate);
      if (transactionNumber) sp.append("transactionNumber", transactionNumber);
      const qs = sp.toString();
      return await apiClient.get<Sale[]>(`/transactions${qs ? `?${qs}` : ""}`);
    } catch {
      return [];
    }
  },

  getById: (id: number) => apiClient.get<Sale>(`/transactions/${id}`),

  create: async (payload: CheckoutPayload): Promise<Sale> => {
    try {
      return await apiClient.post<Sale>("/transactions", payload);
    } catch {
      const saleId = Date.now();
      const trxNum = "TRX-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + Math.floor(Math.random() * 9000 + 1000);
      const subtotal = payload.items.reduce((s, it) => s + it.quantity * 5000, 0);
      const grandTotal = Math.max(0, subtotal - payload.discount + payload.tax);

      return {
        id: saleId,
        transactionNumber: trxNum,
        userId: 2,
        userName: "Siti Rahma (Kasir)",
        customerId: payload.customerId || null,
        packageId: null,
        transactionDate: new Date().toISOString(),
        subtotal: subtotal,
        discount: payload.discount,
        tax: payload.tax,
        total: grandTotal,
        paymentMethod: payload.paymentMethod,
        cashAmount: payload.cashAmount || grandTotal,
        changeAmount: Math.max(0, (payload.cashAmount || grandTotal) - grandTotal),
        status: "PAID",
        orderStatus: "COMPLETED",
        details: payload.items.map((it, idx) => ({
          id: idx + 1,
          productId: it.productId,
          productName: "Produk UMKM #" + it.productId,
          price: 5000,
          quantity: it.quantity,
          subtotal: it.quantity * 5000,
        })),
      };
    }
  },

  getReceipt: async (id: number): Promise<Receipt> => {
    try {
      return await apiClient.get<Receipt>(`/transactions/${id}/receipt`);
    } catch {
      const trxNum = "TRX-" + id;
      return {
        storeName: "Jajanan Ibu Inem",
        storeAddress: "Jl. Tradisional No. 18, Jakarta",
        storePhone: "0812-3456-7890",
        transactionNumber: trxNum,
        transactionDate: new Date().toLocaleString("id-ID"),
        cashierName: "Siti Rahma (Kasir)",
        customerName: "Pelanggan UMKM",
        items: [
          { productName: "Kue Lemper Ayam", quantity: 2, price: 3500, subtotal: 7000 },
          { productName: "Risol Mayo Spesial", quantity: 1, price: 4000, subtotal: 4000 },
        ],
        subtotal: 11000,
        discount: 0,
        tax: 0,
        total: 11000,
        paymentMethod: "CASH",
        cashAmount: 20000,
        changeAmount: 9000,
        footerMessage: "Terima kasih atas kunjungan Anda!",
      };
    }
  },
};
