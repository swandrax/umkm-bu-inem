"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Tag,
  CreditCard,
  User as UserIcon,
  RotateCcw,
  Package,
} from "lucide-react";
import { useProductsQuery } from "@/hooks/useProducts";
import { useCategoriesQuery } from "@/hooks/useCategories";
import { useCustomersQuery } from "@/hooks/useCustomers";
import { useCartStore } from "@/stores/cart.store";
import { useUIStore } from "@/stores/ui.store";
import { useFilterStore } from "@/stores/filter.store";
import { formatRupiah } from "@/lib/utils";
import PaymentModal from "@/components/pos/PaymentModal";

export default function PosPage() {
  const {
    items,
    customerId,
    discount,
    taxPercent,
    addItem,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    setCustomerId,
    setDiscount,
    setTaxPercent,
    getSubtotal,
    getGrandTotal,
  } = useCartStore();

  const { searchQuery, setSearchQuery, selectedCategoryId, setSelectedCategoryId } =
    useFilterStore();
  const { openReceiptModal } = useUIStore();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // TanStack Query for server state
  const { data: categories = [] } = useCategoriesQuery();
  const { data: products = [], isLoading: isLoadingProducts } = useProductsQuery({
    query: searchQuery,
    categoryId: selectedCategoryId,
    onlyActive: true,
  });
  const { data: customers = [] } = useCustomersQuery();

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePaymentSuccess = (saleId: number) => {
    openReceiptModal(saleId);
  };

  const selectedCustomerObj = customers.find((c) => c.id === customerId);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start h-[calc(100vh-6.5rem)]">
      {/* Left: Product Catalog & Category Filter */}
      <div className="flex-1 flex flex-col h-full min-w-0 space-y-4">
        {/* Top Controls: Search Bar & Quick Categories */}
        <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari jajanan atau scan barcode... (Tekan '/' untuk fokus)"
              className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 py-2.5 pl-10 pr-10 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-stone-400 hover:text-stone-700"
              >
                Reset
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategoryId(0)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategoryId === 0
                  ? "bg-amber-500 text-white shadow-sm shadow-amber-500/20"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Semua Menu
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategoryId(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategoryId === c.id
                    ? "bg-amber-500 text-white shadow-sm shadow-amber-500/20"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {isLoadingProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 rounded-3xl bg-stone-200/60 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {products.map((p) => {
                const inCart = items.find((i) => i.product.id === p.id);
                const isOutOfStock = p.stock <= 0;

                return (
                  <div
                    key={p.id}
                    onClick={() => !isOutOfStock && addItem(p)}
                    className={`relative p-4 rounded-3xl border bg-white shadow-xs transition-all flex flex-col justify-between select-none ${
                      isOutOfStock
                        ? "opacity-50 cursor-not-allowed border-stone-200"
                        : "cursor-pointer hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 active:scale-98 border-stone-200/80"
                    }`}
                  >
                    {inCart && (
                      <span className="absolute top-2.5 right-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 text-[11px] font-bold text-white shadow-xs">
                        {inCart.quantity}
                      </span>
                    )}

                    <div>
                      <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                        {p.categoryName || "Umum"}
                      </span>
                      <h3 className="font-bold text-xs sm:text-sm text-stone-900 line-clamp-2 mt-0.5">
                        {p.name}
                      </h3>
                      <p className="text-[10px] text-stone-500 font-mono mt-0.5">{p.code}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="font-black text-xs sm:text-sm text-orange-600 font-mono">
                        {formatRupiah(p.price)}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          p.stock <= 5 ? "text-rose-600" : "text-stone-500"
                        }`}
                      >
                        {isOutOfStock ? "Habis" : `Stok: ${p.stock}`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-stone-200 p-6 text-center space-y-2">
              <Package className="h-10 w-10 text-stone-300" />
              <p className="text-sm font-bold text-stone-700">Tidak ada jajanan ditemukan</p>
              <p className="text-xs text-stone-400">Coba ganti kata kunci pencarian atau kategori.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Cart & Checkout Panel */}
      <div className="w-full lg:w-96 flex flex-col h-full bg-white rounded-3xl border border-stone-200/80 shadow-md p-5 space-y-4">
        {/* Cart Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/50">
              <ShoppingCart className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-stone-900">Keranjang Kasir</h2>
              <span className="text-[10px] text-stone-400 font-medium">
                {items.length} jenis item dipilih
              </span>
            </div>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              className="p-1.5 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Kosongkan keranjang"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Customer Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1">
            <UserIcon className="h-3 w-3 text-amber-500" />
            <span>Pelanggan</span>
          </label>
          <select
            value={customerId || ""}
            onChange={(e) => setCustomerId(e.target.value ? Number(e.target.value) : null)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50/70 px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500"
          >
            <option value="">Pelanggan Umum (Walk-in)</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.phone ? `(${c.phone})` : ""}
              </option>
            ))}
          </select>
          {selectedCustomerObj && (
            <div className="flex items-center justify-between text-[11px] text-amber-800 bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg">
              <span>Poin Loyalitas:</span>
              <span className="font-bold font-mono">{selectedCustomerObj.loyaltyPoints || 0} Poin</span>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {items.length > 0 ? (
            items.map((item) => (
              <div
                key={item.product.id}
                className="p-3 rounded-2xl bg-stone-50/70 border border-stone-200/70 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-stone-900 truncate">{item.product.name}</p>
                  <p className="text-[11px] text-stone-500 font-mono">
                    {formatRupiah(item.product.price)}
                  </p>
                </div>

                {/* Qty Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => decreaseQuantity(item.product.id)}
                    className="h-6 w-6 rounded-lg bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center font-bold text-stone-900 font-mono">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseQuantity(item.product.id)}
                    className="h-6 w-6 rounded-lg bg-white border border-stone-300 flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="h-6 w-6 rounded-lg text-stone-400 hover:text-rose-600 flex items-center justify-center ml-1 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-8 text-stone-400">
              <ShoppingCart className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-xs font-semibold">Keranjang masih kosong</p>
              <p className="text-[10px]">Klik jajanan di katalog untuk menambahkan</p>
            </div>
          )}
        </div>

        {/* Calculation Summary */}
        <div className="space-y-2 pt-3 border-t border-stone-100 text-xs">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal:</span>
            <span className="font-bold font-mono text-stone-900">
              {formatRupiah(getSubtotal())}
            </span>
          </div>

          <div className="flex items-center justify-between text-stone-600">
            <span className="flex items-center gap-1">
              <Tag className="h-3 w-3 text-amber-500" />
              <span>Diskon (Rp):</span>
            </span>
            <input
              type="number"
              value={discount || ""}
              onChange={(e) => setDiscount(Number(e.target.value) || 0)}
              placeholder="0"
              className="w-24 text-right rounded-lg border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-mono font-bold text-rose-600 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-between text-stone-600">
            <span>Pajak (%):</span>
            <input
              type="number"
              value={taxPercent || ""}
              onChange={(e) => setTaxPercent(Number(e.target.value) || 0)}
              placeholder="0"
              className="w-16 text-right rounded-lg border border-stone-200 bg-stone-50 px-2 py-0.5 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-stone-200">
            <span className="font-bold text-xs text-stone-800 uppercase">Grand Total:</span>
            <span className="text-xl font-black font-mono text-orange-600">
              {formatRupiah(getGrandTotal())}
            </span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          type="button"
          disabled={items.length === 0}
          onClick={() => setPaymentModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all active:scale-98 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
        >
          <CreditCard className="h-4 w-4" />
          <span>BAYAR KASIR ({formatRupiah(getGrandTotal())})</span>
        </button>
      </div>

      {/* Payment Processing Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}
