"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  HelpCircle,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";

export default function PublicFooter() {
  const { settings } = useBusinessSettings();

  return (
    <footer className="w-full border-t border-stone-200 bg-white text-stone-700 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-black shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-black text-lg text-stone-900 tracking-tight">
                {settings.businessName || "UMKM Bu Inem"}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md">
              {settings.description ||
                "Platform layanan transformasi digital, katalog bisnis terintegrasi, dan pemberdayaan pelaku usaha mikro, kecil, dan menengah di Indonesia."}
            </p>

            <div className="space-y-2 text-xs text-stone-600 pt-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{settings.address || "Jl. Malioboro No. 45, D.I. Yogyakarta 55271"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Telp / WA: {settings.phone || "0812-3456-7890"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Email: {settings.email || "halo@bu-inem.com"}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HelpCircle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Customer Service: {settings.customerServiceEmail || "cs@bu-inem.com"}</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Services */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 mb-4">
              Layanan Utama
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/services/website-company-profile" className="hover:text-amber-600 transition-colors">
                  Website Company Profile
                </Link>
              </li>
              <li>
                <Link href="/services/website-toko-online-katalog" className="hover:text-amber-600 transition-colors">
                  Website Katalog Produk
                </Link>
              </li>
              <li>
                <Link href="/services/crm-customer-management-setup" className="hover:text-amber-600 transition-colors">
                  Setup CRM & Pelanggan
                </Link>
              </li>
              <li>
                <Link href="/services/integrasi-pembayaran-qris" className="hover:text-amber-600 transition-colors">
                  Integrasi QRIS & Kasir
                </Link>
              </li>
              <li>
                <Link href="/services/pemeliharaan-maintenance-sistem" className="hover:text-amber-600 transition-colors">
                  Maintenance & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 mb-4">
              Perusahaan
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/about" className="hover:text-amber-600 transition-colors">
                  Tentang UMKM Bu Inem
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-amber-600 transition-colors">
                  Studi Kasus & Portfolio
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-amber-600 transition-colors">
                  Daftar Paket & Harga
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-600 transition-colors">
                  Hubungi Tim Kami
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-amber-600 transition-colors">
                  Tanya Jawab (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Guarantee */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-stone-900 mb-4">
              Komitmen Layanan
            </h3>
            <div className="rounded-2xl bg-stone-50 border border-stone-200/80 p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>Garansi Bug-Free 90 Hari</span>
              </div>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Pendampingan teknis langsung, onboarding tim, dan konsultasi strategi adopsi teknologi untuk bisnis Anda.
              </p>
              <Link
                href="/order"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 hover:text-amber-800"
              >
                <span>Konsultasikan Kebutuhan</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>
            © {new Date().getFullYear()} {settings.businessName || "UMKM Bu Inem"}. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-stone-400">Light Theme Clean Design</span>
            <span>•</span>
            <Link href="/login" className="hover:text-amber-600 font-semibold">
              Portal Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
