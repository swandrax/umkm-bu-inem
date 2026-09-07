"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  FileSpreadsheet,
  FileText,
  Download,
} from "lucide-react";
import { apiClient } from "@/lib/api/client";
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
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-amber-500" />
            <span>Laporan Penjualan & Ekspor</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Unduh rekapitulasi data penjualan dalam format CSV (BMC Analytics), Excel, dan PDF
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCsv}
            title="Download format CSV untuk BMC Bisnis & Data Analytics Mingguan"
            className="flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 shadow-xs hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4 text-emerald-600" />
            <span>Ekspor CSV (BMC Analytics)</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-3.5 py-2 text-xs font-bold text-emerald-700 shadow-xs hover:border-emerald-500 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportPdf}
            className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-xs hover:border-amber-500 hover:text-amber-600 transition-colors cursor-pointer"
          >
            <FileText className="h-4 w-4 text-rose-500" />
            <span>PDF Struk</span>
          </button>
        </div>
      </div>

      {/* Filter / Tabs Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-3xl border border-stone-200 bg-white shadow-xs">
        <div className="flex items-center gap-2">
          {(["daily", "weekly", "monthly"] as ReportTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {tab === "daily"
                ? "Harian"
                : tab === "weekly"
                ? "Mingguan"
                : "Bulanan"}
            </button>
          ))}
        </div>

        {/* Dynamic Controls based on tab */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {activeTab === "daily" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">Tanggal:</span>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="rounded-xl border border-stone-200 bg-stone-50 py-2 px-3 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          {activeTab === "weekly" && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium">
                Mulai Minggu:
              </span>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="rounded-xl border border-stone-200 bg-stone-50 py-2 px-3 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          {activeTab === "monthly" && (
            <div className="flex items-center gap-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="rounded-xl border border-stone-200 bg-stone-50 py-2 px-3 text-xs text-stone-800 focus:outline-none focus:border-amber-500"
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
                ].map((m, idx) => (
                  <option key={m} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="rounded-xl border border-stone-200 bg-stone-50 py-2 px-3 text-xs text-stone-800 focus:outline-none focus:border-amber-500 w-20"
              />
            </div>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl border border-stone-200 bg-white shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Total Omset Penjualan
          </div>
          <div className="text-2xl font-black font-mono text-amber-600 mt-1">
            {formatRupiah(totalRevenue)}
          </div>
        </div>

        <div className="p-5 rounded-3xl border border-stone-200 bg-white shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Total Transaksi
          </div>
          <div className="text-2xl font-black font-mono text-stone-900 mt-1">
            {reportData?.sales?.length || 0}
          </div>
        </div>
      </div>

      {/* Table of Transactions */}
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50/75 text-[11px] uppercase tracking-wider text-stone-500 font-bold">
                <th className="py-3 px-4">No. Transaksi</th>
                <th className="py-3 px-4">Waktu</th>
                <th className="py-3 px-4">Kasir</th>
                <th className="py-3 px-4">Metode Bayar</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    Memuat data rekap penjualan...
                  </td>
                </tr>
              ) : reportData?.sales && reportData.sales.length > 0 ? (
                reportData.sales.map((s) => (
                  <tr
                    key={s.id}
                    className="hover:bg-amber-50/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-amber-600 text-xs">
                      {s.transactionNumber}
                    </td>
                    <td className="py-3 px-4 text-xs text-stone-600">
                      {formatDate(s.transactionDate)}
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-stone-900">
                      {s.userName || "Kasir"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded-md bg-stone-100 text-[10px] font-mono font-bold text-stone-700 uppercase">
                        {s.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-stone-900">
                      {formatRupiah(s.total)}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    Tidak ada transaksi penjualan pada periode ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
