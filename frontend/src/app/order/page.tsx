"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  User,
  Phone,
  Mail,
  Building,
  MapPin,
  FileText,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { getServices } from "@/lib/api/services";
import { createOrder } from "@/lib/api/orders";
import { formatRupiah } from "@/lib/utils";
import { ServiceProduct } from "@/types/service";

function OrderFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get("service");

  const [userSelectedServiceId, setUserSelectedServiceId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerCompany, setCustomerCompany] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("QRIS_DUMMY");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data: services = [], isLoading } = useQuery<ServiceProduct[]>({
    queryKey: ["services-active"],
    queryFn: () => getServices(true),
  });

  const defaultServiceId = services.find((s) => s.slug === preselectedSlug)?.id ?? services[0]?.id ?? null;
  const selectedServiceId = userSelectedServiceId ?? defaultServiceId;
  const setSelectedServiceId = (id: number | null) => setUserSelectedServiceId(id);

  const selectedService = services.find((s) => s.id === selectedServiceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) {
      setErrorMessage("Silakan pilih paket layanan terlebih dahulu.");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage("Nama dan nomor WhatsApp/Telepon wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const order = await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        customerCompany: customerCompany.trim() || undefined,
        customerAddress: customerAddress.trim() || undefined,
        paymentMethod: paymentMethod,
        notes: notes.trim() || undefined,
        items: [
          {
            serviceProductId: selectedServiceId,
            quantity: 1,
          },
        ],
      });

      // Redirect immediately to payment flow
      router.push(`/payment/${encodeURIComponent(order.orderNumber)}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal membuat pesanan. Silakan periksa koneksi Anda.";
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen py-8 sm:py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Pemesanan Langsung & Aman</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Formulir Pemesanan Layanan UMKM
          </h1>
          <p className="text-xs sm:text-sm text-stone-600">
            Lengkapi data diri dan kebutuhan bisnis Anda. Sistem kami akan secara otomatis menghasilkan nomor pesanan dan tagihan resmi.
          </p>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <p className="font-semibold leading-relaxed">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Service Selector & Customer Information */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Choose Service */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-black">
                    1
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                    Pilih Paket Layanan
                  </h3>
                </div>
                <Link href="/services" className="text-xs font-bold text-amber-700 hover:underline">
                  Katalog Detail
                </Link>
              </div>

              {isLoading ? (
                <div className="p-6 text-center text-xs text-stone-400">Memuat opsi layanan...</div>
              ) : (
                <div className="space-y-2.5">
                  {services.map((srv) => {
                    const isSelected = selectedServiceId === srv.id;
                    return (
                      <label
                        key={srv.id}
                        className={`flex items-start justify-between gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-50/70 border-amber-500 shadow-2xs"
                            : "bg-white border-stone-200 hover:bg-stone-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="selectedService"
                            checked={isSelected}
                            onChange={() => setSelectedServiceId(srv.id)}
                            className="mt-1 h-4 w-4 text-amber-600 focus:ring-amber-500"
                          />
                          <div>
                            <p className="font-extrabold text-xs sm:text-sm text-stone-900">
                              {srv.name}
                            </p>
                            <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">
                              {srv.shortDescription}
                            </p>
                            {srv.duration && (
                              <span className="inline-block mt-1 text-[10px] font-semibold text-stone-400">
                                Estimasi: {srv.duration}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          {srv.basePrice > srv.finalPrice && (
                            <span className="block text-[10px] text-stone-400 line-through">
                              {formatRupiah(srv.basePrice)}
                            </span>
                          )}
                          <span className="text-xs sm:text-sm font-black text-stone-900">
                            {formatRupiah(srv.finalPrice)}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 2: Customer Identity */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-black">
                  2
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                  Data Pemesan / Bisnis Anda
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Nama Lengkap <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Nama pemilik / pemesan"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      No. WhatsApp / HP <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="081234567890"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Alamat Email (Opsional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="email@bisnis.com"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Nama UMKM / Usaha (Opsional)
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                      <input
                        type="text"
                        value={customerCompany}
                        onChange={(e) => setCustomerCompany(e.target.value)}
                        placeholder="Nama brand atau toko"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Alamat / Kota Domisili
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                    <textarea
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      placeholder="Contoh: Yogyakarta / Sleman"
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Catatan Tambahan / Kebutuhan Spesifik
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3 h-4 w-4 text-stone-400" />
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tuliskan jika ada preferensi warna, contoh website yang disukai, atau target waktu serah terima..."
                      className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Preferred Payment Method */}
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-black">
                  3
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900">
                  Metode Pembayaran
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === "QRIS_DUMMY"
                      ? "bg-amber-50 border-amber-500"
                      : "bg-white border-stone-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="QRIS_DUMMY"
                    checked={paymentMethod === "QRIS_DUMMY"}
                    onChange={() => setPaymentMethod("QRIS_DUMMY")}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="block font-bold text-xs sm:text-sm text-stone-900">
                      QRIS Digital (Demo)
                    </span>
                    <span className="block text-[11px] text-stone-500">
                      Simulasi pembayaran QRIS instan
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === "CASH"
                      ? "bg-amber-50 border-amber-500"
                      : "bg-white border-stone-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CASH"
                    checked={paymentMethod === "CASH"}
                    onChange={() => setPaymentMethod("CASH")}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="block font-bold text-xs sm:text-sm text-stone-900">
                      Tunai (Cash di Kasir)
                    </span>
                    <span className="block text-[11px] text-stone-500">
                      Pembayaran langsung di kantor / outlet
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Review */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-6 shadow-sm">
              <h3 className="font-extrabold text-base text-stone-900 border-b border-stone-100 pb-3">
                Ringkasan Tagihan Pesanan
              </h3>

              {selectedService ? (
                <div className="space-y-4 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-black text-stone-900 text-sm">{selectedService.name}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">1 Paket Layanan Lengkap</p>
                    </div>
                    <span className="font-black text-stone-900 text-sm shrink-0">
                      {formatRupiah(selectedService.basePrice)}
                    </span>
                  </div>

                  {selectedService.basePrice > selectedService.finalPrice && (
                    <div className="flex items-center justify-between text-emerald-700 font-bold">
                      <span>Potongan / Diskon Promosi</span>
                      <span>
                        - {formatRupiah(selectedService.basePrice - selectedService.finalPrice)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-stone-500">
                    <span>Biaya Setup & Administrasi</span>
                    <span className="text-emerald-700 font-bold">GRATIS</span>
                  </div>

                  <div className="pt-4 border-t border-stone-200 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-500 block">Total Tagihan</span>
                      <span className="text-2xl font-black text-stone-900">
                        {formatRupiah(selectedService.finalPrice)}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                      Harga Final
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-400">Pilih layanan di samping terlebih dahulu.</p>
              )}

              <div className="rounded-2xl bg-stone-50 p-4 border border-stone-100 space-y-2 text-[11px] text-stone-600">
                <div className="flex items-center gap-2 text-stone-900 font-bold">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>Jaminan Transaksi Terpercaya</span>
                </div>
                <p>
                  Setelah konfirmasi pesanan, Anda akan diarahkan ke halaman pembayaran dan mendapatkan struk digital resmi berbarcode.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedServiceId}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs sm:text-sm font-extrabold shadow-sm hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
              >
                <span>{isSubmitting ? "Memproses Pesanan..." : "Lanjutkan ke Pembayaran"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            <p className="text-xs text-stone-500 font-semibold">Memuat formulir pemesanan...</p>
          </div>
        </div>
      }
    >
      <OrderFormContent />
    </Suspense>
  );
}
