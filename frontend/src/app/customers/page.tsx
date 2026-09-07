"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Plus, Search, Edit2, Trash2, X, Award, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Customer, CustomerInput } from "@/types/customer";

export default function CustomersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ["customers", search],
    queryFn: () => {
      const url = search ? `/customers?search=${encodeURIComponent(search)}` : "/customers";
      return apiClient.get<Customer[]>(url);
    },
  });

  const saveMutation = useMutation({
    mutationFn: (data: CustomerInput) => {
      if (editingCustomer) {
        return apiClient.put(`/customers/${editingCustomer.id}`, data);
      }
      return apiClient.post("/customers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      closeModal();
    },
    onError: (err: unknown) => {
      setModalError(err instanceof Error ? err.message : "Gagal menyimpan data pelanggan");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiClient.delete(`/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  const openCreateModal = () => {
    setEditingCustomer(null);
    setName("");
    setPhone("");
    setAddress("");
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: Customer) => {
    setEditingCustomer(c);
    setName(c.name);
    setPhone(c.phone || "");
    setAddress(c.address || "");
    setModalError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setModalError("Nama pelanggan wajib diisi");
      return;
    }
    saveMutation.mutate({ name, phone, address });
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-amber-500" />
            <span>Data Pelanggan</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Kelola member loyalitas, kontak, dan alamat pengiriman
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Pelanggan</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama atau nomor telepon..."
          className="w-full rounded-2xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-900 shadow-xs focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 dark:border-stone-800 dark:bg-stone-900 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/75 dark:border-stone-800 dark:bg-stone-950/40 text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold">
                <th className="py-3.5 px-4">Nama Pelanggan</th>
                <th className="py-3.5 px-4">No. Telepon</th>
                <th className="py-3.5 px-4">Alamat</th>
                <th className="py-3.5 px-4 text-center">Poin Loyalitas</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                      <span>Memuat data pelanggan...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400 text-sm">
                    Belum ada data pelanggan
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-stone-600 dark:text-stone-300">
                      {c.phone || "-"}
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-500 dark:text-stone-400 max-w-xs truncate">
                      {c.address || "-"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Award className="h-3 w-3" />
                        <span>{c.loyaltyPoints || 0} Poin</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(c)}
                          className="p-1.5 rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Hapus data pelanggan "${c.name}"?`)) {
                              deleteMutation.mutate(c.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-stone-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400 transition-colors"
                          title="Hapus"
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
          <div className="relative w-full max-w-md rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-bold text-lg text-white">
                {editingCustomer ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}
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
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama pembeli..."
                  className="w-full rounded-xl border border-stone-700 bg-stone-800 py-2.5 px-3.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">
                  No. Telepon / WhatsApp
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxxxxxx"
                  className="w-full rounded-xl border border-stone-700 bg-stone-800 py-2.5 px-3.5 text-sm font-mono text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">
                  Alamat Lengkap
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Alamat untuk pengiriman pesanan..."
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
                  {saveMutation.isPending ? "Menyimpan..." : "Simpan Pelanggan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
