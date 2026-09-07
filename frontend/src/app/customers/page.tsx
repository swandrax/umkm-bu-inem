"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Award,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Phone,
  MapPin,
} from "lucide-react";
import {
  useCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "@/hooks/useCustomers";
import { customerSchema, CustomerFormValues } from "@/schemas/customer.schema";
import { Customer } from "@/types/customer";
import { Modal } from "@/components/ui/Modal";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [modalError, setModalError] = useState<string | null>(null);

  const { data: customers = [], isLoading, isError, refetch } = useCustomersQuery(search);

  const createMutation = useCreateCustomerMutation();
  const updateMutation = useUpdateCustomerMutation();
  const deleteMutation = useDeleteCustomerMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
    },
  });

  const openCreateModal = () => {
    setEditingCustomer(null);
    setModalError(null);
    reset({
      name: "",
      phone: "",
      address: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = useCallback((c: Customer) => {
    setEditingCustomer(c);
    setModalError(null);
    reset({
      name: c.name,
      phone: c.phone || "",
      address: c.address || "",
    });
    setIsModalOpen(true);
  }, [reset]);

  const onFormSubmit = async (data: CustomerFormValues) => {
    setModalError(null);
    try {
      if (editingCustomer) {
        await updateMutation.mutateAsync({
          id: editingCustomer.id,
          data: {
            name: data.name,
            phone: data.phone || "",
            address: data.address || "",
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          phone: data.phone || "",
          address: data.address || "",
        });
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : "Gagal menyimpan data pelanggan");
    }
  };

  const handleDelete = useCallback(async (id: number, name: string) => {
    if (confirm(`Yakin ingin menghapus pelanggan "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Gagal menghapus pelanggan");
      }
    }
  }, [deleteMutation]);

  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 font-bold text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <span>Nama Pelanggan</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 font-bold">
              <Users className="h-4 w-4" />
            </div>
            <span className="font-bold text-stone-900 text-xs sm:text-sm">
              {info.getValue() as string}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "No. WhatsApp / HP",
        cell: (info) => {
          const phone = info.getValue() as string;
          return (
            <div className="flex items-center gap-1.5 text-xs text-stone-700 font-mono">
              <Phone className="h-3 w-3 text-stone-400" />
              <span>{phone || "-"}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "address",
        header: "Alamat",
        cell: (info) => {
          const addr = info.getValue() as string;
          return (
            <div className="flex items-center gap-1.5 text-xs text-stone-600 max-w-xs truncate">
              <MapPin className="h-3 w-3 text-stone-400 shrink-0" />
              <span className="truncate">{addr || "-"}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "loyaltyPoints",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 font-bold text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <span>Poin Loyalitas</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => {
          const points = (info.getValue() as number) || 0;
          return (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-bold font-mono">
              <Award className="h-3.5 w-3.5 text-amber-600" />
              <span>{points} Pts</span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const c = row.original;
          return (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => openEditModal(c)}
                className="p-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-amber-600 hover:border-amber-300 transition-colors cursor-pointer"
                title="Edit Pelanggan"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(c.id, c.name)}
                className="p-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer"
                title="Hapus Pelanggan"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        },
      },
    ],
    [handleDelete, openEditModal]
  );

  const table = useReactTable({
    data: customers,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-amber-500" />
            <span>Manajemen Pelanggan</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Kelola data pelanggan setia, riwayat poin loyalitas, dan kontak pemesanan
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Pelanggan</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari pelanggan berdasarkan nama, nomor telepon, atau alamat..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/70 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mb-2" />
            <p className="text-xs text-stone-500 font-medium">Memuat data pelanggan...</p>
          </div>
        ) : isError ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <p className="text-xs text-rose-600 font-semibold mb-2">Gagal mengambil data pelanggan</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-[640px] w-full text-left text-xs">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider whitespace-nowrap">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="py-3 px-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-stone-100">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-amber-50/30 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="py-3 px-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="py-8 text-center text-stone-400">
                      Tidak ada data pelanggan ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div>
            <span>Total {customers.length} pelanggan terdaftar</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
              className="p-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 disabled:opacity-40 cursor-pointer disabled:cursor-default"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-bold text-stone-800">
              {table.getState().pagination.pageIndex + 1} dari {table.getPageCount() || 1}
            </span>
            <button
              type="button"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
              className="p-1.5 rounded-xl border border-stone-200 hover:bg-stone-50 disabled:opacity-40 cursor-pointer disabled:cursor-default"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Customer Modal (React Hook Form + Zod) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCustomer ? "Edit Data Pelanggan" : "Tambah Pelanggan Baru"}
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {modalError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{modalError}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Nama Pelanggan *
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Contoh: Bu Siti Rohmah"
              className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500"
            />
            {errors.name && (
              <p className="text-[11px] text-rose-600 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              No. Telepon / WhatsApp
            </label>
            <input
              type="text"
              {...register("phone")}
              placeholder="Contoh: 081234567890"
              className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm font-mono text-stone-900 focus:outline-none focus:border-amber-500"
            />
            {errors.phone && (
              <p className="text-[11px] text-rose-600 font-medium">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Alamat Lengkap
            </label>
            <textarea
              {...register("address")}
              rows={3}
              placeholder="Alamat pengiriman atau domisili..."
              className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500 resize-none"
            />
            {errors.address && (
              <p className="text-[11px] text-rose-600 font-medium">{errors.address.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Pelanggan"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
