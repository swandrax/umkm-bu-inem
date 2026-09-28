"use client";

import React, { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Globe,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
  Headphones,
  Sparkles,
} from "lucide-react";
import { getServiceBySlug } from "@/lib/api/services";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { formatRupiah } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { settings } = useBusinessSettings();

  const { data: service, isLoading, isError } = useQuery({
    queryKey: ["service", slug],
    queryFn: () => getServiceBySlug(slug),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-xs text-stone-500 font-semibold">Memuat detail layanan...</p>
        </div>
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="min-h-[70vh] bg-[#faf9f5] flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-stone-200 space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Globe className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-black text-stone-900">Layanan Tidak Ditemukan</h2>
          <p className="text-xs text-stone-600">
            Layanan yang Anda cari mungkin sudah dipindahkan atau dinonaktifkan.
          </p>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-bold"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Katalog Layanan</span>
          </Link>
        </div>
      </div>
    );
  }

  const hasDiscount = service.basePrice > service.finalPrice;

  return (
    <div className="bg-[#faf9f5] min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Link href="/" className="hover:text-stone-900">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-stone-900">
            Layanan
          </Link>
          <span>/</span>
          <span className="text-stone-900 font-bold truncate max-w-[200px]">
            {service.name}
          </span>
        </div>

        {/* Hero Section of Service */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  <span>Paket Resmi UMKM Bu Inem</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
                  {service.name}
                </h1>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>

              {/* Delivery Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-stone-100 text-xs">
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                  <span className="text-stone-400 font-medium">Estimasi Waktu</span>
                  <p className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    {service.duration || "3-5 Hari Kerja"}
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                  <span className="text-stone-400 font-medium">Garansi</span>
                  <p className="font-bold text-stone-900 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    90 Hari Bebas Bug
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-100 space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-stone-400 font-medium">Metode Bayar</span>
                  <p className="font-bold text-stone-900">QRIS / Tunai</p>
                </div>
              </div>

              {/* Full Description */}
              {service.fullDescription && (
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider text-xs">
                    Deskripsi Lengkap
                  </h3>
                  <div className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line space-y-2">
                    {service.fullDescription}
                  </div>
                </div>
              )}

              {/* Features Checklist */}
              {service.features && service.features.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <h3 className="font-bold text-sm text-stone-900 uppercase tracking-wider text-xs">
                    Fitur & Deliverable Paket
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {service.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs font-semibold text-stone-800"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Support Notice */}
            <div className="rounded-3xl bg-amber-50/70 border border-amber-200/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-extrabold text-sm text-amber-950">
                  Butuh Modifikasi atau Paket Kustom?
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Konsultasikan alur kerja spesifik UMKM Anda bersama tim teknis kami secara langsung tanpa biaya.
                </p>
              </div>
              <a
                href={`https://wa.me/${settings.whatsapp?.replace(/[^0-9]/g, "") || "6281234567890"}?text=Halo%20UMKM%20Bu%20Inem,%20saya%20tertarik%20konsultasi%20layanan%20${encodeURIComponent(service.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors"
              >
                <Headphones className="h-4 w-4" />
                <span>Chat Konsultan</span>
              </a>
            </div>
          </div>

          {/* Pricing & Order Card (Sticky on desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 space-y-6 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">
                Ringkasan Investasi Bisnis
              </span>

              <div className="space-y-1">
                {hasDiscount && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400 line-through">
                      {formatRupiah(service.basePrice)}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-extrabold">
                      HEMAT{" "}
                      {service.discountType === "PERCENTAGE"
                        ? `${service.discountValue}%`
                        : formatRupiah(service.discountValue || 0)}
                    </span>
                  </div>
                )}
                <div className="text-3xl font-black text-stone-900">
                  {formatRupiah(service.finalPrice)}
                </div>
                <p className="text-[11px] text-stone-500 font-medium">
                  Harga final transparan, tanpa biaya tersembunyi.
                </p>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-stone-100 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Pelatihan & onboarding staf</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Struk resmi & bukti pembayaran digital</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Dukungan teknis prioritas</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <Link
                  href={`/order?service=${service.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-extrabold shadow-sm hover:from-amber-600 hover:to-orange-700 transition-all active:scale-95"
                >
                  <span>Pesan Layanan Sekarang</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/services"
                  className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
                >
                  Lihat Layanan Lainnya
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
