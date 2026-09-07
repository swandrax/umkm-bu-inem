"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderTree, Plus, Edit2, Trash2, X, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Category, CategoryInput } from "@/types/category";

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: () => apiClient.get<Category[]>("/categories"),
  });

  const saveMutation = useMutation({
    mutationFn: (data: CategoryInput) => {
      if (editingCategory) {
        return apiClient.put(`/categories/${editingCategory.id}`, data);
      }
      return apiClient.post("/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      closeModal();
    },
    onError: (err: unknown) => {
      setModalError(err instanceof Error ? err.message : "Gagal menyimpan kategori");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setDescription(c.description || "");
    setModalError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setModalError("Nama kategori wajib diisi");
      return;
    }
    saveMutation.mutate({ name, description });
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <FolderTree className="h-6 w-6 text-amber-500" />
            <span>Kategori Produk</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Pengelompokan menu (Makanan Basah, Gorengan, Minuman, Snack Kering)
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-12 text-center text-stone-400">
            Belum ada kategori terdaftar
          </div>
        ) : (
          categories.map((cat) => (
            <div
              key={cat.id}
              className="flex flex-col justify-between p-5 rounded-3xl border border-stone-200 bg-white shadow-xs hover:border-amber-400 transition-all dark:border-stone-800 dark:bg-stone-900"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 uppercase">
                    ID #{cat.id}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Hapus kategori "${cat.name}"?`)) {
                          deleteMutation.mutate(cat.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-base text-stone-900 dark:text-white">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                  {cat.description || "Tidak ada deskripsi"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-lg text-white">
                {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
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
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Kue Tradisional"
                  className="w-full rounded-xl border border-stone-700 bg-stone-800 py-2.5 px-3.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">
                  Deskripsi Singkat
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi kategori..."
                  rows={3}
                  className="w-full rounded-xl border border-stone-700 bg-stone-800 py-2.5 px-3.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                />
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
                  {saveMutation.isPending ? "Menyimpan..." : "Simpan Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
