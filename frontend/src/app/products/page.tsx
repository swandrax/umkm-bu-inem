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
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import {
  useProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "@/hooks/useProducts";
import { useCategoriesQuery } from "@/hooks/useCategories";
import { productSchema, ProductFormValues } from "@/schemas/product.schema";
import { Product } from "@/types/product";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [modalError, setModalError] = useState<string | null>(null);

  // Queries
  const { data: categories = [] } = useCategoriesQuery();
  const { data: products = [], isLoading, isError, refetch } = useProductsQuery({
    query: search,
    categoryId: selectedCategory,
  });

  // Mutations
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();

  // Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      code: "",
      name: "",
      categoryId: 1,
      price: 0,
      stock: 0,
      active: true,
    },
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setModalError(null);
    reset({
      code: `SNK-${String(products.length + 1).padStart(3, "0")}`,
      name: "",
      categoryId: categories[0]?.id || 1,
      price: 0,
      stock: 0,
      active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = useCallback((p: Product) => {
    setEditingProduct(p);
    setModalError(null);
    reset({
      code: p.code,
      name: p.name,
      categoryId: p.categoryId,
      price: p.price,
      stock: p.stock,
      active: p.active,
    });
    setIsModalOpen(true);
  }, [reset]);

  const onFormSubmit = async (data: ProductFormValues) => {
    setModalError(null);
    try {
      if (editingProduct) {
        await updateMutation.mutateAsync({
          id: editingProduct.id,
          data,
        });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : "Gagal menyimpan produk");
    }
  };

  const handleDelete = useCallback(async (id: number, name: string) => {
    if (confirm(`Yakin ingin menonaktifkan produk "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Gagal menghapus produk");
      }
    }
  }, [deleteMutation]);

  // TanStack Table Columns
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Kode",
        cell: (info) => (
          <span className="font-mono text-xs font-bold text-stone-700">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 font-bold text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <span>Nama Jajanan</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => (
          <div>
            <span className="font-bold text-stone-900 text-xs sm:text-sm">
              {info.getValue() as string}
            </span>
            <p className="text-[11px] text-stone-500">
              {info.row.original.categoryName || "Umum"}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 font-bold text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <span>Harga Jual</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => (
          <span className="font-mono font-bold text-orange-700 text-xs sm:text-sm">
            {formatRupiah(info.getValue() as number)}
          </span>
        ),
      },
      {
        accessorKey: "stock",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 font-bold text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <span>Stok</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => {
          const stock = info.getValue() as number;
          return (
            <span
              className={`font-mono font-bold text-xs sm:text-sm ${
                stock <= 5 ? "text-rose-600" : "text-stone-800"
              }`}
            >
              {stock} Pcs
            </span>
          );
        },
      },
      {
        accessorKey: "active",
        header: "Status",
        cell: (info) => {
          const active = info.getValue() as boolean;
          return active ? (
            <Badge variant="success">Aktif</Badge>
          ) : (
            <Badge variant="danger">Nonaktif</Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const p = row.original;
          return (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => openEditModal(p)}
                className="p-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-amber-600 hover:border-amber-300 transition-colors cursor-pointer"
                title="Edit Produk"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              {p.active && (
                <button
                  type="button"
                  onClick={() => handleDelete(p.id, p.name)}
                  className="p-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer"
                  title="Nonaktifkan Produk"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [handleDelete, openEditModal]
  );

  const table = useReactTable({
    data: products,
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2.5">
            <Package className="h-6 w-6 text-amber-500" />
            <span>Master Data Produk</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5 font-medium">
            Kelola katalog jajanan, penetapan harga, dan pemantauan stok real-time
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Jajanan</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-3xl border border-stone-200/80 bg-white shadow-xs">
        <div className="relative w-full sm:w-80">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode atau nama jajanan..."
            className="w-full rounded-2xl border border-stone-200 bg-stone-50/60 py-2 pl-10 pr-4 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-200/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            className="w-full sm:w-48 rounded-2xl border border-stone-200 bg-stone-50/60 px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500"
          >
            <option value={0}>Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Box */}
      <div className="rounded-3xl border border-stone-200/80 bg-white shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-stone-400">Memuat data produk...</div>
        ) : isError ? (
          <div className="p-12 text-center text-xs text-rose-500 space-y-2">
            <p>Gagal memuat produk dari server.</p>
            <button
              onClick={() => refetch()}
              className="px-3 py-1 bg-stone-100 border border-stone-200 rounded-xl font-bold"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="min-w-[640px] w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-600 whitespace-nowrap">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="py-3.5 px-4 font-bold">
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
                    <tr key={row.id} className="hover:bg-stone-50/60 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="py-3 px-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-12 text-stone-400">
                      Tidak ada data produk yang sesuai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-stone-100 text-xs text-stone-500 font-medium">
          <div>
            Menampilkan halaman {table.getState().pagination.pageIndex + 1} dari{" "}
            {Math.max(1, table.getPageCount())} ({products.length} total produk)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-1.5 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Form Modal (React Hook Form + Zod) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Data Jajanan" : "Tambah Jajanan Baru"}
      >
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {modalError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{modalError}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Kode Produk *
              </label>
              <input
                type="text"
                {...register("code")}
                placeholder="SNK-001"
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm font-mono text-stone-900 focus:outline-none focus:border-amber-500"
              />
              {errors.code && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.code.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Kategori *
              </label>
              <select
                {...register("categoryId", { valueAsNumber: true })}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Nama Jajanan *
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Contoh: Lemper Ayam Spesial"
              className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500"
            />
            {errors.name && (
              <p className="text-[11px] text-rose-600 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Harga Jual (Rp) *
              </label>
              <input
                type="number"
                {...register("price", { valueAsNumber: true })}
                placeholder="0"
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm font-mono text-stone-900 focus:outline-none focus:border-amber-500"
              />
              {errors.price && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Stok Awal (Pcs) *
              </label>
              <input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="0"
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm font-mono text-stone-900 focus:outline-none focus:border-amber-500"
              />
              {errors.stock && (
                <p className="text-[11px] text-rose-600 font-medium">{errors.stock.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="activeCheckbox"
              {...register("active")}
              className="h-4 w-4 rounded border-stone-300 text-amber-500 focus:ring-amber-400"
            />
            <label htmlFor="activeCheckbox" className="text-xs font-semibold text-stone-700">
              Produk Aktif (Tersedia untuk dijual di Kasir)
            </label>
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
              className="flex-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
