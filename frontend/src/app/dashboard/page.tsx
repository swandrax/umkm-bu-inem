"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  TrendingUp,
  CreditCard,
  Package,
  Users,
  AlertTriangle,
  ShoppingCart,
  BarChart3,
  CheckCircle2,
  ArrowUpRight,
  Download,
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { DashboardAnalytics } from "@/types/analytics";
import { formatRupiah } from "@/lib/utils";

export default function DashboardPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["dashboardAnalytics"],
    queryFn: () => apiClient.get<DashboardAnalytics>("/analytics/dashboard"),
  });

  const handleExportWeeklyBmc = async () => {
    try {
      const end = new Date().toISOString().split("T")[0];
      const d = new Date();
      d.setDate(d.getDate() - 6);
      const start = d.toISOString().split("T")[0];
      const blob = await apiClient.downloadBlob(`/reports/export/csv?startDate=${start}&endDate=${end}`);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bmc-weekly-analytics-${start}_sd_${end}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Gagal mengunduh CSV Analisis Mingguan (BMC)");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6 text-amber-500" />
            <span>Dashboard Overview</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
            Ringkasan performa penjualan dan status operasional UMKM Jajanan Ibu Inem
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportWeeklyBmc}
            className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-xs hover:border-amber-500 hover:text-amber-600 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-700 transition-all cursor-pointer"
            title="Download data CSV mingguan untuk Business Model Canvas & Analisis Bisnis"
          >
            <Download className="h-4 w-4 text-amber-500" />
            <span>Export CSV Mingguan (BMC)</span>
          </button>
          <Link
            href="/pos"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Buka Kasir (POS)</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="p-5 rounded-3xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              Pendapatan Hari Ini
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-stone-900 dark:text-white">
              {isLoading ? "..." : formatRupiah(analytics?.todaySales || 0)}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Akumulasi penjualan terekam hari ini
            </p>
          </div>
        </div>

        {/* Card 2: Transactions */}
        <div className="p-5 rounded-3xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              Jumlah Transaksi
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CreditCard className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-stone-900 dark:text-white">
              {isLoading ? "..." : `${analytics?.todayTransactions || 0} Nota`}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Transaksi sukses tersimpan di MySQL
            </p>
          </div>
        </div>

        {/* Card 3: Products Sold */}
        <div className="p-5 rounded-3xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              Produk Terjual
            </span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-stone-900 dark:text-white">
              {isLoading ? "..." : `${analytics?.productsSold || 0} Pcs`}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Kuantitas kue & jajanan keluar
            </p>
          </div>
        </div>

        {/* Card 4: Customers */}
        <div className="p-5 rounded-3xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Pelanggan
            </span>
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-stone-900 dark:text-white">
              {isLoading ? "..." : `${analytics?.customerCount || 0} Orang`}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Member loyalitas terdaftar
            </p>
          </div>
        </div>
      </div>

      {/* Middle Grid: Top Products & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top 5 Products */}
        <div className="p-5 rounded-3xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-amber-500" />
              <span>Produk Terlaris</span>
            </h3>
            <Link
              href="/reports"
              className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Laporan Lengkap</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {isLoading ? (
              <div className="py-8 text-center text-stone-400 text-xs">Memuat data...</div>
            ) : !analytics?.topProducts || analytics.topProducts.length === 0 ? (
              <div className="py-8 text-center text-stone-400 text-xs">
                Belum ada transaksi penjualan produk
              </div>
            ) : (
              analytics.topProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs font-mono">
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-xs text-stone-900 dark:text-white">
                      {p.name}
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-xs text-stone-700 dark:text-stone-300">
                    {p.quantity} terjual
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="p-5 rounded-3xl border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500" />
              <span>Peringatan Stok Rendah (&le; 5)</span>
            </h3>
            <Link
              href="/products"
              className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1"
            >
              <span>Kelola Stok</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="flex-1 space-y-3">
            {isLoading ? (
              <div className="py-8 text-center text-stone-400 text-xs">Memuat data...</div>
            ) : !analytics?.lowStockProducts || analytics.lowStockProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-stone-400 gap-1">
                <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Semua stok produk dalam kondisi aman!
                </span>
              </div>
            ) : (
              analytics.lowStockProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-rose-500/5 border border-rose-500/20"
                >
                  <div>
                    <div className="font-bold text-xs text-stone-900 dark:text-white">
                      {prod.name}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">{prod.code}</div>
                  </div>
                  <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    Sisa {prod.stock}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
