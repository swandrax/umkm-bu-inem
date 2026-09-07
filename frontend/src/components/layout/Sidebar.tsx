"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  FolderTree,
  Users,
  UserCog,
  History,
  BarChart3,
  LogOut,
  X,
  Store,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { useUIStore } from "@/stores/ui.store";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Kasir (POS)",
    href: "/pos",
    icon: ShoppingCart,
  },
  {
    label: "Riwayat Transaksi",
    href: "/transactions",
    icon: History,
  },
  {
    label: "Data Pelanggan",
    href: "/customers",
    icon: Users,
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    adminOnly: true,
  },
  {
    label: "Master Produk",
    href: "/products",
    icon: Package,
    adminOnly: true,
  },
  {
    label: "Kategori Produk",
    href: "/categories",
    icon: FolderTree,
    adminOnly: true,
  },
  {
    label: "Laporan & Export",
    href: "/reports",
    icon: BarChart3,
    adminOnly: true,
  },
  {
    label: "Manajemen User",
    href: "/users",
    icon: UserCog,
    adminOnly: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isAdmin } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const admin = isAdmin();

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/30 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-white text-stone-800 border-r border-stone-200 transition-transform duration-200 ease-in-out lg:translate-x-0 shadow-lg lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-stone-200 bg-stone-50/70">
          <Link href="/pos" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 shadow-md shadow-amber-500/20 text-white font-bold">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight tracking-tight text-stone-900">
                Jajanan Bu Inem
              </h1>
              <span className="text-[11px] text-amber-600 font-semibold tracking-wider uppercase">
                Sistem Kasir UMKM
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 lg:hidden cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="mx-4 my-3 p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-sm text-white shadow-xs">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-bold text-stone-900 truncate">
              {user?.fullName || "Kasir"}
            </p>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border",
                user?.role === "ADMIN"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-emerald-50 text-emerald-700 border-emerald-200"
              )}
            >
              {user?.role || "CASHIER"}
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
            Menu Operasional
          </div>
          {NAV_ITEMS.map((item) => {
            if (item.adminOnly && !admin) return null;
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (typeof window !== "undefined" && window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-150",
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold shadow-md shadow-amber-500/20"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-150",
                    isActive ? "text-white" : "text-stone-400"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/50">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors border border-transparent hover:border-rose-200 cursor-pointer"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}
