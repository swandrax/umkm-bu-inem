import { apiClient } from "./client";
import { CrmActivity, CrmDashboard } from "@/types/crm";

export async function getCrmDashboard(): Promise<CrmDashboard> {
  return apiClient.get<CrmDashboard>("/crm/dashboard");
}

export async function getRecentActivities(limit = 30): Promise<CrmActivity[]> {
  return apiClient.get<CrmActivity[]>(`/crm/activities?limit=${limit}`);
}

export async function getCustomerActivities(customerId: number): Promise<CrmActivity[]> {
  return apiClient.get<CrmActivity[]>(`/crm/customers/${customerId}/activities`);
}
