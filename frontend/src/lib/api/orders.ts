import { apiClient } from "./client";
import {
  Order,
  CreateOrderRequest,
  PaymentProof,
  DigitalReceipt,
} from "@/types/order";

export async function createOrder(data: CreateOrderRequest): Promise<Order> {
  return apiClient.post<Order>("/orders", data);
}

export async function getOrderByNumber(orderNumber: string): Promise<Order> {
  return apiClient.get<Order>(`/orders/${encodeURIComponent(orderNumber)}`);
}

export interface OrderStatusSync {
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  isPaid: boolean;
  updatedAt: string;
}

export async function getOrderStatus(orderNumber: string): Promise<OrderStatusSync> {
  return apiClient.get<OrderStatusSync>(`/orders/${encodeURIComponent(orderNumber)}/status`);
}

export async function simulateQris(
  orderNumber: string,
  action: "SUCCESS" | "FAILED" | "EXPIRED" = "SUCCESS"
): Promise<PaymentProof> {
  return apiClient.post<PaymentProof>(
    `/orders/${encodeURIComponent(orderNumber)}/simulate-qris`,
    { action }
  );
}

export async function payCash(
  orderNumber: string,
  amountReceived: number
): Promise<PaymentProof> {
  return apiClient.post<PaymentProof>(
    `/orders/${encodeURIComponent(orderNumber)}/pay-cash`,
    { amountReceived }
  );
}

export async function getPaymentProof(orderNumber: string): Promise<PaymentProof> {
  return apiClient.get<PaymentProof>(`/orders/${encodeURIComponent(orderNumber)}/payment-proof`);
}

export async function getDigitalReceipt(orderNumber: string): Promise<DigitalReceipt> {
  return apiClient.get<DigitalReceipt>(`/orders/${encodeURIComponent(orderNumber)}/receipt`);
}

export async function getAllOrders(
  status?: string,
  paymentStatus?: string,
  search?: string,
  limit = 50,
  offset = 0
): Promise<Order[]> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (paymentStatus) params.append("paymentStatus", paymentStatus);
  if (search) params.append("search", search);
  params.append("limit", String(limit));
  params.append("offset", String(offset));
  return apiClient.get<Order[]>(`/orders?${params.toString()}`);
}
