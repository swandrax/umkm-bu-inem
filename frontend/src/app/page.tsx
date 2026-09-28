"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe,
  Database,
  QrCode,
  ShieldCheck,
  TrendingUp,
  Clock,
  Users,
  Award,
  ChevronRight,
  Headphones,
  Laptop,
} from "lucide-react";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { formatRupiah } from "@/lib/utils";

const CORE_SERVICES = [
  {
    slug: "website-company-profile",
    title: "Website Company Profile UMKM",
    shortDesc: "Tingkatkan kredibilitas bisnis dengan website profesional berkecepatan tinggi, SEO-ready, dan mobile friendly.",
    price: 1350000,
    basePrice: 1500000,
    duration: "3-5 Hari",
    badge: "Populer",
    icon: Globe,
    features: [
      "Desain Responsif Mobile & Desktop",
      "Optimasi SEO Google Lokal",
      "Integrasi Tombol WhatsApp",
      "Domain & Cloud Hosting 1 Tahun",
    ],
  },
  {
    slug: "website-toko-online-katalog",
    title: "Website Katalog & Pemesanan Online",
    shortDesc: "Etalase digital interaktif 24/7 untuk menerima pesanan tanpa potongan komisi pihak ketiga.",
    price: 2200000,
    basePrice: 2500000,
    duration: "5-7 Hari",
    badge: "Best Value",
    icon: Laptop,
    features: [
      "Katalog Produk & Kategori Dinamis",
      "Pencarian Instan & Filter Cepat",
      "Checkout Keranjang via WhatsApp",
      "Dashboard Kelola Mandiri",
    ],
  },
  {
    slug: "crm-customer-management-setup",
    title: "Setup Sistem CRM & Pelanggan",
    shortDesc: "Otomatisasi pencatatan prospek, riwayat interaksi, dan retensi pelanggan untuk mendongkrak omset.",
    price: 3200000,
    basePrice: 3200000,
    duration: "7-10 Hari",
    badge: "Solusi Bisnis",
    icon: Database,
    features: [
      "Pipeline Prospek / Kanban Visual",
      "Database Pelanggan Terpusat (Customer 360)",
      "Riwayat Transaksi & Log Aktivitas",
      "Pelatihan Staf Admin Terpadu",
    ],
  },
  {
    slug: "integrasi-pembayaran-qris",
    title: "Integrasi Pembayaran QRIS Digital",
    shortDesc: "Terima pembayaran instan dari GoPay, OVO, ShopeePay, DANA, dan seluruh Mobile Banking.",
    price: 1020000,
    basePrice: 1200000,
    duration: "2-3 Hari",
    badge: "Cashless",
    icon: QrCode,
    features: [
      "Setup QRIS Resmi & Standar Nasional",
      "Verifikasi Transaksi Otomatis",
      "Dukungan Struk Cetak Thermal 58mm",
      "Panduan Rekonsiliasi Keuangan",
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Hendra Wijaya",
    business: "Kopi Nusantara Jogja",
    quote:
      "Pembuatan website katalog dan integrasi kasirnya luar biasa cepat. Penjualan paket oleh-oleh kami meningkat hingga 40% setelah pelanggan bisa pesan langsung via website.",
    rating: 5,
  },
  {
    name: "Siti Rahmawati",
    business: "Batik Sekar Arum",
    quote:
      "Sistem CRM dari Bu Inem memudahkan tim kami follow-up calon pembeli grosir. Tidak ada lagi pesanan yang terlewat atau lupa dicatat!",
    rating: 5,
  },
  {
    name: "Bambang Santoso",
    business: "Sentra Kerajinan Kulit",
    quote:
      "Pelayanan ramah, pendampingan teknis sangat sabar untuk orang awam, dan garansinya terbukti. Sangat kami rekomendasikan untuk sesama pelaku UMKM.",
    rating: 5,
  },
];

const FAQS = [
  {
    q: "Berapa lama proses pengerjaan website atau sistem?",
    a: "Tergantung paket yang dipilih, rata-rata pengerjaan berkisar antara 3 hingga 7 hari kerja setelah seluruh materi dan brief terkonfirmasi.",
  },
  {
    q: "Apakah disediakan pelatihan untuk mengelola website sendiri?",
    a: "Ya! Setiap paket layanan sudah mencakup sesi pelatihan online/video panduan lengkap dan garansi pendampingan operasional selama 90 hari.",
  },
  {
    q: "Bagaimana cara melakukan pembayaran dan verifikasi?",
    a: "Kami mendukung pembayaran Tunai (Cash) di kantor perwakilan Yogyakarta serta pembayaran digital QRIS (Demo / Transfer Bank) dengan verifikasi otomatis dan struk cetak resmi.",
  },
  {
    q: "Apakah biaya yang tertera sudah termasuk domain dan hosting?",
    a: "Betul! Paket website sudah mencakup domain (.com / .id / .my.id) dan cloud hosting berperforma tinggi selama 1 tahun pertama.",
  },
];

export default function MarketingHomePage() {
  const { settings } = useBusinessSettings();

  return (
    <div className="bg-[#faf9f5] text-stone-900">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-stone-200/80 bg-radial from-amber-100/40 via-white to-[#faf9f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Trust Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-900 text-xs font-bold tracking-wide">
                <Sparkles className="h-4 w-4 text-amber-600" />
                <span>Partner Transformasi Digital UMKM Terpercaya #1</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight leading-[1.12]">
                Evolusikan Bisnis UMKM Anda{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">
                  Menjadi Juara Digital
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {settings.description ||
                  "Solusi lengkap pembuatan website profesional, katalog pemesanan online tanpa potongan komisi, integrasi QRIS, dan manajemen pelanggan (CRM) yang dirancang khusus untuk pertumbuhan bisnis Anda."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  href="/services"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold shadow-md shadow-amber-500/25 hover:from-amber-600 hover:to-orange-700 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 active:scale-95"
                >
                  <span>Eksplor Layanan</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={`https://wa.me/${settings.whatsapp?.replace(/[^0-9]/g, "") || "6281234567890"}?text=Halo%20UMKM%20Bu%20Inem,%20saya%20ingin%20konsultasi%20layanan%20digital`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-stone-300 bg-white text-stone-800 font-bold hover:bg-stone-50 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  <Headphones className="h-4 w-4 text-emerald-600" />
                  <span>Konsultasi Gratis via WA</span>
                </a>
              </div>

              {/* Key Highlights Checkmarks */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-stone-700">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Garansi 90 Hari</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Harga Transparan</span>
                </div>
                <div className="flex items-center gap-2 justify-center lg:justify-start col-span-2 sm:col-span-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Dukungan Teknis Penuh</span>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-xl border border-stone-200/90 space-y-6">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-10 w-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-stone-900">Platform Bisnis 360°</h4>
                      <p className="text-[11px] text-stone-500">Ekosistem UMKM Terintegrasi</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                    ONLINE
                  </span>
                </div>

                {/* Metrics Highlights */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Total Prospek</span>
                    <p className="text-xl font-black text-stone-900">120+ Lead</p>
                    <span className="text-[10px] text-emerald-600 font-semibold">Terkualifikasi</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Kecepatan Transaksi</span>
                    <p className="text-xl font-black text-amber-950">&lt; 3 Detik</p>
                    <span className="text-[10px] text-amber-700 font-semibold">QRIS Dinamis</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-stone-700">Alur Pemesanan Instan:</p>
                  <div className="space-y-2 text-xs text-stone-600">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                      <span>1. Pilih Paket Layanan</span>
                      <span className="text-amber-600 font-bold">Katalog</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-100">
                      <span>2. Isi Data & Brief Kebutuhan</span>
                      <span className="text-amber-600 font-bold">Formulir</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-900 font-semibold">
                      <span>3. Konfirmasi & Bayar (QRIS/Cash)</span>
                      <span className="text-emerald-700 font-bold">Struk Resmi</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/order"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-stone-900 text-white text-xs font-extrabold hover:bg-stone-800 transition-colors"
                >
                  <span>Mulai Pesanan Pertama Anda</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="bg-white border-b border-stone-200/80 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-amber-600">500+</p>
              <p className="text-xs text-stone-500 font-medium">UMKM Telah Didampingi</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-stone-900">99.8%</p>
              <p className="text-xs text-stone-500 font-medium">Tingkat Kepuasan Klien</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-stone-900">&lt; 5 Hari</p>
              <p className="text-xs text-stone-500 font-medium">Rata-rata Waktu Delivery</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-amber-600">24/7</p>
              <p className="text-xs text-stone-500 font-medium">Monitoring & Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE SERVICES HIGHLIGHTS */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
            Katalog Layanan Digital
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Solusi Spesifik Sesuai Kebutuhan Bisnis Anda
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Pilih paket layanan digital terbukti yang telah membantu ratusan pemilik usaha mikro dan kecil meningkatkan daya saing secara terukur.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.slug}
                className="flex flex-col justify-between rounded-3xl bg-white border border-stone-200/90 p-6 shadow-sm hover:shadow-md hover:border-amber-400 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-stone-100 text-stone-700">
                      {srv.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-base text-stone-900 leading-snug group-hover:text-amber-600 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-2 leading-relaxed line-clamp-3">
                      {srv.shortDesc}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-stone-100">
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Fitur Unggulan:</p>
                    <ul className="space-y-1.5 text-xs text-stone-600">
                      {srv.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-stone-100 mt-6 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      {srv.basePrice > srv.price && (
                        <span className="block text-[11px] text-stone-400 line-through">
                          {formatRupiah(srv.basePrice)}
                        </span>
                      )}
                      <span className="text-lg font-black text-stone-900">
                        {formatRupiah(srv.price)}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {srv.duration}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/services/${srv.slug}`}
                      className="inline-flex items-center justify-center py-2 px-3 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
                    >
                      Detail
                    </Link>
                    <Link
                      href={`/order?service=${srv.slug}`}
                      className="inline-flex items-center justify-center py-2 px-3 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-colors"
                    >
                      Pesan
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-700 hover:text-amber-800"
          >
            <span>Lihat Semua Katalog Layanan Lengkap</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-16 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
                Keunggulan Layanan
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
                Mengapa Pelaku UMKM Memilih Kami?
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Kami memahami tantangan spesifik UMKM: keterbatasan anggaran, minimnya staf teknis, dan kebutuhan akan solusi praktis tanpa kerumitan instalasi berlebihan.
              </p>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-700 hover:underline"
                >
                  <span>Baca Cerita & Profil UMKM Bu Inem</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-2.5">
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900">Garansi & Perlindungan</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Jaminan bebas bug selama 90 hari kalender, pemeliharaan rutin, dan backup data otomatis mingguan.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-2.5">
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900">Kualitas Standar Industri</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Arsitektur modern Java 21 Spring Boot dan Next.js 16 yang super cepat, aman, dan ramah SEO mesin pencari.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-2.5">
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900">Pendampingan Onboarding</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Tidak ditinggalkan setelah selesai. Kami pandu staf Anda cara mengelola konten, melayani order, dan melihat laporan.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-stone-50 border border-stone-200/80 space-y-2.5">
                <div className="h-10 w-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Clock className="h-5 w-5" />
                </div>
                <h3 className="font-extrabold text-sm sm:text-base text-stone-900">Pelayanan Cepat & Akurat</h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Timeline pengerjaan yang terukur, transparan, dan laporan berkala langsung via WhatsApp atau dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
            Kata Klien Kami
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Kisah Sukses Mitra UMKM
          </h2>
          <p className="text-stone-600 text-sm">
            Pengalaman nyata para pelaku usaha setelah mentransformasi operasional pemesanan bersama kami.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200/90 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-base">★</span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100">
                <p className="font-extrabold text-sm text-stone-900">{t.name}</p>
                <p className="text-xs text-amber-700 font-semibold">{t.business}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ PREVIEW */}
      <section className="py-16 bg-white border-t border-stone-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Temukan jawaban cepat atas pertanyaan seputar layanan kami.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2"
              >
                <h4 className="font-extrabold text-sm text-stone-900">{faq.q}</h4>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:underline"
            >
              <span>Lihat Daftar Pertanyaan Lengkap (FAQ)</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA BANNER */}
      <section className="py-16 sm:py-20 bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-bold text-amber-100">
            <Sparkles className="h-4 w-4 text-amber-200" />
            <span>Siap Melangkah Bersama Kami?</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Mulai Transformasi Digital Bisnis Anda Hari Ini
          </h2>

          <p className="text-sm sm:text-base text-amber-100 max-w-2xl mx-auto leading-relaxed">
            Dapatkan konsultasi gratis, audit potensi digital UMKM Anda, dan penawaran paket harga khusus terbaik tanpa ikatan kontrak rumit.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/order"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white text-stone-900 font-black shadow-lg hover:bg-stone-100 transition-colors"
            >
              Pesan Layanan Sekarang
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-800/60 border border-white/20 text-white font-bold hover:bg-amber-800 transition-colors"
            >
              Hubungi Tim Konsultan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
