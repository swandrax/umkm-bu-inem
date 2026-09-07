"use client";

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import {
  Receipt,
  Search,
  Printer,
  Eye,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Calendar,
  User,
} from "lucide-react";
import { useTransactionsQuery } from "@/hooks/useTransactions";
import { useUIStore } from "@/stores/ui.store";
import { Sale } from "@/types/sales";
import { formatRupiah, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const { openReceiptModal } = useUIStore();
  const { data: transactions = [], isLoading, isError, refetch } = useTransactionsQuery(
    startDate || undefined,
    endDate || undefined,
    search || undefined
  );

  const filteredTransactions = useMemo(() => {
    if (!search.trim()) return transactions;
    const q = search.toLowerCase();
    return transactions.filter(
      (t) =>
        t.transactionNumber.toLowerCase().includes(q) ||
        (t.userName && t.userName.toLowerCase().includes(q)) ||
        (t.paymentMethod && t.paymentMethod.toLowerCase().includes(q))
    );
  }, [transactions, search]);

  const columns = useMemo<ColumnDef<Sale>[]>(
    () => [
      {
        accessorKey: "transactionNumber",
        header: "No. Transaksi",
        cell: (info) => (
          <span className="font-mono text-xs font-bold text-stone-800">
            {info.getValue() as string}
          </span>
        ),
      },
      {
        accessorKey: "transactionDate",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 font-bold text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <span>Waktu</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => (
          <span className="text-xs text-stone-600">
            {formatDateTime(info.getValue() as string)}
          </span>
        ),
      },
      {
        accessorKey: "userName",
        header: "Kasir",
        cell: (info) => (
          <div className="flex items-center gap-1 text-xs text-stone-700">
            <User className="h-3 w-3 text-stone-400" />
            <span>{(info.getValue() as string) || "Kasir"}</span>
          </div>
        ),
      },
      {
        accessorKey: "paymentMethod",
        header: "Metode",
        cell: (info) => {
          const method = info.getValue() as string;
          return <Badge variant="neutral">{method}</Badge>;
        },
      },
      {
        accessorKey: "total",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 font-bold text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <span>Total Bayar</span>
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
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = (info.getValue() as string) || "SUCCESS";
          const isSuccess = status === "SUCCESS" || status === "COMPLETED";
          return (
            <Badge variant={isSuccess ? "success" : "warning"}>
              {isSuccess ? "Berhasil" : status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
          const t = row.original;
          return (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedSale(t)}
                className="p-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-amber-600 hover:border-amber-300 transition-colors cursor-pointer"
                title="Detail Transaksi"
              >
                <Eye className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => openReceiptModal(t.id)}
                className="p-1.5 rounded-xl border border-stone-200 text-stone-600 hover:text-orange-600 hover:border-orange-300 transition-colors cursor-pointer"
                title="Cetak Struk Thermal"
              >
                <Printer className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        },
      },
    ],
    [openReceiptModal]
  );

  const table = useReactTable({
    data: filteredTransactions,
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
            <Receipt className="h-6 w-6 text-amber-500" />
            <span>Riwayat Transaksi</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Data transaksi kasir, rincian pembayaran, dan cetak ulang struk thermal
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari no transaksi atau kasir..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/70 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <div className="flex flex-wrap items-center gap-1.5 bg-stone-50/70 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-stone-400" />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-stone-800 text-xs focus:outline-none"
                  aria-label="Tanggal Mulai"
                />
              </div>
              <span className="text-stone-400">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-stone-800 text-xs focus:outline-none"
                aria-label="Tanggal Selesai"
              />
            </div>

            {(startDate || endDate || search) && (
              <button
                type="button"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setSearch("");
                }}
                className="px-2.5 py-1.5 rounded-xl border border-stone-200 text-[11px] font-bold text-stone-600 hover:bg-stone-50"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mb-2" />
            <p className="text-xs text-stone-500 font-medium">Memuat data transaksi...</p>
          </div>
        ) : isError ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <p className="text-xs text-rose-600 font-semibold mb-2">Gagal mengambil riwayat transaksi</p>
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
            <table className="min-w-[720px] w-full text-left text-xs">
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
                      Tidak ada transaksi ditemukan.
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
            <span>Total {filteredTransactions.length} transaksi</span>
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

      {/* Transaction Details Modal */}
      <Modal
        isOpen={!!selectedSale}
        onClose={() => setSelectedSale(null)}
        title={`Detail Transaksi: ${selectedSale?.transactionNumber || ""}`}
      >
        {selectedSale && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-200/80">
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-500">Waktu</p>
                <p className="font-semibold text-stone-800">
                  {formatDateTime(selectedSale.transactionDate)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-500">Metode Bayar</p>
                <p className="font-semibold text-stone-800">{selectedSale.paymentMethod}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-500">Kasir</p>
                <p className="font-semibold text-stone-800">{selectedSale.userName || "Kasir"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-stone-500">Status</p>
                <Badge variant="success">Berhasil</Badge>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <p className="text-xs font-bold text-stone-800 mb-2">Item Jajanan Terbeli</p>
              <div className="border border-stone-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-[10px] font-bold text-stone-500 uppercase">
                    <tr>
                      <th className="p-2.5">Produk</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Harga</th>
                      <th className="p-2.5 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {selectedSale.details?.map((item) => (
                      <tr key={item.id}>
                        <td className="p-2.5 font-bold text-stone-900">{item.productName}</td>
                        <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                        <td className="p-2.5 text-right font-mono">{formatRupiah(item.price)}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-stone-900">
                          {formatRupiah(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal:</span>
                <span className="font-mono">{formatRupiah(selectedSale.subtotal)}</span>
              </div>
              {selectedSale.discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Diskon:</span>
                  <span className="font-mono">-{formatRupiah(selectedSale.discount)}</span>
                </div>
              )}
              {selectedSale.tax > 0 && (
                <div className="flex justify-between text-stone-600">
                  <span>Pajak:</span>
                  <span className="font-mono">+{formatRupiah(selectedSale.tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-stone-900 pt-1 border-t border-stone-200">
                <span>Total:</span>
                <span className="font-mono text-orange-600">
                  {formatRupiah(selectedSale.total)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedSale(null);
                  openReceiptModal(selectedSale.id);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700"
              >
                <Printer className="h-4 w-4" />
                <span>Cetak Struk Thermal</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
