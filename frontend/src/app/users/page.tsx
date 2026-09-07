"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCog, Plus, Edit2, X, Shield, AlertCircle } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { User, Role } from "@/types/auth";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("CASHIER");
  const [active, setActive] = useState(true);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => apiClient.get<User[]>("/users"),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: {
      username?: string;
      fullName: string;
      password?: string;
      role: Role;
      active: boolean;
    }) => {
      if (editingUser) {
        return apiClient.put(`/users/${editingUser.id}`, payload);
      }
      return apiClient.post("/users", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeModal();
    },
    onError: (err: unknown) => {
      setModalError(err instanceof Error ? err.message : "Gagal menyimpan akun user");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (u: User) =>
      apiClient.put(`/users/${u.id}`, {
        fullName: u.fullName,
        role: u.role,
        active: !u.active,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const openCreateModal = () => {
    setEditingUser(null);
    setUsername("");
    setFullName("");
    setPassword("");
    setRole("CASHIER");
    setActive(true);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setUsername(u.username);
    setFullName(u.fullName);
    setPassword("");
    setRole(u.role);
    setActive(u.active);
    setModalError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setModalError("Nama lengkap wajib diisi");
      return;
    }
    if (!editingUser && (!username.trim() || !password.trim())) {
      setModalError("Username dan password wajib diisi untuk akun baru");
      return;
    }

    saveMutation.mutate({
      username: editingUser ? undefined : username,
      fullName,
      password: password ? password : undefined,
      role,
      active,
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <UserCog className="h-6 w-6 text-amber-500" />
            <span>Manajemen Pengguna & Kasir</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Kelola hak akses kasir dan administrator POS
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Akun Baru</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/75 dark:border-stone-800 dark:bg-stone-950/40 text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold">
                <th className="py-3.5 px-4">Nama Lengkap</th>
                <th className="py-3.5 px-4">Username</th>
                <th className="py-3.5 px-4 text-center">Role / Hak Akses</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                      <span>Memuat data pengguna...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400 text-sm">
                    Belum ada data akun pengguna
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-stone-900 dark:text-white">
                      {u.fullName}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-stone-600 dark:text-stone-300">
                      @{u.username}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          u.role === "ADMIN"
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                            : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        <span>{u.role}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => toggleStatusMutation.mutate(u)}
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                          u.active
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                            : "bg-stone-200 text-stone-600 dark:bg-stone-800 dark:text-stone-400"
                        }`}
                      >
                        {u.active ? "Aktif" : "Non-Aktif"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
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
                {editingUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}
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
              {!editingUser && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-300">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username login..."
                    className="w-full rounded-xl border border-stone-700 bg-stone-800 py-2.5 px-3.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama kasir atau admin..."
                  className="w-full rounded-xl border border-stone-700 bg-stone-800 py-2.5 px-3.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">
                  Password {editingUser && "(Kosongkan jika tidak diubah)"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password..."
                  className="w-full rounded-xl border border-stone-700 bg-stone-800 py-2.5 px-3.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  required={!editingUser}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-300">
                  Hak Akses (Role)
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full rounded-xl border border-stone-700 bg-stone-800 py-2.5 px-3.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="CASHIER">CASHIER (Hanya POS, Transaksi, Pelanggan)</option>
                  <option value="ADMIN">ADMIN (Akses Penuh Semua Menu)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="userActive"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="h-4 w-4 rounded-sm border-stone-700 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="userActive" className="text-xs text-stone-300 font-semibold cursor-pointer">
                  Akun Aktif
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
                  {saveMutation.isPending ? "Menyimpan..." : "Simpan Pengguna"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
