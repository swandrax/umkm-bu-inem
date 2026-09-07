"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Store,
  ShoppingCart,
  History,
  Users,
  LayoutDashboard,
  Package,
  FolderTree,
  BarChart3,
  UserCog,
  Settings,
  LogOut,
  Clock,
  ShoppingBag,
  Activity,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { formatRupiah, cn } from "@/lib/utils";

interface NavLinkItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const NAV_LINKS: NavLinkItem[] = [
  { label: "Kasir (POS)", href: "/pos", icon: ShoppingCart },
  { label: "Riwayat", href: "/transactions", icon: History },
  { label: "Pelanggan", href: "/customers", icon: Users },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, adminOnly: true },
  { label: "Produk", href: "/products", icon: Package, adminOnly: true },
  { label: "Kategori", href: "/categories", icon: FolderTree, adminOnly: true },
  { label: "Laporan", href: "/reports", icon: BarChart3, adminOnly: true },
  { label: "Users", href: "/users", icon: UserCog, adminOnly: true },
  { label: "Pengaturan", href: "/settings", icon: Settings, adminOnly: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuthStore();
  const { items, getGrandTotal } = useCartStore();
  const admin = isAdmin();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

  const drawerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setCurrentDate(
        now.toLocaleDateString("id-ID", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [mobileMenuOpen]);

  // Handle ESC key to close mobile menu
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        triggerRef.current?.focus();
      }
    },
    [mobileMenuOpen]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-stone-200/90 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            {/* Left: Branding */}
            <div className="flex items-center gap-3">
              {/* Mobile Hamburger Toggle (Tablet & Mobile < 1024px) */}
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="lg:hidden flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </button>

              {/* Brand Logo & Title */}
              <Link
                href="/pos"
                className="flex items-center gap-2.5 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none rounded-xl"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 shadow-md shadow-amber-500/20 text-white font-bold">
                  <Store className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="hidden min-[360px]:block">
                  <span className="block font-black text-sm sm:text-base leading-tight tracking-tight text-stone-900">
                    Jajanan Bu Inem
                  </span>
                  <span className="block text-[10px] sm:text-[11px] text-amber-600 font-semibold tracking-wider uppercase">
                    Sistem Kasir UMKM
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Navigation Links (≥ 1024px) */}
            <nav
              className="hidden lg:flex items-center gap-1 xl:gap-1.5"
              aria-label="Navigasi Utama Desktop"
            >
              {NAV_LINKS.map((item) => {
                if (item.adminOnly && !admin) return null;
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none",
                      isActive
                        ? "bg-amber-500 text-white shadow-sm shadow-amber-500/30"
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive ? "text-white" : "text-stone-400")} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Actions, Live Info & User Pill */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Date & Time pill (Hidden on smaller screens to prevent collision) */}
              <div className="hidden xl:flex items-center gap-2 text-xs font-medium text-stone-600 bg-stone-50 px-3 py-1.5 rounded-full border border-stone-200/80">
                <Clock className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                <span>{currentDate}</span>
                <span className="font-bold text-stone-900 font-mono">{currentTime}</span>
              </div>

              {/* API Status Badge */}
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="hidden lg:inline">API Spring Boot: Aktif</span>
              </div>

              {/* Quick Cart summary pill (Always visible on mobile & desktop if items > 0) */}
              {itemCount > 0 && (
                <Link
                  href="/pos"
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold hover:bg-amber-100 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none"
                  title="Buka Keranjang Kasir"
                >
                  <ShoppingBag className="h-4 w-4 text-amber-600" aria-hidden="true" />
                  <span className="font-mono bg-amber-200/80 px-1.5 py-0.5 rounded-md text-[11px]">
                    {itemCount}
                  </span>
                  <span className="hidden sm:inline text-orange-700 font-black">
                    {formatRupiah(getGrandTotal())}
                  </span>
                </Link>
              )}

              {/* User Identity & Logout Button */}
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-stone-900 leading-tight truncate max-w-[120px]">
                    {user?.fullName || "Kasir"}
                  </p>
                  <span className="inline-block text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                    {user?.role === "ADMIN" ? "Admin" : "Kasir"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="flex h-9 w-9 sm:h-auto sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-stone-50 p-2 sm:px-3 sm:py-1.5 text-xs font-bold text-stone-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none cursor-pointer"
                  title="Keluar Akun"
                  aria-label="Keluar Akun"
                >
                  <LogOut className="h-4 w-4 text-rose-500" aria-hidden="true" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile / Tablet Navigation Drawer (< 1024px) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu Navigasi Mobile">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer container */}
          <div
            ref={drawerRef}
            id="mobile-navigation"
            className="fixed inset-y-0 left-0 z-50 flex w-[280px] sm:w-[320px] max-w-[85vw] flex-col bg-white border-r border-stone-200 shadow-2xl animate-in slide-in-from-left duration-200 ease-out"
          >
            {/* Drawer Header */}
            <div className="flex h-16 items-center justify-between px-5 border-b border-stone-100 bg-stone-50/70">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white font-bold shadow-xs">
                  <Store className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-bold text-sm text-stone-900 leading-tight">Jajanan Bu Inem</p>
                  <span className="text-[10px] text-amber-600 font-semibold tracking-wider uppercase">
                    Sistem Kasir UMKM
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none cursor-pointer"
                aria-label="Tutup menu navigasi"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* User Profile Card */}
            <div className="p-4 mx-4 mt-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-amber-500 text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0">
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-stone-900 truncate">
                  {user?.fullName || "Kasir UMKM"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider border",
                      user?.role === "ADMIN"
                        ? "bg-amber-100 text-amber-800 border-amber-200"
                        : "bg-emerald-100 text-emerald-800 border-emerald-200"
                    )}
                  >
                    {user?.role === "ADMIN" ? "Administrator" : "Kasir Aktif"}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation items (Vertically stacked, min 48px touch target) */}
            <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5" aria-label="Menu Navigasi Mobile">
              <p className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Menu Operasional
              </p>
              {NAV_LINKS.map((item) => {
                if (item.adminOnly && !admin) return null;
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 min-h-[48px] text-sm font-bold transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-none",
                      isActive
                        ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                        : "text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                    )}
                  >
                    <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-stone-400")} aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer / System Status & Logout */}
            <div className="p-4 border-t border-stone-100 bg-stone-50/50 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                <span className="flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Spring Boot API: Online</span>
                </span>
                <span className="font-mono text-stone-700 font-bold">{currentTime}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 min-h-[48px] text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-rose-600" aria-hidden="true" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
