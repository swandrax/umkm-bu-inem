"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Clock,
} from "lucide-react";
import { formatRupiah } from "@/lib/utils";

const PACKAGES = [
  {
    name: "Starter Company Profile",
    slug: "website-company-profile",
    price: 1350000,
    basePrice: 1500000,
    description: "Cocok untuk UMKM yang ingin mulai membangun citra profesional dan tampil teratas di Google.",
    duration: "3-5 Hari Kerja",
    highlight: false,
    features: [
      "Website 1 Halaman / Profil Responsif",
      "Domain (.my.id / .com) & Hosting 1 Thn",
      "Optimasi SEO Google Lokal",
      "Tombol WhatsApp Interaktif",
      "Formulir Kontak Terhubung Email",
      "Garansi Bug-Free 90 Hari",
    ],
    notIncluded: ["Keranjang Belanja Online", "Database CRM Pelanggan"],
  },
  {
    name: "Business Online Catalog",
    slug: "website-toko-online-katalog",
    price: 2200000,
    basePrice: 2500000,
    description: "Etalase pemesanan mandiri 24/7 tanpa komisi platform pihak ketiga, praktis dan cepat.",
    duration: "5-7 Hari Kerja",
    highlight: true,
    badge: "Paling Populer",
    features: [
      "Semua Fitur Paket Starter",
      "Katalog Produk & Kategori Dinamis",
      "Sistem Pencarian & Filter Cepat",
      "Checkout Keranjang via WhatsApp",
      "Dashboard Kelola Produk Mandiri",
      "Pelatihan Staf Admin Toko",
      "Garansi Bug-Free 90 Hari",
    ],
    notIncluded: ["Pipeline CRM Lanjutan"],
  },
  {
    name: "Enterprise CRM & Commerce",
    slug: "crm-customer-management-setup",
    price: 3200000,
    basePrice: 3200000,
    description: "Sistem lengkap terpusat untuk mengelola ribuan data pelanggan, pipeline prospek, dan transaksi.",
    duration: "7-10 Hari Kerja",
    highlight: false,
    features: [
      "Semua Fitur Paket Business",
      "Sistem CRM Customer 360",
      "Pipeline Kanban Prospek / Leads",
      "Integrasi QRIS & Struk Transaksi",
      "Laporan Omset & Analitik Retensi",
      "Dukungan Teknis Prioritas 6 Bulan",
      "Garansi Bug-Free 90 Hari",
    ],
    notIncluded: [],
  },
];

export default function PricingPage() {
  return (
    <div className="bg-[#faf9f5] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Investasi Bisnis Transparan</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Pilihan Paket Sesuai Skala UMKM
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Tanpa biaya tersembunyi, tanpa sistem bagi hasil yang merugikan. Seluruh website dan data 100% menjadi aset milik bisnis Anda.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PACKAGES.map((pkg, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                pkg.highlight
                  ? "bg-white border-2 border-amber-500 shadow-xl relative"
                  : "bg-white border border-stone-200 shadow-xs"
              }`}
            >
              {pkg.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-500 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                  {pkg.badge}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-extrabold text-xl text-stone-900">{pkg.name}</h3>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    {pkg.description}
                  </p>
                </div>

                <div className="space-y-1 pb-4 border-b border-stone-100">
                  {pkg.basePrice > pkg.price && (
                    <span className="block text-xs text-stone-400 line-through">
                      {formatRupiah(pkg.basePrice)}
                    </span>
                  )}
                  <div className="text-3xl font-black text-stone-900">
                    {formatRupiah(pkg.price)}
                  </div>
                  <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1.5 pt-1">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    Pengerjaan: {pkg.duration}
                  </span>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-black uppercase tracking-wider text-stone-400">
                    Fitur & Deliverable:
                  </p>
                  <ul className="space-y-2.5 text-xs text-stone-700">
                    {pkg.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                    {pkg.notIncluded.map((notFeat, i) => (
                      <li key={i} className="flex items-start gap-2 text-stone-400 line-through">
                        <XCircle className="h-4 w-4 text-stone-300 shrink-0 mt-0.5" />
                        <span>{notFeat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 border-t border-stone-100 mt-8 space-y-2.5">
                <Link
                  href={`/order?service=${pkg.slug}`}
                  className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all active:scale-95 ${
                    pkg.highlight
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm hover:from-amber-600 hover:to-orange-700"
                      : "bg-stone-900 text-white hover:bg-stone-800"
                  }`}
                >
                  <span>Pilih Paket Ini</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href={`/services/${pkg.slug}`}
                  className="w-full inline-flex items-center justify-center py-2 text-center text-xs font-bold text-stone-600 hover:text-stone-900"
                >
                  Lihat Rincian Teknis
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Notice */}
        <div className="rounded-3xl bg-white border border-stone-200 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-stone-900">
              Perlu Penyesuaian Paket / Sistem Khusus?
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              Kami juga melayani integrasi API pihak ketiga, multi-cabang, inventaris khusus, dan database skala besar dengan sistem kontrak fleksibel.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-6 py-3.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-800 text-xs font-bold hover:bg-stone-100 transition-colors"
          >
            Konsultasikan Kebutuhan Kustom
          </Link>
        </div>
      </div>
    </div>
  );
}
