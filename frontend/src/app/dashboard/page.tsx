"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingCart,
  Users,
  AlertTriangle,
  Download,
  Package,
  CreditCard,
} from "lucide-react";
import { useDashboardQuery } from "@/hooks/useDashboard";
import { reportsApi } from "@/lib/api/reports";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export default function DashboardPage() {
  const { data: analytics, isLoading, isError, refetch } = useDashboardQuery();

  const handleExportWeeklyBmc = async () => {
    try {
      const end = new Date().toISOString().split("T")[0];
      const d = new Date();
      d.setDate(d.getDate() - 6);
      const start = d.toISOString().split("T")[0];
      const blob = await reportsApi.exportCsv(start, end);
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

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-stone-200 text-center space-y-4">
        <AlertTriangle className="h-10 w-10 text-rose-500" />
        <h2 className="text-base sm:text-lg font-bold text-stone-900">Gagal Memuat Data Dashboard</h2>
        <p className="text-xs sm:text-sm text-stone-500">Koneksi ke backend Spring Boot terganggu.</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2.5">
            <LayoutDashboard className="h-6 w-6 text-amber-500" />
            <span>Dashboard Analitik Bisnis</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5 font-medium">
            Performa penjualan real-time dan monitoring operasional UMKM Jajanan Ibu Inem
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportWeeklyBmc}
            className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-bold text-stone-700 shadow-xs hover:border-amber-500 hover:text-amber-600 transition-all cursor-pointer"
            title="Download data CSV mingguan untuk Business Model Canvas & Analisis Bisnis"
          >
            <Download className="h-4 w-4 text-amber-500" />
            <span>Export CSV Mingguan (BMC)</span>
          </button>
          <Link
            href="/pos"
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all active:scale-95"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Buka Kasir (POS)</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue Today */}
        <div className="p-5 rounded-3xl border border-stone-200/80 bg-white shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              Pendapatan Hari Ini
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200/60">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-stone-900">
              {isLoading ? "..." : formatRupiah(analytics?.todaySales || 0)}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 font-medium">
              Akumulasi transaksi kasir hari ini
            </p>
          </div>
        </div>

        {/* Card 2: Transactions Today */}
        <div className="p-5 rounded-3xl border border-stone-200/80 bg-white shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              Jumlah Transaksi
            </span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-200/60">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-stone-900">
              {isLoading ? "..." : `${analytics?.todayTransactions || 0} Struk`}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 font-medium">
              Pesanan selesai terekam di sistem
            </p>
          </div>
        </div>

        {/* Card 3: Products Sold */}
        <div className="p-5 rounded-3xl border border-stone-200/80 bg-white shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              Item Terjual
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-stone-900">
              {isLoading ? "..." : `${analytics?.productsSold || 0} Pcs`}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 font-medium">
              Volume produk jajanan hari ini
            </p>
          </div>
        </div>

        {/* Card 4: Registered Customers */}
        <div className="p-5 rounded-3xl border border-stone-200/80 bg-white shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">
              Total Pelanggan
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200/60">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-black font-mono text-stone-900">
              {isLoading ? "..." : `${analytics?.customerCount || 0} Kontak`}
            </div>
            <p className="text-[11px] text-stone-500 mt-1 font-medium">
              Pelanggan tetap dalam direktori
            </p>
          </div>
        </div>
      </div>

      {/* Grid for Charts & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Top Products and Payment Methods */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Selling Products Card */}
          <div className="p-6 rounded-3xl border border-stone-200/80 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                <span>Produk Terlaris (Top Selling)</span>
              </h2>
              <span className="text-xs text-stone-500 font-medium">Volume Terjual</span>
            </div>

            {analytics?.topProducts && analytics.topProducts.length > 0 ? (
              <div className="space-y-3">
                {analytics.topProducts.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-semibold text-stone-800">{p.name}</span>
                    <Badge variant="primary">{p.quantity} Pcs</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-4 text-center">Belum ada data produk terjual hari ini.</p>
            )}
          </div>

          {/* Payment Method Distribution */}
          <div className="p-6 rounded-3xl border border-stone-200/80 bg-white shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-amber-500" />
                <span>Metode Pembayaran (Channels)</span>
              </h2>
              <span className="text-xs text-stone-500 font-medium">Distribusi Transaksi</span>
            </div>

            {analytics?.paymentMethodStats && analytics.paymentMethodStats.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {analytics.paymentMethodStats.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
                    <p className="text-xs font-bold text-stone-600 uppercase">{item.method}</p>
                    <p className="text-lg font-black text-stone-900 font-mono mt-1">{item.count}</p>
                    <span className="text-[10px] text-stone-400">Transaksi</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-400 py-4 text-center">Belum ada data pembayaran hari ini.</p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Low Stock Alerts */}
        <div className="p-6 rounded-3xl border border-stone-200/80 bg-white shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>Peringatan Stok Menipis</span>
            </h2>
            <Badge variant="warning">Prioritas Restock</Badge>
          </div>

          {analytics?.lowStockProducts && analytics.lowStockProducts.length > 0 ? (
            <div className="space-y-3 overflow-y-auto max-h-[380px]">
              {analytics.lowStockProducts.map((p) => (
                <div key={p.id} className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-stone-800">{p.name}</p>
                    <p className="text-[11px] text-stone-500">{p.categoryName || "Umum"}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-rose-600 font-mono">{p.stock} Pcs</span>
                    <p className="text-[10px] text-stone-400">Sisa Stok</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-xs text-emerald-600 font-bold">Semua stok produk aman!</p>
              <p className="text-[11px] text-stone-400 mt-0.5">Tidak ada stok yang di bawah batas minimum.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
