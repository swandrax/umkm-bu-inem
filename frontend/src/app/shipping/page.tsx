"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  Truck,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Edit2,
} from "lucide-react";
import { useShippingQuery, useUpdateShippingMutation } from "@/hooks/useShipping";
import { ShippingRecord } from "@/lib/api/shipping";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export default function ShippingPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [editingShipping, setEditingShipping] = useState<ShippingRecord | null>(null);
  const [newStatus, setNewStatus] = useState("PENDING");
  const [courierNotes, setCourierNotes] = useState("");

  const { data: shipments = [], isLoading, isError, refetch } = useShippingQuery();
  const updateMutation = useUpdateShippingMutation();

  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      const matchSearch =
        !search.trim() ||
        String(s.saleId).includes(search) ||
        (s.customerNotes && s.customerNotes.toLowerCase().includes(search.toLowerCase())) ||
        (s.courierNotes && s.courierNotes.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter === "ALL" || s.shippingStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [shipments, search, statusFilter]);

  const openUpdateModal = (record: ShippingRecord) => {
    setEditingShipping(record);
    setNewStatus(record.shippingStatus);
    setCourierNotes(record.courierNotes || "");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShipping) return;
    try {
      await updateMutation.mutateAsync({
        id: editingShipping.id,
        status: newStatus,
        notes: courierNotes,
      });
      setEditingShipping(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal memperbarui status pengiriman");
    }
  };

  const columns = useMemo<ColumnDef<ShippingRecord>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => (
          <span className="font-mono text-xs text-stone-500 font-bold">
            #{info.getValue() as number}
          </span>
        ),
      },
      {
        accessorKey: "saleId",
        header: "ID Transaksi",
        cell: (info) => (
          <span className="font-mono text-xs font-bold text-stone-900">
            TRX-{info.getValue() as number}
          </span>
        ),
      },
      {
        accessorKey: "shippingType",
        header: "Layanan Kurir",
        cell: (info) => (
          <div className="flex items-center gap-1 text-xs font-medium text-stone-800">
            <Truck className="h-3.5 w-3.5 text-amber-500" />
            <span>{(info.getValue() as string) || "STANDAR"}</span>
          </div>
        ),
      },
      {
        accessorKey: "shippingStatus",
        header: "Status Pengiriman",
        cell: (info) => {
          const status = (info.getValue() as string) || "PENDING";
          const variant =
            status === "DELIVERED"
              ? "success"
              : status === "SHIPPED"
              ? "primary"
              : status === "CANCELLED"
              ? "danger"
              : "warning";
          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        accessorKey: "customerNotes",
        header: "Catatan Pelanggan",
        cell: (info) => (
          <span className="text-xs text-stone-600 max-w-xs truncate">
            {(info.getValue() as string) || "-"}
          </span>
        ),
      },
      {
        accessorKey: "courierNotes",
        header: "Catatan Kurir / Resi",
        cell: (info) => (
          <span className="font-mono text-xs text-stone-700 font-medium">
            {(info.getValue() as string) || "-"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const s = row.original;
          return (
            <button
              type="button"
              onClick={() => openUpdateModal(s)}
              className="p-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-amber-600 hover:border-amber-300 transition-colors cursor-pointer"
              title="Update Status"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredShipments,
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
            <Truck className="h-6 w-6 text-amber-500" />
            <span>Status Pengiriman & Kurir</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Pantau pengiriman pesanan jajanan Bu Inem kepada pelanggan dan input nomor resi kurir
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari ID transaksi, catatan, atau resi..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/70 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-stone-200 bg-stone-50/70 px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500"
        >
          <option value="ALL">Semua Status</option>
          <option value="PENDING">PENDING (Menunggu)</option>
          <option value="PROCESSING">PROCESSING (Sedang Diproses)</option>
          <option value="SHIPPED">SHIPPED (Dalam Pengiriman)</option>
          <option value="DELIVERED">DELIVERED (Terkirim)</option>
          <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mb-2" />
            <p className="text-xs text-stone-500 font-medium">Memuat data pengiriman...</p>
          </div>
        ) : isError ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <p className="text-xs text-rose-600 font-semibold mb-2">Gagal memuat data pengiriman</p>
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
                      Tidak ada data pengiriman ditemukan.
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
            <span>Total {filteredShipments.length} pengiriman</span>
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

      {/* Update Modal */}
      <Modal
        isOpen={!!editingShipping}
        onClose={() => setEditingShipping(null)}
        title={`Update Pengiriman: TRX-${editingShipping?.saleId || ""}`}
      >
        {editingShipping && (
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Status Pengiriman
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500"
              >
                <option value="PENDING">PENDING - Menunggu Pickup</option>
                <option value="PROCESSING">PROCESSING - Sedang Dikemas</option>
                <option value="SHIPPED">SHIPPED - Dalam Perjalanan</option>
                <option value="DELIVERED">DELIVERED - Diterima Pelanggan</option>
                <option value="CANCELLED">CANCELLED - Batal</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Catatan Kurir / No. Resi
              </label>
              <input
                type="text"
                value={courierNotes}
                onChange={(e) => setCourierNotes(e.target.value)}
                placeholder="Contoh: JNE-99882233 atau Diterima oleh Pak RT"
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setEditingShipping(null)}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-700 hover:bg-stone-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50 cursor-pointer"
              >
                {updateMutation.isPending ? "Menyimpan..." : "Simpan Status"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
