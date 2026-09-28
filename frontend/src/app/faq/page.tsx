"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ChevronDown,
  HelpCircle,
  Headphones,
  ArrowRight,
} from "lucide-react";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";

interface FaqItem {
  category: string;
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    category: "Layanan & Teknis",
    q: "Berapa lama waktu yang dibutuhkan untuk menyelesaikan website?",
    a: "Rata-rata pengerjaan paket website company profile adalah 3-5 hari kerja, dan katalog online 5-7 hari kerja setelah seluruh aset logo, teks, dan foto produk kami terima secara lengkap.",
  },
  {
    category: "Layanan & Teknis",
    q: "Apakah website yang dibuat bisa diakses cepat lewat smartphone?",
    a: "Tentu! Seluruh website dibangun dengan arsitektur Next.js 16 modern yang dioptimasi khusus untuk kecepatan koneksi mobile di Indonesia, responsif di berbagai resolusi layar, dan hemat kuota.",
  },
  {
    category: "Layanan & Teknis",
    q: "Apakah ada biaya bulanan atau tahunan?",
    a: "Paket kami sudah mencakup domain dan cloud hosting selama 1 tahun pertama. Untuk perpanjangan tahun berikutnya sangat terjangkau (hanya biaya perpanjangan domain & server standar) tanpa biaya royalti tersembunyi.",
  },
  {
    category: "Pembayaran & Garansi",
    q: "Bagaimana sistem pembayaran layanan di UMKM Bu Inem?",
    a: "Kami menerima pembayaran Tunai (Cash) di kantor perwakilan Yogyakarta, transfer bank, dan QRIS resmi. Anda dapat melakukan pembayaran penuh atau skema termin sesuai kesepakatan dengan bukti struk digital resmi.",
  },
  {
    category: "Pembayaran & Garansi",
    q: "Bagaimana jika terjadi kendala teknis atau bug setelah serah terima?",
    a: "Setiap paket dilindungi Garansi Bebas Bug selama 90 hari kalender. Tim teknis kami siap memperbaiki kendala tanpa pungutan biaya tambahan.",
  },
  {
    category: "Manajemen & Operasional",
    q: "Apakah kami diajarkan cara mengelola katalog dan data pelanggan?",
    a: "Ya! Kami menyediakan sesi onboarding intensif dan panduan lengkap. Dashboard dirancang sangat ramah pemula tanpa perlu keahlian koding apapun.",
  },
  {
    category: "Manajemen & Operasional",
    q: "Bagaimana cara kerja sistem QRIS Demo di platform ini?",
    a: "Untuk keperluan uji coba dan evaluasi operasional sebelum integrasi merchant resmi perbankan, sistem kami menyediakan simulator QRIS Demo yang dapat memicu alur verifikasi berhasil, gagal, dan cetak struk secara instan.",
  },
];

export default function FaqPage() {
  const { settings } = useBusinessSettings();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Pusat Informasi</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Semua yang perlu Anda ketahui mengenai proses kerja, biaya, pembayaran, dan garansi layanan UMKM Bu Inem.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-stone-900 hover:text-amber-700 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 font-extrabold hidden sm:inline-block">
                      {item.category}
                    </span>
                    <span>{item.q}</span>
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-amber-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions CTA */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <HelpCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-black text-stone-900">
            Masih memiliki pertanyaan lain yang belum terjawab?
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
            Tim konsultan kami siap berdiskusi secara langsung melalui WhatsApp atau sesi panggilan singkat untuk menjawab segala keraguan Anda.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/${settings.whatsapp?.replace(/[^0-9]/g, "") || "6281234567890"}?text=Halo%20UMKM%20Bu%20Inem,%20saya%20ingin%20bertanya%20seputar%20layanan`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              <Headphones className="h-4 w-4" />
              <span>Tanya via WhatsApp</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
            >
              <span>Kirim Pesan Email</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
