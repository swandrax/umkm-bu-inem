"use client";

import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Tag,
  CreditCard,
  User,
  RotateCcw,
  Barcode,
  Package,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Customer } from "@/types/customer";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { formatRupiah } from "@/lib/utils";
import PaymentModal from "@/components/pos/PaymentModal";

export default function PosPage() {
  const {
    items,
    selectedCustomer,
    discountType,
    discountValue,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    setCustomer,
    setDiscount,
    subtotal,
    taxAmount,
    grandTotal,
  } = useCartStore();

  const {
    selectedPosCategory,
    setSelectedPosCategory,
    posSearchQuery,
    setPosSearchQuery,
  } = useUiStore();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.get<Category[]>("/categories"),
  });

  // Fetch Products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ["products", selectedPosCategory],
    queryFn: () => {
      const endpoint = selectedPosCategory
        ? `/products?categoryId=${selectedPosCategory}&active=true`
        : "/products?active=true";
      return apiClient.get<Product[]>(endpoint);
    },
  });

  // Fetch Customers for selector
  const { data: customers = [] } = useQuery({
    queryKey: ["customers"],
    queryFn: () => apiClient.get<Customer[]>("/customers"),
  });

  // Filter products by search query (Code or Name)
  const filteredProducts = products.filter((p) => {
    if (!posSearchQuery.trim()) return true;
    const q = posSearchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q);
  });

  // Keyboard shortcut listener (F5 = Bayar, F2 = Reset, / = Focus Search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F5") {
        e.preventDefault();
        if (items.length > 0) {
          setIsPaymentModalOpen(true);
        }
      } else if (e.key === "F2") {
        e.preventDefault();
        clearCart();
      } else if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, clearCart]);

  // Handle barcode / fast enter in search input
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredProducts.length > 0) {
      e.preventDefault();
      // If single exact match or first item, add it
      const target =
        filteredProducts.find(
          (p) => p.code.toLowerCase() === posSearchQuery.toLowerCase()
        ) || filteredProducts[0];
      if (target && target.stock > 0) {
        addItem(target, 1);
        setPosSearchQuery("");
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-6.5rem)]">
      {/* LEFT PANE: Product Catalog & Search (Flexible width) */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Search Bar & Barcode Mode */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={posSearchQuery}
              onChange={(e) => setPosSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Cari produk atau scan barcode (tekan Enter untuk tambah)..."
              className="w-full rounded-2xl border border-stone-200 bg-white py-3 pl-10 pr-12 text-sm text-stone-900 placeholder-stone-400 shadow-xs focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-800 dark:bg-stone-900 dark:text-white"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-stone-400">
              <Barcode className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedPosCategory(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
              selectedPosCategory === null
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800 dark:hover:bg-stone-800"
            }`}
          >
            Semua Kategori
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedPosCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                selectedPosCategory === cat.id
                  ? "bg-amber-500 text-white font-bold shadow-md shadow-amber-500/20"
                  : "bg-white text-stone-700 hover:bg-stone-100 border border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800 dark:hover:bg-stone-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto pr-1">
          {isLoadingProducts ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 rounded-2xl border border-dashed border-stone-300 bg-white/50 p-6 text-center dark:border-stone-800 dark:bg-stone-900/50">
              <Package className="h-10 w-10 text-stone-400 mb-2" />
              <p className="font-semibold text-sm text-stone-700 dark:text-stone-300">
                Produk tidak ditemukan
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Coba kata kunci pencarian atau kategori lain
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((product) => {
                const isOutOfStock = product.stock <= 0;
                const isLowStock = product.stock > 0 && product.stock <= 5;
                const cartItem = items.find((i) => i.productId === product.id);

                return (
                  <button
                    key={product.id}
                    type="button"
                    disabled={isOutOfStock}
                    onClick={() => addItem(product, 1)}
                    className={`relative flex flex-col justify-between p-3.5 rounded-2xl text-left border transition-all duration-150 active:scale-97 cursor-pointer ${
                      isOutOfStock
                        ? "opacity-50 border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-900/40 cursor-not-allowed"
                        : cartItem
                        ? "border-amber-500/80 bg-amber-500/10 shadow-md shadow-amber-500/10 dark:bg-amber-500/10"
                        : "border-stone-200 bg-white hover:border-amber-400 hover:shadow-md dark:border-stone-800 dark:bg-stone-900 dark:hover:border-stone-700"
                    }`}
                  >
                    {/* Top row: Code & in-cart badge */}
                    <div className="flex items-start justify-between w-full mb-2">
                      <span className="text-[10px] font-mono font-bold text-stone-400 dark:text-stone-400 uppercase">
                        {product.code}
                      </span>
                      {cartItem && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-[10px] shadow-xs">
                          {cartItem.quantity}
                        </span>
                      )}
                    </div>

                    {/* Middle: Product Name */}
                    <div className="flex-1 my-1">
                      <h3 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                      {product.categoryName && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                          {product.categoryName}
                        </span>
                      )}
                    </div>

                    {/* Bottom: Price & Stock */}
                    <div className="flex items-end justify-between w-full mt-3 pt-2 border-t border-stone-100 dark:border-stone-800/60">
                      <span className="font-mono font-extrabold text-xs sm:text-sm text-stone-900 dark:text-white">
                        {formatRupiah(product.price)}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isOutOfStock
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                            : isLowStock
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                        }`}
                      >
                        {isOutOfStock ? "Habis" : `Sisa ${product.stock}`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANE: Cart & Checkout (Fixed 380px or 420px on desktop) */}
      <div className="w-full lg:w-[400px] xl:w-[420px] flex flex-col rounded-3xl border border-stone-200 bg-white shadow-xl dark:border-stone-800 dark:bg-stone-900 overflow-hidden shrink-0">
        {/* Cart Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50/60 dark:bg-stone-950/30">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-amber-500" />
            <h2 className="font-bold text-sm text-stone-900 dark:text-white">
              Keranjang Transaksi
            </h2>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
              {items.length} item
            </span>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearCart}
              className="flex items-center gap-1 text-[11px] font-semibold text-rose-500 hover:text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset (F2)</span>
            </button>
          )}
        </div>

        {/* Customer Selector Bar */}
        <div className="px-4 py-2.5 bg-stone-100/60 dark:bg-stone-800/40 border-b border-stone-200/60 dark:border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-stone-400" />
            <span className="text-stone-500 dark:text-stone-400">Pelanggan:</span>
            <span className="font-bold text-stone-900 dark:text-stone-200 truncate max-w-[140px]">
              {selectedCustomer ? selectedCustomer.name : "Umum (Non-Member)"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setCustomerModalOpen(true)}
            className="text-[11px] text-amber-600 dark:text-amber-400 font-bold hover:underline cursor-pointer"
          >
            {selectedCustomer ? "Ubah" : "Pilih"}
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-stone-400">
              <ShoppingCart className="h-12 w-12 stroke-1 mb-2 opacity-40" />
              <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
                Keranjang Masih Kosong
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Pilih atau scan produk di katalog sebelah kiri untuk mulai transaksi
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-800"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                    {item.productName}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-mono">
                    {formatRupiah(item.price)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1.5 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700/80 p-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="h-6 w-6 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center font-bold text-xs font-mono text-stone-900 dark:text-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="h-6 w-6 rounded-lg flex items-center justify-center text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Line Total & Remove */}
                <div className="text-right flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-stone-900 dark:text-white">
                    {formatRupiah(item.subtotal)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-stone-400 hover:text-rose-500 p-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculation & Checkout Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/80 dark:bg-stone-950/50 space-y-2.5">
          {/* Subtotal */}
          <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400">
            <span>Subtotal</span>
            <span className="font-mono font-semibold">{formatRupiah(subtotal())}</span>
          </div>

          {/* Discount Field */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-400">
              <Tag className="h-3.5 w-3.5 text-amber-500" />
              <span>Diskon:</span>
            </div>
            <div className="flex items-center gap-1">
              <select
                value={discountType}
                onChange={(e) =>
                  setDiscount(e.target.value as "FIXED" | "PERCENT", discountValue)
                }
                className="rounded-lg border border-stone-200 bg-white px-2 py-1 text-[11px] font-bold text-stone-800 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
              >
                <option value="FIXED">Rp</option>
                <option value="PERCENT">%</option>
              </select>
              <input
                type="number"
                min="0"
                value={discountValue || ""}
                onChange={(e) => setDiscount(discountType, Number(e.target.value))}
                placeholder="0"
                className="w-20 rounded-lg border border-stone-200 bg-white px-2 py-1 text-right text-xs font-mono font-bold text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
              />
            </div>
          </div>

          {/* Tax (PPN 10%) */}
          <div className="flex justify-between text-xs text-stone-600 dark:text-stone-400">
            <span>PPN (10%)</span>
            <span className="font-mono font-semibold">{formatRupiah(taxAmount())}</span>
          </div>

          {/* Grand Total */}
          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 flex justify-between items-baseline">
            <span className="font-bold text-sm text-stone-900 dark:text-white">
              Grand Total
            </span>
            <span className="font-mono font-black text-xl text-amber-600 dark:text-amber-400">
              {formatRupiah(grandTotal())}
            </span>
          </div>

          {/* Checkout Trigger */}
          <button
            type="button"
            disabled={items.length === 0}
            onClick={() => setIsPaymentModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 py-3.5 text-sm font-black text-white shadow-xl shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <CreditCard className="h-4 w-4" />
            <span>Bayar Sekarang (F5)</span>
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSuccess={() => setIsPaymentModalOpen(false)}
      />

      {/* Customer Picker Modal */}
      {customerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-stone-900 border border-stone-800 p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-base text-white">Pilih Pelanggan</h3>
              <button
                type="button"
                onClick={() => setCustomerModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              <button
                type="button"
                onClick={() => {
                  setCustomer(null);
                  setCustomerModalOpen(false);
                }}
                className={`w-full p-3 text-left rounded-xl border text-xs font-semibold ${
                  selectedCustomer === null
                    ? "border-amber-500 bg-amber-500/10 text-amber-400"
                    : "border-stone-800 bg-stone-800/40 text-stone-300"
                }`}
              >
                Umum (Bukan Member)
              </button>
              {customers.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setCustomer(c);
                    setCustomerModalOpen(false);
                  }}
                  className={`w-full p-3 text-left rounded-xl border text-xs flex justify-between items-center ${
                    selectedCustomer?.id === c.id
                      ? "border-amber-500 bg-amber-500/10 text-amber-400"
                      : "border-stone-800 bg-stone-800/40 text-stone-300 hover:bg-stone-800"
                  }`}
                >
                  <div>
                    <div className="font-bold text-white">{c.name}</div>
                    <div className="text-[10px] text-stone-400 font-mono">{c.phone || "-"}</div>
                  </div>
                  {c.loyaltyPoints ? (
                    <span className="text-[10px] text-amber-400 font-semibold">
                      {c.loyaltyPoints} Poin
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
