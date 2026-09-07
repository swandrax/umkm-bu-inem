import { Product } from "./product";

export interface DashboardAnalytics {
  todaySales: number;
  todayTransactions: number;
  productsSold: number;
  customerCount: number;
  apiStatus: string;
  dailySalesTrend: { date: string; total: number }[];
  topProducts: { name: string; quantity: number }[];
  paymentMethodStats: { method: string; count: number; total: number }[];
  lowStockProducts: Product[];
}

export interface ReportData {
  period: string;
  totalTransactions: number;
  sales: {
    id: number;
    transactionNumber: string;
    userName?: string;
    transactionDate: string;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    paymentMethod: string;
    status: string;
  }[];
}
