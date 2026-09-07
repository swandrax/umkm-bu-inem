"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  X,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Product, ProductInput } from "@/types/product";
import { Category } from "@/types/category";
import { formatRupiah } from "@/lib/utils";

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form fields
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [active, setActive] = useState(true);

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.get<Category[]>("/categories"),
  });

  // Fetch Products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", selectedCategory, search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory) params.append("categoryId", selectedCategory);
      return apiClient.get<Product[]>(`/products?${params.toString()}`);
    },
  });

  // Mutations
  const saveMutation = useMutation({
    mutationFn: (data: ProductInput) => {
      if (editingProduct) {
        return apiClient.put(`/products/${editingProduct.id}`, data);
      }
      return apiClient.post("/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      closeModal();
    },
    onError: (err: unknown) => {
      setModalError(err instanceof Error ? err.message : "Gagal menyimpan produk");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, currentActive }: { id: number; currentActive: boolean }) =>
      apiClient.put(`/products/${id}`, {
        active: !currentActive,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setCode(`PRD-${Math.floor(100 + Math.random() * 900)}`);
    setName("");
    setCategoryId(categories[0]?.id || 1);
    setPrice(0);
    setStock(10);
    setActive(true);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setCode(p.code);
    setName(p.name);
    setCategoryId(p.categoryId);
    setPrice(p.price);
    setStock(p.stock);
    setActive(p.active);
    setModalError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setModalError("Nama produk wajib diisi");
      return;
    }
    if (price < 0 || stock < 0) {
      setModalError("Harga dan stok tidak boleh negatif");
      return;
    }

    saveMutation.mutate({
      code,
      name,
      categoryId,
      price,
      stock,
      active,
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <Package className="h-6 w-6 text-amber-500" />
            <span>Master Data Produk</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Kelola katalog produk, harga jual, stok, dan barcode UMKM
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode atau nama produk..."
            className="w-full rounded-2xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-900 shadow-xs focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-800 dark:bg-stone-900 dark:text-white"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-2xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 shadow-xs focus:border-amber-500 focus:outline-none dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300"
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/75 dark:border-stone-800 dark:bg-stone-950/40 text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold">
                <th className="py-3.5 px-4">Kode</th>
                <th className="py-3.5 px-4">Nama Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4 text-right">Harga</th>
                <th className="py-3.5 px-4 text-center">Stok</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                      <span>Memuat data produk...</span>
                    </div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400 text-sm">
                    Belum ada produk terdaftar
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                      {product.code}
                    </td>
                    <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">
                      {product.name}
                    </td>
                    <td className="py-3 px-4 text-stone-600 dark:text-stone-400 text-xs font-medium">
                      {product.categoryName || "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-stone-900 dark:text-stone-100">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
                          product.stock <= 0
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                            : product.stock <= 5
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() =>
                          toggleStatusMutation.mutate({
                            id: product.id,
                            currentActive: product.active,
                          })
                        }
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                          product.active
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                        }`}
                      >
                        {product.active ? "Aktif" : "Non-Aktif"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="p-1.5 rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 transition-colors"
                          title="Edit Produk"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Yakin ingin menghapus produk "${product.name}"?`)) {
                              deleteMutation.mutate(product.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors"
                          title="Hapus Produk"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-lg text-white">
                {editingProduct ? "Edit Master Produk" : "Tambah Produk Baru"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-stone-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-300">
                    Kode Produk
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full rounded-xl border border-stone-700 bg-stone-800 py-2 px-3 text-sm font-mono text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-300">
                    Kategori
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-700 bg-stone-800 py-2 px-3 text-sm text-white focus:border-amber-500 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Lemper Ayam Spesial"
                  className="w-full rounded-xl border border-stone-700 bg-stone-800 py-2 px-3 text-sm text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-300">
                    Harga Jual (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={price || ""}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="0"
                    className="w-full rounded-xl border border-stone-700 bg-stone-800 py-2 px-3 text-sm font-mono text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-300">
                    Stok Tersedia
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={stock || ""}
                    onChange={(e) => setStock(Number(e.target.value))}
                    placeholder="0"
                    className="w-full rounded-xl border border-stone-700 bg-stone-800 py-2 px-3 text-sm font-mono text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="productActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-stone-700 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="productActive" className="text-xs text-stone-300 font-semibold cursor-pointer">
                  Status Produk Aktif (Dapat dijual di POS)
                </label>
              </div>

              <div className="flex gap-3 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-bold text-stone-300 hover:bg-stone-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 disabled:opacity-50"
                >
                  {saveMutation.isPending ? "Menyimpan..." : "Simpan Produk"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
