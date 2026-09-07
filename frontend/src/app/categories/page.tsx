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
  ColumnDef,
  SortingState,
} from "@tanstack/react-table";
import {
  FolderTree,
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
  useCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/hooks/useCategories";
import { categorySchema, CategoryFormValues } from "@/schemas/category.schema";
import { Category } from "@/types/category";
import { Modal } from "@/components/ui/Modal";

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [modalError, setModalError] = useState<string | null>(null);

  const { data: categories = [], isLoading, isError, refetch } = useCategoriesQuery();

  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, search]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setModalError(null);
    reset({
      name: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = useCallback((c: Category) => {
    setEditingCategory(c);
    setModalError(null);
    reset({
      name: c.name,
      description: c.description || "",
    });
    setIsModalOpen(true);
  }, [reset]);

  const onFormSubmit = async (data: CategoryFormValues) => {
    setModalError(null);
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({
          id: editingCategory.id,
          data: {
            name: data.name,
            description: data.description || "",
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          description: data.description || "",
        });
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      setModalError(err instanceof Error ? err.message : "Gagal menyimpan kategori");
    }
  };

  const handleDelete = useCallback(async (id: number, name: string) => {
    if (confirm(`Yakin ingin menghapus kategori "${name}"?`)) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Gagal menghapus kategori");
      }
    }
  }, [deleteMutation]);

  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 font-bold text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <span>Nama Kategori</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 font-bold">
              <FolderTree className="h-4 w-4" />
            </div>
            <span className="font-bold text-stone-900 text-xs sm:text-sm">
              {info.getValue() as string}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Deskripsi",
        cell: (info) => (
          <span className="text-xs text-stone-600">
            {(info.getValue() as string) || "-"}
          </span>
        ),
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
                title="Edit Kategori"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(c.id, c.name)}
                className="p-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-rose-600 hover:border-rose-300 transition-colors cursor-pointer"
                title="Hapus Kategori"
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
    data: filteredCategories,
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
            <FolderTree className="h-6 w-6 text-amber-500" />
            <span>Manajemen Kategori</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Kelola pengelompokan aneka kue basah, jajanan pasar, dan minuman Bu Inem
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Kategori</span>
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
            placeholder="Cari kategori jajanan..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/70 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mb-2" />
            <p className="text-xs text-stone-500 font-medium">Memuat data kategori...</p>
          </div>
        ) : isError ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <p className="text-xs text-rose-600 font-semibold mb-2">Gagal mengambil data kategori</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
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
                      Tidak ada kategori jajanan ditemukan.
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
            <span>Total {filteredCategories.length} kategori</span>
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

      {/* Category Modal (React Hook Form + Zod) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
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
              Nama Kategori *
            </label>
            <input
              type="text"
              {...register("name")}
              placeholder="Contoh: Kue Basah Tradisional"
              className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500"
            />
            {errors.name && (
              <p className="text-[11px] text-rose-600 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Deskripsi
            </label>
            <textarea
              {...register("description")}
              rows={3}
              placeholder="Deskripsi ringkas kategori..."
              className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500 resize-none"
            />
            {errors.description && (
              <p className="text-[11px] text-rose-600 font-medium">{errors.description.message}</p>
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
              {isSubmitting ? "Menyimpan..." : "Simpan Kategori"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
