import { apiClient } from "./client";
import { Lead, LeadRequest } from "@/types/crm";

export async function getLeads(status?: string, search?: string): Promise<Lead[]> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (search) params.append("search", search);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiClient.get<Lead[]>(`/leads${query}`);
}

export async function getLeadById(id: number): Promise<Lead> {
  return apiClient.get<Lead>(`/leads/${id}`);
}

export async function createLead(data: LeadRequest): Promise<Lead> {
  return apiClient.post<Lead>("/leads", data);
}

export async function updateLead(id: number, data: LeadRequest): Promise<Lead> {
  return apiClient.put<Lead>(`/leads/${id}`, data);
}

export async function updateLeadStatus(id: number, status: string): Promise<Lead> {
  return apiClient.patch<Lead>(`/leads/${id}/status`, { status });
}

export async function deleteLead(id: number): Promise<void> {
  return apiClient.delete<void>(`/leads/${id}`);
}
