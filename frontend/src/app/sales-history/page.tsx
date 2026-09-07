"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  History,
  Search,
  Printer,
  FileText,
  X,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { Sale, Receipt } from "@/types/sales";
import { useUiStore } from "@/store/uiStore";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function SalesHistoryPage() {
  const { openReceiptModal } = useUiStore();
  const [transactionNumber, setTransactionNumber] = useState("");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Default to today
  const today = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  const { data: sales = [], isLoading } = useQuery({
    queryKey: ["salesHistory", startDate, endDate, transactionNumber],
    queryFn: () => {
      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (transactionNumber.trim())
        params.append("transactionNumber", transactionNumber.trim());

      return apiClient.get<Sale[]>(`/sales?${params.toString()}`);
    },
  });

  const handleReprint = async (saleId: number) => {
    try {
      const receipt = await apiClient.get<Receipt>(`/sales/${saleId}/receipt`);
      openReceiptModal(receipt);
    } catch {
      alert("Gagal memuat data struk");
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
          <History className="h-6 w-6 text-amber-500" />
          <span>Riwayat Transaksi Penjualan</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
          Lihat arsip nota penjualan, rincian barang, dan cetak ulang struk thermal
        </p>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-3xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <div className="relative">
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 block">
            Cari No. Nota
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={transactionNumber}
              onChange={(e) => setTransactionNumber(e.target.value)}
              placeholder="TRX-..."
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 pl-9 pr-3 text-xs text-stone-900 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 block">
            Dari Tanggal
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 px-3 text-xs text-stone-900 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1 block">
            Sampai Tanggal
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2 px-3 text-xs text-stone-900 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/75 dark:border-stone-800 dark:bg-stone-950/40 text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold">
                <th className="py-3.5 px-4">No. Transaksi</th>
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Kasir</th>
                <th className="py-3.5 px-4">Metode</th>
                <th className="py-3.5 px-4 text-right">Total</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                      <span>Memuat riwayat transaksi...</span>
                    </div>
                  </td>
                </tr>
              ) : sales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400 text-sm">
                    Tidak ada transaksi pada periode ini
                  </td>
                </tr>
              ) : (
                sales.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                      {s.transactionNumber}
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-600 dark:text-stone-300">
                      {formatDate(s.transactionDate)}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-stone-900 dark:text-white">
                      {s.userName || "Kasir"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] font-mono font-bold text-stone-700 dark:text-stone-300 uppercase">
                        {s.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-stone-900 dark:text-white">
                      {formatRupiah(s.total)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedSale(s)}
                          className="p-1.5 rounded-lg text-stone-500 hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/10 dark:hover:text-amber-400 transition-colors cursor-pointer"
                          title="Lihat Rincian Item"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReprint(s.id)}
                          className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:hover:bg-stone-800 dark:hover:text-white transition-colors cursor-pointer"
                          title="Cetak Ulang Struk"
                        >
                          <Printer className="h-4 w-4" />
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

      {/* Sale Detail Modal */}
      {selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-bold text-base text-white">Rincian Transaksi</h3>
                <span className="text-xs font-mono text-amber-400">
                  {selectedSale.transactionNumber}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSale(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Waktu Transaksi:</span>
                <span className="text-white">{formatDate(selectedSale.transactionDate)}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Kasir Bertugas:</span>
                <span className="text-white">{selectedSale.userName || "Kasir"}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Metode Bayar:</span>
                <span className="font-bold uppercase text-amber-400">
                  {selectedSale.paymentMethod}
                </span>
              </div>
            </div>

            <div className="border-t border-stone-800 pt-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
                Item Dibeli
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedSale.details?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs p-2 rounded-xl bg-stone-800/40"
                  >
                    <div>
                      <div className="font-bold text-white">{item.productName}</div>
                      <div className="text-[10px] text-stone-400">
                        {item.quantity} x {formatRupiah(item.price)}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial summary */}
            <div className="border-t border-stone-800 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal:</span>
                <span>{formatRupiah(selectedSale.subtotal)}</span>
              </div>
              {selectedSale.discount > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>Diskon:</span>
                  <span>-{formatRupiah(selectedSale.discount)}</span>
                </div>
              )}
              {selectedSale.tax > 0 && (
                <div className="flex justify-between text-stone-400">
                  <span>PPN:</span>
                  <span>{formatRupiah(selectedSale.tax)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-stone-800">
                <span>Grand Total:</span>
                <span className="font-mono text-amber-400 font-black">
                  {formatRupiah(selectedSale.total)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleReprint(selectedSale.id);
                setSelectedSale(null);
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Cetak Ulang Struk Thermal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
