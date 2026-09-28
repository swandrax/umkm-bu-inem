"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

interface PortfolioItem {
  id: number;
  title: string;
  category: "WEBSITE" | "KATALOG" | "CRM" | "QRIS";
  categoryLabel: string;
  clientName: string;
  location: string;
  summary: string;
  metrics: string;
  results: string[];
}

const PORTFOLIOS: PortfolioItem[] = [
  {
    id: 1,
    title: "Website Company Profile & Booking Kopi Nusantara",
    category: "WEBSITE",
    categoryLabel: "Website Profil",
    clientName: "Kedai Kopi Nusantara",
    location: "Sleman, D.I. Yogyakarta",
    summary:
      "Transformasi kedai kopi tradisional dengan website responsive, showcase varietas biji kopi, reservasi meja, dan pemesanan cold brew via WhatsApp.",
    metrics: "+42% Reservasi Online",
    results: [
      "Waktu loading 0.8 detik pada mobile",
      "Peringkat #1 Google Lokal 'kopi asli jogja'",
      "Integrasi formulir reservasi langsung ke barista",
    ],
  },
  {
    id: 2,
    title: "Etalase Digital & Katalog Pemesanan Batik Sekar Arum",
    category: "KATALOG",
    categoryLabel: "Katalog Online",
    clientName: "Batik Tulis Sekar Arum",
    location: "Bantul, D.I. Yogyakarta",
    summary:
      "Katalog digital interaktif berisi 200+ motif batik tulis eksklusif dengan filter warna, bahan, harga, dan fitur checkout pesanan tanpa potongan komisi.",
    metrics: "250+ Order / Bulan",
    results: [
      "Katalog responsif tanpa hambatan di handphone",
      "Checkout langsung menghasilkan invoice otomatis",
      "Menghemat waktu staf membalas chat berulang",
    ],
  },
  {
    id: 3,
    title: "Implementasi Sistem CRM Sentra Kerajinan Kulit Mandiri",
    category: "CRM",
    categoryLabel: "Sistem CRM",
    clientName: "Sentra Kulit Mandiri",
    location: "Kotagede, Yogyakarta",
    summary:
      "Sentralisasi data 1.400+ pelanggan grosir dan reseller nasional, pelacakan pipeline transaksi pesanan khusus, dan riwayat pesanan otomatis.",
    metrics: "98% Retensi Reseller",
    results: [
      "Pipeline penjualan terstruktur dari inquiry sampai lunas",
      "Pencatatan interaksi dan follow-up pelanggan terjadwal",
      "Dashboard performa omset mingguan & bulanan",
    ],
  },
  {
    id: 4,
    title: "Integrasi QRIS Dinamis & Kasir Digital Warung Bu Inem",
    category: "QRIS",
    categoryLabel: "Kasir & QRIS",
    clientName: "Jajanan Tradisional Bu Inem",
    location: "Malioboro, Yogyakarta",
    summary:
      "Penerimaan pembayaran nontunai instan dari seluruh bank dan e-wallet dengan cetak struk thermal 58mm dan rekonsiliasi kasir otomatis.",
    metrics: "0 Selisih Kasir",
    results: [
      "Waktu antrean pembayaran berkurang 60%",
      "Cetak bukti struk otomatis dengan barcode transaksi",
      "Verifikasi status pembayaran real-time",
    ],
  },
];

export default function PortfolioPage() {
  const [filter, setFilter] = useState<string>("ALL");

  const filteredItems =
    filter === "ALL"
      ? PORTFOLIOS
      : PORTFOLIOS.filter((item) => item.category === filter);

  return (
    <div className="bg-[#faf9f5] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Karya & Jejak Prestasi</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Portfolio & Studi Kasus UMKM
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Lihat bagaimana solusi teknologi praktis kami secara nyata membantu rekan pelaku bisnis UMKM di berbagai industri meningkatkan efisiensi dan pendapatan.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { label: "Semua Proyek", val: "ALL" },
            { label: "Website Profil", val: "WEBSITE" },
            { label: "Katalog Online", val: "KATALOG" },
            { label: "Sistem CRM", val: "CRM" },
            { label: "Kasir & QRIS", val: "QRIS" },
          ].map((btn) => (
            <button
              key={btn.val}
              type="button"
              onClick={() => setFilter(btn.val)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filter === btn.val
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-white border border-stone-200 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:shadow-md transition-all space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900">
                    {item.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-extrabold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>{item.metrics}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-stone-900 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-amber-700 font-semibold mt-1">
                    {item.clientName} • {item.location}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {item.summary}
                </p>

                <div className="space-y-2 pt-3 border-t border-stone-100">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Hasil Implementasi:
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    {item.results.map((res, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <Link
                  href="/order"
                  className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-800"
                >
                  <span>Ingin solusi serupa untuk bisnis Anda? Konsultasikan</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 sm:p-10 text-white text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black">
              Punya Rencana Proyek Digital UMKM Sendiri?
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
              Kami siap membantu menganalisis kebutuhan operasional bisnis Anda dan memberikan estimasi rencana implementasi yang tepat sasaran.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-white text-stone-900 text-xs sm:text-sm font-black hover:bg-stone-100 transition-colors"
          >
            Minta Penawaran Kustom
          </Link>
        </div>
      </div>
    </div>
  );
}
