"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  FileSpreadsheet,
  FileText,
  Download,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { ReportData } from "@/types/analytics";
import { formatRupiah, formatDate } from "@/lib/utils";

type ReportTab = "daily" | "weekly" | "monthly";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<ReportTab>("daily");

  const today = new Date().toISOString().split("T")[0];
  const [targetDate, setTargetDate] = useState(today);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const { data: reportData, isLoading } = useQuery({
    queryKey: ["report", activeTab, targetDate, selectedYear, selectedMonth],
    queryFn: () => {
      if (activeTab === "daily") {
        return apiClient.get<ReportData>(`/reports/daily?date=${targetDate}`);
      } else if (activeTab === "weekly") {
        return apiClient.get<ReportData>(`/reports/weekly?startDate=${targetDate}`);
      } else {
        return apiClient.get<ReportData>(
          `/reports/monthly?year=${selectedYear}&month=${selectedMonth}`
        );
      }
    },
  });

  const handleExportPdf = async () => {
    try {
      const blob = await apiClient.downloadBlob(
        `/reports/export/pdf?startDate=${targetDate}&endDate=${targetDate}`
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan-penjualan-${targetDate}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Gagal mengunduh laporan PDF");
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await apiClient.downloadBlob(
        `/reports/export/excel?startDate=${targetDate}&endDate=${targetDate}`
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan-penjualan-${targetDate}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Gagal mengunduh laporan Excel");
    }
  };

  const handleExportCsv = async () => {
    try {
      let start = targetDate;
      let end = targetDate;
      if (activeTab === "weekly") {
        const d = new Date(targetDate);
        const endDateObj = new Date(d);
        endDateObj.setDate(d.getDate() + 6);
        end = endDateObj.toISOString().split("T")[0];
      } else if (activeTab === "monthly") {
        start = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-01`;
        const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
        end = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      }

      const blob = await apiClient.downloadBlob(
        `/reports/export/csv?startDate=${start}&endDate=${end}`
      );
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bmc-weekly-analytics-${start}_sd_${end}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Gagal mengunduh data CSV BMC Analytics");
    }
  };

  // Aggregated totals
  const totalRevenue =
    reportData?.sales?.reduce((acc, s) => acc + s.total, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-amber-500" />
            <span>Laporan Penjualan & Ekspor</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Unduh rekapitulasi data penjualan dalam format CSV (BMC Analytics), Excel, dan PDF
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all active:scale-95 cursor-pointer"
            title="Export data mingguan berformat CSV untuk Business Model Canvas (BMC) & Analisis Bisnis"
          >
            <Download className="h-4 w-4" />
            <span>Export CSV (BMC Analytics)</span>
          </button>
          <button
            type="button"
            onClick={handleExportExcel}
            className="flex items-center gap-2 rounded-2xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export Excel</span>
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-xs hover:border-amber-500 hover:text-amber-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-700 transition-colors cursor-pointer"
          >
            <FileText className="h-4 w-4 text-rose-500" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Period Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-3xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
        <div className="flex gap-2">
          {(["daily", "weekly", "monthly"] as ReportTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300"
              }`}
            >
              {tab === "daily"
                ? "Laporan Harian"
                : tab === "weekly"
                ? "Laporan Mingguan"
                : "Laporan Bulanan"}
            </button>
          ))}
        </div>

        {/* Date Selector based on Tab */}
        <div className="flex items-center gap-3 text-xs">
          {activeTab === "monthly" ? (
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="rounded-xl border border-stone-200 bg-stone-50 py-2 px-3 text-xs dark:border-stone-700 dark:bg-stone-800 dark:text-white"
              >
                {[
                  "Januari",
                  "Februari",
                  "Maret",
                  "April",
                  "Mei",
                  "Juni",
                  "Juli",
                  "Agustus",
                  "September",
                  "Oktober",
                  "November",
                  "Desember",
                ].map((monthName, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {monthName}
                  </option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="rounded-xl border border-stone-200 bg-stone-50 py-2 px-3 text-xs dark:border-stone-700 dark:bg-stone-800 dark:text-white"
              >
                {[2024, 2025, 2026, 2027].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="rounded-xl border border-stone-200 bg-stone-50 py-2 px-3 text-xs dark:border-stone-700 dark:bg-stone-800 dark:text-white"
            />
          )}
        </div>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Total Pendapatan ({reportData?.period || "Periode"})
          </span>
          <div className="text-2xl font-black font-mono text-amber-600 dark:text-amber-400 mt-1">
            {formatRupiah(totalRevenue)}
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Total Transaksi Selesai
          </span>
          <div className="text-2xl font-black font-mono text-stone-900 dark:text-white mt-1">
            {reportData?.totalTransactions || 0} Nota
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/75 dark:border-stone-800 dark:bg-stone-950/40 text-[11px] uppercase tracking-wider text-stone-500 dark:text-stone-400 font-bold">
                <th className="py-3.5 px-4">No. Transaksi</th>
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Kasir</th>
                <th className="py-3.5 px-4">Metode Bayar</th>
                <th className="py-3.5 px-4 text-right">Subtotal</th>
                <th className="py-3.5 px-4 text-right">Diskon</th>
                <th className="py-3.5 px-4 text-right">Grand Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
                      <span>Memuat data laporan...</span>
                    </div>
                  </td>
                </tr>
              ) : !reportData?.sales || reportData.sales.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400 text-sm">
                    Tidak ada catatan transaksi pada periode ini
                  </td>
                </tr>
              ) : (
                reportData.sales.map((s) => (
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
                    <td className="py-3 px-4 text-xs text-stone-900 dark:text-white">
                      {s.userName || "Kasir"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-[10px] font-mono font-bold text-stone-700 dark:text-stone-300 uppercase">
                        {s.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-stone-600 dark:text-stone-300">
                      {formatRupiah(s.subtotal)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-rose-500">
                      {s.discount > 0 ? `-${formatRupiah(s.discount)}` : "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-stone-900 dark:text-white">
                      {formatRupiah(s.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
