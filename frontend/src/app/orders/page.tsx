"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingCart,
  Search,
  Printer,
  ExternalLink,
  CreditCard,
} from "lucide-react";
import { getAllOrders } from "@/lib/api/orders";
import { formatRupiah } from "@/lib/utils";
import { Order } from "@/types/order";

const STATUS_FILTERS = [
  { val: "ALL", label: "Semua Status" },
  { val: "WAITING_PAYMENT", label: "Menunggu Bayar" },
  { val: "PAID", label: "Lunas / Terbayar" },
  { val: "PROCESSING", label: "Diproses" },
  { val: "COMPLETED", label: "Selesai" },
  { val: "CANCELED", label: "Dibatalkan" },
];

export default function OrdersAdminPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["admin-orders", statusFilter, search],
    queryFn: () =>
      getAllOrders(
        statusFilter === "ALL" ? undefined : statusFilter,
        undefined,
        search || undefined
      ),
    refetchInterval: 8000,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2.5">
            <ShoppingCart className="h-6 w-6 text-amber-500" />
            <span>Manajemen Pesanan Layanan UMKM</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Daftar pesanan layanan komersial, status pembayaran QRIS/Tunai, dan penerbitan struk.
          </p>
        </div>

        <Link
          href="/order"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-extrabold hover:bg-amber-600 transition-colors shadow-xs"
        >
          <span>Buat Pesanan Baru</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari no. pesanan atau nama..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.val}
              type="button"
              onClick={() => setStatusFilter(f.val)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === f.val
                  ? "bg-stone-900 text-white shadow-2xs"
                  : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-stone-400">Memuat daftar pesanan...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <ShoppingCart className="h-10 w-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-800">Tidak ada pesanan ditemukan</h3>
          <p className="text-xs text-stone-500">
            Pesanan dari pelanggan di website publik akan otomatis tampil di sini.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">No. Pesanan</th>
                <th className="py-3.5 px-4">Pemesan</th>
                <th className="py-3.5 px-4">Layanan</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status Bayar</th>
                <th className="py-3.5 px-4">Tahap Order</th>
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.map((ord) => {
                const isPaid = ord.paymentStatus === "PAID";
                return (
                  <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-stone-900">{ord.customerName}</p>
                      <p className="text-stone-400 text-[10px]">{ord.customerPhone}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {ord.items && ord.items.length > 0 ? (
                        <div>
                          <p className="font-bold text-stone-800">{ord.items[0].productNameSnapshot}</p>
                          {ord.items.length > 1 && (
                            <span className="text-[10px] text-stone-400">
                              +{ord.items.length - 1} item lainnya
                            </span>
                          )}
                        </div>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-black text-stone-900">
                      {formatRupiah(ord.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          isPaid
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[11px] text-stone-700">
                      {ord.status}
                    </td>
                    <td className="py-3.5 px-4 text-stone-400 text-[10px]">
                      {new Date(ord.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {!isPaid && (
                        <Link
                          href={`/payment/${encodeURIComponent(ord.orderNumber)}`}
                          className="inline-flex items-center gap-1 text-amber-700 font-bold hover:underline"
                          title="Halaman Pembayaran"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>Bayar</span>
                        </Link>
                      )}
                      {isPaid && (
                        <Link
                          href={`/receipt/${encodeURIComponent(ord.orderNumber)}`}
                          className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                          title="Cetak Struk"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          <span>Struk</span>
                        </Link>
                      )}
                      <Link
                        href={`/order/${encodeURIComponent(ord.orderNumber)}`}
                        className="inline-flex items-center gap-1 text-stone-500 font-bold hover:text-stone-900"
                        title="Pelacakan Real-Time"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
