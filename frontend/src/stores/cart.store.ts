import { create } from "zustand";
import { Product } from "@/types/product";
import { CartItem } from "@/types/sales";

interface CartState {
  items: CartItem[];
  customerId: number | null;
  discount: number;
  taxPercent: number;
  paymentMethod: string;
  cashAmount: number;

  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  increaseQuantity: (productId: number) => void;
  decreaseQuantity: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;

  setCustomerId: (customerId: number | null) => void;
  setDiscount: (discount: number) => void;
  setTaxPercent: (taxPercent: number) => void;
  setPaymentMethod: (method: string) => void;
  setCashAmount: (amount: number) => void;

  // Calculators
  getSubtotal: () => number;
  getTaxAmount: () => number;
  getGrandTotal: () => number;
  getChangeAmount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  customerId: null,
  discount: 0,
  taxPercent: 0,
  paymentMethod: "CASH",
  cashAmount: 0,

  addItem: (product: Product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: newQty,
                  subtotal: newQty * item.product.price,
                }
              : item
          ),
        };
      } else {
        if (product.stock <= 0) return state;
        const initQty = Math.min(quantity, product.stock);
        return {
          items: [
            ...state.items,
            {
              product,
              quantity: initQty,
              subtotal: initQty * product.price,
            },
          ],
        };
      }
    });
  },

  removeItem: (productId: number) => {
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    }));
  },

  increaseQuantity: (productId: number) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.product.id === productId) {
          const newQty = Math.min(item.quantity + 1, item.product.stock);
          return {
            ...item,
            quantity: newQty,
            subtotal: newQty * item.product.price,
          };
        }
        return item;
      }),
    }));
  },

  decreaseQuantity: (productId: number) => {
    set((state) => {
      const target = state.items.find((i) => i.product.id === productId);
      if (!target) return state;
      if (target.quantity <= 1) {
        return {
          items: state.items.filter((i) => i.product.id !== productId),
        };
      }
      return {
        items: state.items.map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity - 1;
            return {
              ...item,
              quantity: newQty,
              subtotal: newQty * item.product.price,
            };
          }
          return item;
        }),
      };
    });
  },

  updateQuantity: (productId: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) => {
        if (item.product.id === productId) {
          const newQty = Math.min(quantity, item.product.stock);
          return {
            ...item,
            quantity: newQty,
            subtotal: newQty * item.product.price,
          };
        }
        return item;
      }),
    }));
  },

  clearCart: () => {
    set({
      items: [],
      customerId: null,
      discount: 0,
      taxPercent: 0,
      cashAmount: 0,
    });
  },

  setCustomerId: (customerId) => set({ customerId }),
  setDiscount: (discount) => set({ discount: Math.max(0, discount) }),
  setTaxPercent: (taxPercent) => set({ taxPercent: Math.max(0, taxPercent) }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setCashAmount: (cashAmount) => set({ cashAmount }),

  getSubtotal: () => {
    return get().items.reduce((acc, item) => acc + item.subtotal, 0);
  },

  getTaxAmount: () => {
    const subtotal = get().getSubtotal();
    const discount = get().discount;
    const taxable = Math.max(0, subtotal - discount);
    return Math.round((taxable * get().taxPercent) / 100);
  },

  getGrandTotal: () => {
    const subtotal = get().getSubtotal();
    const discount = get().discount;
    const tax = get().getTaxAmount();
    return Math.max(0, subtotal - discount + tax);
  },

  getChangeAmount: () => {
    const grandTotal = get().getGrandTotal();
    const cashAmount = get().cashAmount;
    if (get().paymentMethod !== "CASH") return 0;
    return Math.max(0, cashAmount - grandTotal);
  },
}));
