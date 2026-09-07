import { create } from "zustand";
import { CartItem, PaymentMethod, ShippingInput } from "@/types/sales";
import { Product } from "@/types/product";
import { Customer } from "@/types/customer";

interface CartState {
  items: CartItem[];
  customerId: number | null;
  selectedCustomer: Customer | null;
  packageId: number | null;
  discountType: "FIXED" | "PERCENT";
  discountValue: number;
  taxRate: number; // default 10%
  paymentMethod: PaymentMethod;
  cashAmount: number;
  shipping: ShippingInput | null;

  // Computed values
  subtotal: () => number;
  discountAmount: () => number;
  taxAmount: () => number;
  grandTotal: () => number;
  changeAmount: () => number;

  // Actions
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
  setCustomer: (customer: Customer | null) => void;
  setPackageId: (packageId: number | null) => void;
  setDiscount: (type: "FIXED" | "PERCENT", value: number) => void;
  setTaxRate: (rate: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setCashAmount: (amount: number) => void;
  setShipping: (shipping: ShippingInput | null) => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  customerId: null,
  selectedCustomer: null,
  packageId: null,
  discountType: "FIXED",
  discountValue: 0,
  taxRate: 10, // 10% PPN
  paymentMethod: "CASH",
  cashAmount: 0,
  shipping: null,

  subtotal: () => {
    return get().items.reduce((acc, item) => acc + item.subtotal, 0);
  },

  discountAmount: () => {
    const sub = get().subtotal();
    const { discountType, discountValue } = get();
    if (discountType === "PERCENT") {
      return (sub * Math.min(100, Math.max(0, discountValue))) / 100;
    }
    return Math.min(sub, Math.max(0, discountValue));
  },

  taxAmount: () => {
    const sub = get().subtotal();
    const disc = get().discountAmount();
    const taxable = Math.max(0, sub - disc);
    return Math.round((taxable * get().taxRate) / 100);
  },

  grandTotal: () => {
    const sub = get().subtotal();
    const disc = get().discountAmount();
    const tax = get().taxAmount();
    const shippingCost = get().shipping?.shippingCost || 0;
    return Math.max(0, sub - disc + tax + shippingCost);
  },

  changeAmount: () => {
    const method = get().paymentMethod;
    if (method !== "CASH") return 0;
    const total = get().grandTotal();
    const tendered = get().cashAmount;
    return Math.max(0, tendered - total);
  },

  addItem: (product: Product, quantity = 1) => {
    const current = get().items;
    const existing = current.find((i) => i.productId === product.id);

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (newQty > product.stock) {
        alert(`Stok tidak mencukupi! Sisa stok: ${product.stock}`);
        return;
      }
      set({
        items: current.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: newQty, subtotal: newQty * i.price }
            : i
        ),
      });
    } else {
      if (quantity > product.stock) {
        alert(`Stok tidak mencukupi! Sisa stok: ${product.stock}`);
        return;
      }
      set({
        items: [
          ...current,
          {
            productId: product.id,
            productCode: product.code,
            productName: product.name,
            price: product.price,
            quantity,
            subtotal: product.price * quantity,
            stock: product.stock,
          },
        ],
      });
    }
  },

  updateQuantity: (productId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    const current = get().items;
    const item = current.find((i) => i.productId === productId);
    if (!item) return;

    if (quantity > item.stock) {
      alert(`Stok tidak mencukupi! Sisa stok: ${item.stock}`);
      return;
    }

    set({
      items: current.map((i) =>
        i.productId === productId
          ? { ...i, quantity, subtotal: quantity * i.price }
          : i
      ),
    });
  },

  removeItem: (productId: number) => {
    set({
      items: get().items.filter((i) => i.productId !== productId),
    });
  },

  clearCart: () => {
    set({
      items: [],
      customerId: null,
      selectedCustomer: null,
      packageId: null,
      discountValue: 0,
      cashAmount: 0,
      shipping: null,
    });
  },

  setCustomer: (customer: Customer | null) => {
    set({
      selectedCustomer: customer,
      customerId: customer ? customer.id : null,
    });
  },

  setPackageId: (packageId: number | null) => set({ packageId }),
  setDiscount: (type: "FIXED" | "PERCENT", value: number) =>
    set({ discountType: type, discountValue: Math.max(0, value) }),
  setTaxRate: (rate: number) => set({ taxRate: Math.max(0, rate) }),
  setPaymentMethod: (method: PaymentMethod) => set({ paymentMethod: method }),
  setCashAmount: (amount: number) => set({ cashAmount: Math.max(0, amount) }),
  setShipping: (shipping: ShippingInput | null) => set({ shipping }),
}));
