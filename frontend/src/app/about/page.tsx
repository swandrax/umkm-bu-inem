"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  Heart,
  Target,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";

export default function AboutPage() {
  const { settings } = useBusinessSettings();

  return (
    <div className="bg-[#faf9f5] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Mengenal Lebih Dekat</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Tentang {settings.businessName || "UMKM Bu Inem"}
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Berawal dari usaha kuliner dan jajanan lokal di Yogyakarta, kini bertransformasi menjadi katalisator pemberdayaan digital dan operasional bisnis bagi para pelaku UMKM Indonesia.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-stone-200/90 shadow-xs space-y-4">
            <h2 className="text-2xl font-black text-stone-900">
              Perjalanan Transformasi Kami
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              &ldquo;Jajanan Ibu Inem&rdquo; lahir dari kearifan lokal di Yogyakarta. Menghadapi era pasca-pandemi dan pergeseran perilaku konsumen menuju serba instan, kami merasakan langsung betapa menantangnya mengadopsi teknologi tanpa biaya langganan yang mencekik.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Oleh karena itu, kami membangun infrastruktur digital mandiri: sistem kasir yang stabil, katalog online tanpa komisi platform, metode pembayaran QRIS resmi, dan sistem pencatatan pelanggan (CRM) yang mudah digunakan siapa saja.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Kini, kami mendedikasikan teknologi dan pengalaman ini untuk membantu ribuan rekan UMKM lainnya melompat lebih tinggi.
            </p>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-amber-500 text-white space-y-2">
              <span className="text-3xl font-black">500+</span>
              <p className="text-xs font-semibold text-amber-100">Mitra UMKM Tumbuh Bersama</p>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-2">
              <span className="text-3xl font-black text-stone-900">90 Hari</span>
              <p className="text-xs text-stone-500 font-semibold">Jaminan Bebas Kendala</p>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-stone-200 space-y-2">
              <span className="text-3xl font-black text-stone-900">100%</span>
              <p className="text-xs text-stone-500 font-semibold">Milik Usaha Anda Mandiri</p>
            </div>
            <div className="p-6 rounded-3xl bg-stone-900 text-white space-y-2">
              <span className="text-3xl font-black text-amber-400">Jogja</span>
              <p className="text-xs text-stone-300 font-semibold">Pusat Layanan & Edukasi</p>
            </div>
          </div>
        </div>

        {/* Pillars / Values */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              Nilai Utama Kami
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Prinsip kerja yang kami pegang teguh di setiap layanan yang kami deliver.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-base text-stone-900">Praktis & Berdampak</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Kami tidak menjual fitur rumit yang tidak pernah digunakan. Setiap tombol dan fitur dibuat untuk efisiensi nyata operasional Anda.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Heart className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-base text-stone-900">Kemitraan Jangka Panjang</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Kami memposisikan diri sebagai partner bertumbuh, bukan sekadar vendor lepas. Edukasi dan pelatihan adalah bagian inti layanan.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-white border border-stone-200 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-extrabold text-base text-stone-900">Transparansi Total</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Biaya yang jelas di awal tanpa tagihan tersembunyi. Source code dan akses kepemilikan aset menjadi hak penuh Anda.
              </p>
            </div>
          </div>
        </div>

        {/* Office & Contact Box */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 space-y-6">
          <h3 className="text-xl font-black text-stone-900">Kantor & Perwakilan Operasional</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-stone-600">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-900 block mb-1">Alamat Kantor</span>
                <p>{settings.address || "Jl. Malioboro No. 45, D.I. Yogyakarta 55271"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-900 block mb-1">Layanan Telepon & WA</span>
                <p>{settings.phone || "0812-3456-7890"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-stone-900 block mb-1">Email Resmi</span>
                <p>{settings.email || "halo@bu-inem.com"}</p>
                <p className="text-stone-400 mt-0.5">CS: {settings.customerServiceEmail || "cs@bu-inem.com"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-extrabold shadow-sm hover:from-amber-600 hover:to-orange-700 transition-all"
          >
            <span>Jelajahi Paket Layanan Kami</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
