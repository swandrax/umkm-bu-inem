"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserCog, Plus, Edit2, Shield, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { apiClient } from "@/lib/api/client";
import { User, Role } from "@/types/auth";
import { Modal } from "@/components/ui/Modal";

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

  const { data: users = [], isLoading, isError, refetch } = useQuery({
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
    setModalError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);

    if (!editingUser && !username.trim()) {
      setModalError("Username wajib diisi");
      return;
    }
    if (!fullName.trim()) {
      setModalError("Nama lengkap wajib diisi");
      return;
    }
    if (!editingUser && !password.trim()) {
      setModalError("Password wajib diisi untuk akun baru");
      return;
    }

    const payload: {
      username?: string;
      fullName: string;
      password?: string;
      role: Role;
      active: boolean;
    } = {
      fullName,
      role,
      active,
    };

    if (!editingUser) {
      payload.username = username;
    }
    if (password.trim()) {
      payload.password = password;
    }

    saveMutation.mutate(payload);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
            <UserCog className="h-6 w-6 text-amber-500" />
            <span>Manajemen Pengguna</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Kelola hak akses pengguna sistem kasir UMKM Bu Inem (Admin & Kasir)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all active:scale-98 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Pengguna</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/75 text-[11px] uppercase tracking-wider text-stone-500 font-bold">
                <th className="py-3 px-4">Nama Lengkap</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Role Akses</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400">
                    Memuat data pengguna...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-rose-500">
                    Gagal mengambil data pengguna.{" "}
                    <button
                      onClick={() => refetch()}
                      className="underline font-bold"
                    >
                      Coba lagi
                    </button>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-stone-400">
                    Belum ada data pengguna yang terdaftar.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-amber-50/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-stone-900">
                      {u.fullName}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-stone-600">
                      @{u.username}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === "ADMIN"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        <Shield className="h-3 w-3" />
                        <span>{u.role}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleStatusMutation.mutate(u)}
                        disabled={toggleStatusMutation.isPending}
                        className="cursor-pointer"
                        title="Klik untuk ubah status aktif/nonaktif"
                      >
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {u.active ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              <span>Aktif</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-3 w-3" />
                              <span>Nonaktif</span>
                            </>
                          )}
                        </span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => openEditModal(u)}
                        className="p-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-amber-600 hover:border-amber-300 transition-colors cursor-pointer"
                        title="Edit User"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUser ? "Edit Data Pengguna" : "Tambah Pengguna Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {modalError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{modalError}</span>
            </div>
          )}

          {!editingUser && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Username *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="kasir1"
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Nama Lengkap *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Siti Aminah"
              className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              {editingUser ? "Password Baru (Opsional)" : "Password *"}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={editingUser ? "Biarkan kosong jika tidak diubah" : "••••••••"}
              className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Role Akses *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500"
              >
                <option value="CASHIER">CASHIER (Kasir POS)</option>
                <option value="ADMIN">ADMIN (Super Admin)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Status Akun
              </label>
              <select
                value={active ? "true" : "false"}
                onChange={(e) => setActive(e.target.value === "true")}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500"
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50 cursor-pointer"
            >
              {saveMutation.isPending ? "Menyimpan..." : "Simpan Pengguna"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
