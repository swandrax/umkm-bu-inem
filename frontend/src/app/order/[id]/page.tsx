"use client";

import React, { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  Clock,
  CheckCircle2,
  Printer,
  Home,
  ArrowRight,
} from "lucide-react";
import { getOrderByNumber, getOrderStatus } from "@/lib/api/orders";
import { formatRupiah } from "@/lib/utils";
import { Order } from "@/types/order";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OrderTrackingPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderNumber = decodeURIComponent(resolvedParams.id);

  // Full order data
  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["order-detail", orderNumber],
    queryFn: () => getOrderByNumber(orderNumber),
  });

  // Real-time synchronization via controlled polling every 4 seconds
  const { data: liveStatus } = useQuery({
    queryKey: ["order-status-sync", orderNumber],
    queryFn: () => getOrderStatus(orderNumber),
    refetchInterval: (query) => {
      // Stop polling when completed or canceled
      const st = query.state.data?.orderStatus;
      return st === "COMPLETED" || st === "CANCELED" ? false : 4000;
    },
    enabled: !!order,
  });

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-xs text-stone-500 font-semibold">Memuat status pesanan...</p>
        </div>
      </div>
    );
  }

  const currentStatus = liveStatus?.orderStatus || order.status;
  const isPaid = (liveStatus?.paymentStatus || order.paymentStatus) === "PAID";

  // Step stages
  const STAGES = [
    { key: "ORDER_CREATED", label: "Pesanan Dibuat", done: true },
    { key: "PAID", label: "Pembayaran Dikonfirmasi", done: isPaid },
    {
      key: "PROCESSING",
      label: "Pengerjaan Layanan",
      done: isPaid && ["PROCESSING", "COMPLETED"].includes(currentStatus),
    },
    { key: "COMPLETED", label: "Selesai & Serah Terima", done: currentStatus === "COMPLETED" },
  ];

  return (
    <div className="bg-[#faf9f5] min-h-screen py-8 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Pelacakan Status Real-Time</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Status Pesanan #{order.orderNumber}
          </h1>
          <p className="text-xs text-stone-500 flex items-center justify-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Sinkronisasi otomatis aktif</span>
          </p>
        </div>

        {/* Progress Stepper Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Tahapan Pengerjaan
              </span>
              <h3 className="font-black text-lg text-stone-900 mt-0.5">
                {currentStatus === "COMPLETED"
                  ? "Pesanan Telah Selesai"
                  : isPaid
                  ? "Dalam Proses Pengerjaan"
                  : "Menunggu Pembayaran"}
              </h3>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                isPaid
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-amber-50 text-amber-800 border-amber-200"
              }`}
            >
              {isPaid ? "SUDAH DIBAYAR" : "BELUM DIBAYAR"}
            </span>
          </div>

          {/* Stepper Timeline */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STAGES.map((st, idx) => (
              <div
                key={st.key}
                className={`p-4 rounded-2xl border transition-all ${
                  st.done
                    ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                    : "bg-stone-50 border-stone-200 text-stone-400"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black">Tahap {idx + 1}</span>
                  {st.done ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-stone-300" />
                  )}
                </div>
                <p className="text-xs font-bold leading-snug">{st.label}</p>
              </div>
            ))}
          </div>

          {/* Action Callout if unpaid */}
          {!isPaid ? (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <p className="font-extrabold text-sm text-amber-950">
                  Pesanan siap diproses setelah pembayaran terverifikasi
                </p>
                <p className="text-xs text-amber-800">
                  Total yang harus dibayar:{" "}
                  <strong className="text-amber-950">{formatRupiah(order.totalAmount)}</strong>
                </p>
              </div>

              <Link
                href={`/payment/${encodeURIComponent(order.orderNumber)}`}
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-extrabold hover:bg-amber-700 transition-colors shadow-xs"
              >
                <span>Bayar Sekarang (QRIS/Cash)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <p className="font-extrabold text-sm text-emerald-950">
                  Pembayaran Berhasil! Tim kami sedang mengeksekusi layanan
                </p>
                <p className="text-xs text-emerald-800">
                  Bukti pembayaran dan struk resmi sudah dapat diunduh.
                </p>
              </div>

              <Link
                href={`/receipt/${encodeURIComponent(order.orderNumber)}`}
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-extrabold hover:bg-emerald-800 transition-colors shadow-xs"
              >
                <Printer className="h-4 w-4" />
                <span>Lihat Struk Transaksi</span>
              </Link>
            </div>
          )}
        </div>

        {/* Order Details & Items Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <h4 className="font-extrabold text-sm text-stone-900 border-b border-stone-100 pb-2">
              Informasi Pemesan
            </h4>
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Nama:</span>
                <span className="font-bold text-stone-900">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>WhatsApp:</span>
                <span className="font-bold text-stone-900">{order.customerPhone}</span>
              </div>
              {order.customerEmail && (
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-bold text-stone-900">{order.customerEmail}</span>
                </div>
              )}
              {order.customerCompany && (
                <div className="flex justify-between">
                  <span>UMKM / Usaha:</span>
                  <span className="font-bold text-stone-900">{order.customerCompany}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 p-6 space-y-4 shadow-xs">
            <h4 className="font-extrabold text-sm text-stone-900 border-b border-stone-100 pb-2">
              Ringkasan Layanan
            </h4>
            <div className="space-y-2 text-xs">
              {order.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-stone-900">{it.productNameSnapshot}</span>
                    <p className="text-[10px] text-stone-500">Qty: {it.quantity}</p>
                  </div>
                  <span className="font-black text-stone-900">{formatRupiah(it.lineTotal)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-stone-100 flex justify-between font-black text-sm text-stone-900">
                <span>Total:</span>
                <span className="text-amber-700">{formatRupiah(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-stone-500 hover:text-stone-800"
          >
            <Home className="h-4 w-4" />
            <span>Kembali ke Halaman Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
