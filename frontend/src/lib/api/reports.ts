import { apiClient } from "./client";
import { ReportData, DashboardAnalytics } from "@/types/analytics";

export const reportsApi = {
  getDaily: (date: string) => apiClient.get<ReportData>(`/reports/daily?date=${date}`),
  getWeekly: (startDate: string) => apiClient.get<ReportData>(`/reports/weekly?startDate=${startDate}`),
  getMonthly: (year: number, month: number) => apiClient.get<ReportData>(`/reports/monthly?year=${year}&month=${month}`),
  getDashboard: () => apiClient.get<DashboardAnalytics>("/dashboard"),
  exportPdf: (startDate: string, endDate: string) =>
    apiClient.downloadBlob(`/reports/export/pdf?startDate=${startDate}&endDate=${endDate}`),
  exportExcel: (startDate: string, endDate: string) =>
    apiClient.downloadBlob(`/reports/export/excel?startDate=${startDate}&endDate=${endDate}`),
  exportCsv: (startDate: string, endDate: string) =>
    apiClient.downloadBlob(`/reports/export/csv?startDate=${startDate}&endDate=${endDate}`),
};
