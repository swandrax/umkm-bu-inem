export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  products: {
    all: ["products"] as const,
    list: (params?: Record<string, unknown>) => ["products", "list", params] as const,
    detail: (id: number) => ["products", "detail", id] as const,
  },
  categories: {
    all: ["categories"] as const,
    detail: (id: number) => ["categories", "detail", id] as const,
  },
  customers: {
    all: ["customers"] as const,
    list: (keyword?: string) => ["customers", "list", keyword] as const,
    detail: (id: number) => ["customers", "detail", id] as const,
  },
  transactions: {
    all: ["transactions"] as const,
    list: (startDate?: string, endDate?: string, trxNum?: string) =>
      ["transactions", "list", { startDate, endDate, trxNum }] as const,
    detail: (id: number) => ["transactions", "detail", id] as const,
    receipt: (id: number) => ["transactions", "receipt", id] as const,
  },
  dashboard: {
    metrics: ["dashboard", "metrics"] as const,
  },
  reports: {
    daily: (date: string) => ["reports", "daily", date] as const,
    weekly: (startDate: string) => ["reports", "weekly", startDate] as const,
    monthly: (year: number, month: number) => ["reports", "monthly", { year, month }] as const,
  },
  shipping: {
    all: ["shipping"] as const,
  },
  payments: {
    all: ["payments"] as const,
    bySale: (saleId: number) => ["payments", "bySale", saleId] as const,
  },
};
