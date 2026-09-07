import { create } from "zustand";

interface FilterState {
  searchQuery: string;
  selectedCategoryId: number;
  sortBy: string;
  onlyActive: boolean;

  setSearchQuery: (query: string) => void;
  setSelectedCategoryId: (catId: number) => void;
  setSortBy: (sort: string) => void;
  setOnlyActive: (active: boolean) => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: "",
  selectedCategoryId: 0,
  sortBy: "Nama",
  onlyActive: true,

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategoryId: (selectedCategoryId) => set({ selectedCategoryId }),
  setSortBy: (sortBy) => set({ sortBy }),
  setOnlyActive: (onlyActive) => set({ onlyActive }),
  resetFilters: () =>
    set({
      searchQuery: "",
      selectedCategoryId: 0,
      sortBy: "Nama",
      onlyActive: true,
    }),
}));
