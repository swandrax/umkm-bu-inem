export interface OrderItem {
  id?: number;
  orderId?: number;
  serviceProductId: number;
  productNameSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
  discount: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customerCompany?: string;
  status: "DRAFT" | "PENDING" | "WAITING_PAYMENT" | "PAID" | "PROCESSING" | "COMPLETED" | "CANCELED" | "REFUNDED";
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "REFUNDED";
  paymentMethod?: "CASH" | "QRIS_DUMMY" | "TRANSFER" | string;
  notes?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderItemRequest {
  serviceProductId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCompany?: string;
  customerAddress?: string;
  paymentMethod?: string;
  notes?: string;
  items: CreateOrderItemRequest[];
}

export interface PaymentProof {
  orderNumber: string;
  paymentReference: string;
  customerName: string;
  paymentMethod: string;
  totalAmount: number;
  amountReceived?: number;
  changeAmount?: number;
  status: string;
  isDemoQris: boolean;
  paymentDate: string;
  operator: string;
  notes?: string;
}

export interface DigitalReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
}

export interface DigitalReceipt {
  orderNumber: string;
  receiptNumber: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  customerServiceEmail: string;
  receiptFooter: string;
  customerName: string;
  customerPhone?: string;
  paymentMethod: string;
  paymentStatus: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  amountReceived?: number;
  changeAmount?: number;
  barcodeValue: string;
  date: string;
  operator: string;
  items: DigitalReceiptItem[];
}
