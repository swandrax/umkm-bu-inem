export type PaymentMethod =
  | "CASH"
  | "QRIS"
  | "TRANSFER"
  | "DEBIT"
  | "OVO"
  | "GOPAY"
  | "DANA"
  | "SHOPEEPAY";

export interface CartItem {
  productId: number;
  productCode: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
  stock: number;
}

export interface ShippingInput {
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  courierName?: string;
  trackingNumber?: string;
  shippingCost?: number;
  notes?: string;
}

export interface CheckoutRequest {
  customerId?: number | null;
  packageId?: number | null;
  paymentMethod: PaymentMethod;
  cashAmount: number;
  discount: number;
  tax: number;
  items: {
    productId: number;
    quantity: number;
  }[];
  shipping?: ShippingInput;
}

export interface SaleDetail {
  id: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  transactionNumber: string;
  userId: number;
  userName?: string;
  customerId?: number | null;
  packageId?: number | null;
  transactionDate: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  cashAmount: number;
  changeAmount: number;
  status: string;
  orderStatus?: string;
  details: SaleDetail[];
}

export interface ReceiptItem {
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Receipt {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  transactionNumber: string;
  transactionDate: string;
  cashierName: string;
  customerName?: string;
  items: ReceiptItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  cashAmount: number;
  changeAmount: number;
  qrCodeContent?: string;
  footerMessage: string;
}
