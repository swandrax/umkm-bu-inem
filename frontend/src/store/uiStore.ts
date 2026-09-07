import { create } from "zustand";
import { Receipt } from "@/types/sales";

interface UiState {
  isSidebarOpen: boolean;
  activeReceipt: Receipt | null;
  isReceiptModalOpen: boolean;
  selectedPosCategory: number | null; // null = all
  posSearchQuery: string;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openReceiptModal: (receipt: Receipt) => void;
  closeReceiptModal: () => void;
  setSelectedPosCategory: (categoryId: number | null) => void;
  setPosSearchQuery: (query: string) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isSidebarOpen: true,
  activeReceipt: null,
  isReceiptModalOpen: false,
  selectedPosCategory: null,
  posSearchQuery: "",

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  openReceiptModal: (receipt) =>
    set({ activeReceipt: receipt, isReceiptModalOpen: true }),
  closeReceiptModal: () =>
    set({ activeReceipt: null, isReceiptModalOpen: false }),
  setSelectedPosCategory: (categoryId) =>
    set({ selectedPosCategory: categoryId }),
  setPosSearchQuery: (query) => set({ posSearchQuery: query }),
}));
