export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export interface Lead {
  id: number;
  customerId?: number;
  name: string;
  email?: string;
  phone?: string;
  source: string;
  serviceInterest?: string;
  estimatedValue: number;
  status: LeadStatus;
  assignedTo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadRequest {
  customerId?: number;
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  serviceInterest?: string;
  estimatedValue?: number;
  status?: LeadStatus;
  assignedTo?: string;
  notes?: string;
}

export interface CrmActivity {
  id: number;
  customerId?: number;
  leadId?: number;
  orderId?: number;
  activityType: string;
  title: string;
  description?: string;
  actor: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CrmDashboard {
  totalCustomers: int;
  activeLeads: int;
  newLeads: int;
  qualifiedLeads: int;
  wonDeals: int;
  totalOrders: int;
  paidOrders: int;
  unpaidOrders: int;
  totalRevenue: number;
  recentActivities: CrmActivity[];
}
type int = number;
