import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  activeReceiptId: number | null;
  paymentModalOpen: boolean;
  productModalOpen: boolean;
  customerModalOpen: boolean;
  categoryModalOpen: boolean;

  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  openReceiptModal: (saleId: number) => void;
  closeReceiptModal: () => void;
  setPaymentModalOpen: (open: boolean) => void;
  setProductModalOpen: (open: boolean) => void;
  setCustomerModalOpen: (open: boolean) => void;
  setCategoryModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeReceiptId: null,
  paymentModalOpen: false,
  productModalOpen: false,
  customerModalOpen: false,
  categoryModalOpen: false,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  openReceiptModal: (saleId) => set({ activeReceiptId: saleId }),
  closeReceiptModal: () => set({ activeReceiptId: null }),
  setPaymentModalOpen: (open) => set({ paymentModalOpen: open }),
  setProductModalOpen: (open) => set({ productModalOpen: open }),
  setCustomerModalOpen: (open) => set({ customerModalOpen: open }),
  setCategoryModalOpen: (open) => set({ categoryModalOpen: open }),
}));
