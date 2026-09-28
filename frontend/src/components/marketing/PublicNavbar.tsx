"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Phone,
  LayoutDashboard,
} from "lucide-react";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { useAuthStore } from "@/stores/auth.store";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Layanan Digital", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Paket & Harga", href: "/pricing" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Kontak", href: "/contact" },
  { label: "FAQ", href: "/faq" },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const { settings } = useBusinessSettings();
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/95 backdrop-blur-md transition-all shadow-xs">
        {/* Top Notice Bar */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 py-1.5 px-4 text-center text-xs font-semibold text-white">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] opacity-95">
              <Sparkles className="h-3.5 w-3.5 text-amber-200" aria-hidden="true" />
              Transformasi Digital & Ekosistem Layanan UMKM Indonesia
            </span>
            <div className="flex items-center justify-center sm:justify-end gap-4 w-full sm:w-auto text-[11px]">
              <a
                href={`https://wa.me/${settings.whatsapp?.replace(/[^0-9]/g, "") || "6281234567890"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1"
              >
                <Phone className="h-3 w-3" />
                <span>Konsultasi WA: {settings.phone || "0812-3456-7890"}</span>
              </a>
              <span className="opacity-40">•</span>
              <Link href="/order" className="hover:underline font-bold">
                Cek Status Pesanan
              </Link>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-4">
            {/* Logo & UMKM Identity */}
            <Link
              href="/"
              className="flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white font-extrabold shadow-md shadow-amber-500/25">
                <Sparkles className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-base sm:text-lg leading-tight tracking-tight text-stone-900">
                  {settings.businessName || "UMKM Bu Inem"}
                </span>
                <span className="text-[11px] text-amber-700 font-semibold tracking-wide">
                  {settings.tagline || "Solusi Digital & Layanan Bisnis"}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav
              className="hidden lg:flex items-center gap-1 xl:gap-2"
              aria-label="Navigasi Publik Utama"
            >
              {NAV_LINKS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-amber-500",
                      isActive
                        ? "bg-amber-50 text-amber-800 font-black border border-amber-200/80"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action CTA & Admin Portal Link */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-amber-600" />
                  <span>Dashboard CRM</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-100 hover:text-stone-900 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4 text-stone-400" />
                  <span>Masuk Staff</span>
                </Link>
              )}

              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs sm:text-sm font-extrabold shadow-sm hover:from-amber-600 hover:to-orange-700 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 active:scale-95"
              >
                <span>Pesan Layanan</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
                aria-label="Buka menu navigasi"
                aria-expanded={mobileMenuOpen}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 z-50 flex w-[300px] max-w-[85vw] flex-col bg-white border-l border-stone-200 shadow-2xl p-5">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white font-bold">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="font-extrabold text-sm text-stone-900">
                  {settings.businessName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:bg-stone-100"
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 space-y-1.5">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center px-4 py-3 min-h-[48px] rounded-xl text-sm font-bold transition-colors",
                    pathname === item.href
                      ? "bg-amber-500 text-white shadow-xs"
                      : "text-stone-700 hover:bg-stone-100"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="pt-4 border-t border-stone-100 space-y-2">
              <Link
                href="/order"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-white text-sm font-bold"
              >
                <span>Pesan Layanan Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex w-full items-center justify-center py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-semibold hover:bg-stone-50"
              >
                {isAuthenticated ? "Buka Dashboard Admin" : "Login Staff & Admin"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
