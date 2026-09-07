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
  CreditCard,
  Search,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { usePaymentsQuery } from "@/hooks/usePayments";
import { PaymentRecord } from "@/lib/api/payments";
import { formatRupiah, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string>("ALL");
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data: payments = [], isLoading, isError, refetch } = usePaymentsQuery();

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        !search.trim() ||
        (p.referenceNumber && p.referenceNumber.toLowerCase().includes(search.toLowerCase())) ||
        String(p.saleId).includes(search);
      const matchMethod = selectedMethod === "ALL" || p.paymentMethod === selectedMethod;
      return matchSearch && matchMethod;
    });
  }, [payments, search, selectedMethod]);

  const columns = useMemo<ColumnDef<PaymentRecord>[]>(
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
        accessorKey: "paymentMethod",
        header: "Metode Pembayaran",
        cell: (info) => {
          const method = info.getValue() as string;
          return <Badge variant="neutral">{method}</Badge>;
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 font-bold text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <span>Nominal</span>
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
        accessorKey: "referenceNumber",
        header: "No. Referensi / Reff",
        cell: (info) => (
          <span className="font-mono text-xs text-stone-600">
            {(info.getValue() as string) || "-"}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const st = info.getValue() as string;
          const isSuccess = st === "SUCCESS" || st === "COMPLETED";
          return (
            <Badge variant={isSuccess ? "success" : "warning"}>
              {isSuccess ? "Berhasil" : st}
            </Badge>
          );
        },
      },
      {
        accessorKey: "paymentDate",
        header: ({ column }) => (
          <button
            type="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 font-bold text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <span>Waktu Bayar</span>
            <ArrowUpDown className="h-3 w-3" />
          </button>
        ),
        cell: (info) => (
          <span className="text-xs text-stone-600">
            {formatDateTime(info.getValue() as string)}
          </span>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredPayments,
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
            <CreditCard className="h-6 w-6 text-amber-500" />
            <span>Riwayat Pembayaran</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Monitoring data pembayaran kasir (Tunai, QRIS, Transfer, Dompet Digital)
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
            placeholder="Cari ID transaksi atau no referensi..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50/70 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <select
          value={selectedMethod}
          onChange={(e) => setSelectedMethod(e.target.value)}
          className="rounded-xl border border-stone-200 bg-stone-50/70 px-3 py-2 text-xs font-semibold text-stone-800 focus:outline-none focus:border-amber-500"
        >
          <option value="ALL">Semua Metode Pembayaran</option>
          <option value="CASH">Tunai (Cash)</option>
          <option value="QRIS">QRIS</option>
          <option value="TRANSFER">Transfer Bank</option>
          <option value="DEBIT">Kartu Debit</option>
          <option value="GOPAY">GoPay</option>
          <option value="OVO">OVO</option>
          <option value="DANA">DANA</option>
          <option value="SHOPEEPAY">ShopeePay</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent mb-2" />
            <p className="text-xs text-stone-500 font-medium">Memuat data pembayaran...</p>
          </div>
        ) : isError ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
            <p className="text-xs text-rose-600 font-semibold mb-2">Gagal memuat data pembayaran</p>
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
            <table className="w-full min-w-[640px] text-left text-xs">
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
                      Tidak ada data pembayaran ditemukan.
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
            <span>Total {filteredPayments.length} catatan pembayaran</span>
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
    </div>
  );
}
