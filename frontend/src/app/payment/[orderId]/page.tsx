"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sparkles,
  QrCode,
  Banknote,
  CheckCircle2,
  XCircle,
  Printer,
  FileCheck,
  ShieldAlert,
  Check,
} from "lucide-react";
import {
  getOrderByNumber,
  simulateQris,
  payCash,
  getPaymentProof,
} from "@/lib/api/orders";
import { formatRupiah } from "@/lib/utils";
import { Order, PaymentProof } from "@/types/order";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default function PaymentPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderNumber = decodeURIComponent(resolvedParams.orderId);
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"QRIS" | "CASH">("QRIS");
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [cashInputString, setCashInputString] = useState<string>("");
  const [simulationStatus, setSimulationStatus] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Fetch Order details
  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["order", orderNumber],
    queryFn: () => getOrderByNumber(orderNumber),
    refetchInterval: (query) => {
      // Auto-poll while waiting for payment
      return query.state.data?.paymentStatus === "PAID" ? false : 3000;
    },
  });

  // Fetch Payment Proof if paid
  const { data: paymentProof } = useQuery<PaymentProof>({
    queryKey: ["payment-proof", orderNumber],
    queryFn: () => getPaymentProof(orderNumber),
    enabled: order?.paymentStatus === "PAID",
  });

  // QRIS Simulation Mutation
  const qrisMutation = useMutation({
    mutationFn: (action: "SUCCESS" | "FAILED" | "EXPIRED") =>
      simulateQris(orderNumber, action),
    onSuccess: (data, action) => {
      setSimulationStatus(action);
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ["order", orderNumber] });
      queryClient.invalidateQueries({ queryKey: ["payment-proof", orderNumber] });
    },
    onError: (err: Error) => {
      setActionError(err.message || "Gagal memproses simulasi QRIS.");
    },
  });

  // Cash Payment Mutation
  const cashMutation = useMutation({
    mutationFn: (amount: number) => payCash(orderNumber, amount),
    onSuccess: () => {
      setActionError(null);
      queryClient.invalidateQueries({ queryKey: ["order", orderNumber] });
      queryClient.invalidateQueries({ queryKey: ["payment-proof", orderNumber] });
    },
    onError: (err: Error) => {
      setActionError(err.message || "Gagal memproses pembayaran tunai.");
    },
  });

  if (isLoading || !order) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-xs text-stone-500 font-semibold">Memuat data pembayaran pesanan...</p>
        </div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === "PAID";
  const dueAmount = order.totalAmount;
  const changeAmount = Math.max(0, cashReceived - dueAmount);

  const handleCashShortcut = (amount: number) => {
    setCashReceived(amount);
    setCashInputString(String(amount));
  };

  const handleCashSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cashReceived < dueAmount) {
      setActionError("Jumlah uang tunai yang diterima kurang dari total tagihan.");
      return;
    }
    cashMutation.mutate(cashReceived);
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen py-8 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Gerbang Pembayaran Resmi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Pembayaran Pesanan #{order.orderNumber}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Selesaikan pembayaran untuk memvalidasi pengerjaan layanan digital Anda.
          </p>
        </div>

        {/* Action Error Alert */}
        {actionError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <XCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">{actionError}</p>
          </div>
        )}

        {/* SUCCESS STATE IF PAID */}
        {isPaid ? (
          <div className="bg-white rounded-3xl border-2 border-emerald-500 p-8 sm:p-10 shadow-lg text-center space-y-6">
            <div className="h-16 w-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                Pembayaran Berhasil Diverifikasi!
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                Terima kasih! Pesanan Anda telah lunas dan tercatat dalam sistem CRM UMKM Bu Inem. Bukti transaksi resmi telah diterbitkan.
              </p>
            </div>

            {/* Proof Card */}
            <div className="max-w-md mx-auto p-5 rounded-2xl bg-stone-50 border border-stone-200 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-500">No. Referensi:</span>
                <span className="font-mono font-bold text-stone-900">
                  {paymentProof?.paymentReference || `PAY-${order.orderNumber}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Pemesan:</span>
                <span className="font-bold text-stone-900">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Metode:</span>
                <span className="font-bold text-emerald-700">
                  {order.paymentMethod === "CASH" ? "Tunai (Cash)" : "QRIS Demo / Digital"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Dibayar:</span>
                <span className="font-black text-stone-900 text-sm">
                  {formatRupiah(order.totalAmount)}
                </span>
              </div>
              {order.paymentMethod === "CASH" && paymentProof?.changeAmount !== undefined && (
                <div className="flex justify-between text-stone-600 pt-1 border-t border-stone-200">
                  <span>Kembalian:</span>
                  <span className="font-bold">{formatRupiah(paymentProof.changeAmount)}</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href={`/receipt/${encodeURIComponent(order.orderNumber)}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 text-white font-extrabold shadow-sm hover:bg-emerald-700 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>Lihat & Cetak Struk Transaksi</span>
              </Link>

              <Link
                href={`/order/${encodeURIComponent(order.orderNumber)}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50 transition-colors"
              >
                <FileCheck className="h-4 w-4" />
                <span>Status Pesanan</span>
              </Link>
            </div>
          </div>
        ) : (
          /* PENDING / UNPAID STATE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Payment Method Action Box */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
              {/* Method Switcher Tabs */}
              <div className="flex rounded-2xl bg-stone-100 p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("QRIS")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "QRIS"
                      ? "bg-white text-stone-900 shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <QrCode className="h-4 w-4 text-amber-600" />
                  <span>QRIS Demo (Digital)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("CASH")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "CASH"
                      ? "bg-white text-stone-900 shadow-2xs"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  <Banknote className="h-4 w-4 text-amber-600" />
                  <span>Tunai (Cash di Kasir)</span>
                </button>
              </div>

              {/* TAB 1: QRIS DEMO */}
              {activeTab === "QRIS" && (
                <div className="space-y-6 text-center">
                  {/* Mandatory Demo Banner */}
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-center justify-center gap-2 font-bold">
                    <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>QRIS DEMO / SIMULASI PEMBAYARAN UJI COBA</span>
                  </div>

                  {/* QR Code Container */}
                  <div className="mx-auto max-w-[260px] p-5 rounded-3xl bg-stone-50 border border-stone-200 flex flex-col items-center space-y-3 shadow-inner">
                    {/* Native Scalable SVG QR Code */}
                    <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
                      <svg
                        viewBox="0 0 160 160"
                        className="w-48 h-48 text-stone-900"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Finder pattern Top-Left */}
                        <rect x="10" y="10" width="40" height="40" rx="4" fill="#1c1917" />
                        <rect x="18" y="18" width="24" height="24" rx="2" fill="#ffffff" />
                        <rect x="24" y="24" width="12" height="12" rx="1" fill="#1c1917" />
                        {/* Finder pattern Top-Right */}
                        <rect x="110" y="10" width="40" height="40" rx="4" fill="#1c1917" />
                        <rect x="118" y="18" width="24" height="24" rx="2" fill="#ffffff" />
                        <rect x="124" y="24" width="12" height="12" rx="1" fill="#1c1917" />
                        {/* Finder pattern Bottom-Left */}
                        <rect x="10" y="110" width="40" height="40" rx="4" fill="#1c1917" />
                        <rect x="18" y="118" width="24" height="24" rx="2" fill="#ffffff" />
                        <rect x="24" y="124" width="12" height="12" rx="1" fill="#1c1917" />
                        {/* Data Matrix Dots */}
                        <rect x="60" y="20" width="10" height="10" />
                        <rect x="80" y="20" width="10" height="10" />
                        <rect x="60" y="40" width="10" height="10" />
                        <rect x="90" y="40" width="10" height="10" />
                        <rect x="60" y="60" width="40" height="10" />
                        <rect x="20" y="70" width="10" height="20" />
                        <rect x="40" y="60" width="10" height="10" />
                        <rect x="110" y="70" width="20" height="10" />
                        <rect x="140" y="70" width="10" height="10" />
                        <rect x="70" y="80" width="20" height="20" fill="#d97706" />
                        <rect x="60" y="110" width="10" height="20" />
                        <rect x="80" y="110" width="20" height="10" />
                        <rect x="110" y="110" width="20" height="10" />
                        <rect x="120" y="130" width="20" height="10" />
                        <rect x="90" y="130" width="10" height="20" />
                      </svg>
                    </div>

                    <div className="text-center space-y-0.5">
                      <span className="font-black text-xs text-stone-900 tracking-wider">
                        NMID: ID102026UMKMBUINEM
                      </span>
                      <p className="text-[10px] text-stone-500 font-mono">
                        UMKM-BU-INEM-DEMO|{order.orderNumber}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Pada mode operasional langsung, Anda dapat mensimulasikan respons sistem pembayaran QRIS menggunakan tombol simulator berikut:
                  </p>

                  {/* QRIS Interactive Simulator Buttons */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      disabled={qrisMutation.isPending}
                      onClick={() => qrisMutation.mutate("SUCCESS")}
                      className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 text-white text-xs sm:text-sm font-extrabold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Check className="h-4 w-4" />
                      <span>
                        {qrisMutation.isPending && simulationStatus === "SUCCESS"
                          ? "Memproses Verifikasi..."
                          : "Simulasikan Pembayaran Berhasil"}
                      </span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={qrisMutation.isPending}
                        onClick={() => qrisMutation.mutate("FAILED")}
                        className="py-2.5 px-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Simulasi Gagal
                      </button>
                      <button
                        type="button"
                        disabled={qrisMutation.isPending}
                        onClick={() => qrisMutation.mutate("EXPIRED")}
                        className="py-2.5 px-3 rounded-xl border border-stone-200 bg-stone-50 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        Simulasi Kedaluwarsa
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CASH PAYMENT */}
              {activeTab === "CASH" && (
                <form onSubmit={handleCashSubmit} className="space-y-5">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-stone-600">Total Tagihan:</span>
                      <span className="text-xl font-black text-stone-900">
                        {formatRupiah(dueAmount)}
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Nominal Tunai Diterima (Rp) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={cashInputString}
                        onChange={(e) => {
                          setCashInputString(e.target.value);
                          setCashReceived(Number(e.target.value) || 0);
                        }}
                        placeholder="Contoh: 1500000"
                        className="w-full px-4 py-3 rounded-xl border border-stone-300 text-stone-900 text-base font-bold font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    {/* Quick Cash Shortcuts */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Uang Pas / Cepat:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleCashShortcut(dueAmount)}
                          className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 text-amber-900 text-[11px] font-bold hover:bg-amber-100"
                        >
                          Uang Pas ({formatRupiah(dueAmount)})
                        </button>
                        {[500000, 1000000, 2000000, 3000000, 5000000].map((amt) => {
                          if (amt < dueAmount && dueAmount - amt > 100000) return null;
                          return (
                            <button
                              key={amt}
                              type="button"
                              onClick={() => handleCashShortcut(amt)}
                              className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 text-[11px] font-bold hover:bg-stone-50"
                            >
                              {formatRupiah(amt)}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Change / Kembalian Calculation */}
                    <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                      <span className="text-xs font-bold text-stone-600">Kembalian:</span>
                      <span
                        className={`text-lg font-black font-mono ${
                          cashReceived >= dueAmount ? "text-emerald-700" : "text-stone-400"
                        }`}
                      >
                        {formatRupiah(changeAmount)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={cashMutation.isPending || cashReceived < dueAmount}
                    className="w-full py-3.5 px-4 rounded-xl bg-amber-500 text-white text-xs sm:text-sm font-extrabold hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Check className="h-4 w-4" />
                    <span>
                      {cashMutation.isPending
                        ? "Menyimpan Transaksi Tunai..."
                        : "Konfirmasi Pembayaran Kasir"}
                    </span>
                  </button>
                </form>
              )}
            </div>

            {/* Order Review Sidebar */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-5 shadow-xs">
              <h3 className="font-extrabold text-sm sm:text-base text-stone-900 border-b border-stone-100 pb-3">
                Rincian Tagihan
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">No. Pesanan:</span>
                  <span className="font-mono font-bold text-stone-900">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Pemesan:</span>
                  <span className="font-bold text-stone-900">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">No. WhatsApp:</span>
                  <span className="font-bold text-stone-900">{order.customerPhone}</span>
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                    Item Layanan:
                  </span>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-bold text-stone-800">{item.productNameSnapshot}</p>
                        <p className="text-[10px] text-stone-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-stone-900">
                        {formatRupiah(item.lineTotal)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-100 space-y-1.5">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span>{formatRupiah(order.subtotal)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Diskon Promosi:</span>
                      <span>- {formatRupiah(order.discountAmount)}</span>
                    </div>
                  )}
                  {order.taxAmount > 0 && (
                    <div className="flex justify-between text-stone-600">
                      <span>Pajak:</span>
                      <span>{formatRupiah(order.taxAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-900 font-black text-base pt-2 border-t border-stone-200">
                    <span>Total Tagihan:</span>
                    <span className="text-amber-700">{formatRupiah(order.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link
                  href={`/order/${encodeURIComponent(order.orderNumber)}`}
                  className="text-xs font-bold text-stone-500 hover:text-stone-800 underline"
                >
                  Pelajari Status Pesanan Ini
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
