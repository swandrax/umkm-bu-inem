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
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
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
    href: "/sales-history",
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
  const { isSidebarOpen, setSidebarOpen } = useUiStore();
  const admin = isAdmin();

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex w-72 flex-col bg-stone-900 text-stone-100 border-r border-stone-800 transition-transform duration-200 ease-in-out lg:translate-x-0 shadow-2xl",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand Header */}
        <div className="flex h-18 items-center justify-between px-6 border-b border-stone-800 bg-stone-950/40">
          <Link href="/pos" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 shadow-md shadow-amber-500/20 text-white font-bold">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-bold text-base leading-tight tracking-tight text-white flex items-center gap-1.5">
                Jajanan Bu Inem
              </h1>
              <span className="text-xs text-amber-400 font-medium tracking-wide uppercase">
                Modern POS Terminal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="mx-4 my-3 p-3.5 rounded-xl bg-stone-800/60 border border-stone-700/50 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center font-bold text-sm text-white shadow-xs">
            {user?.fullName?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-stone-200 truncate">
              {user?.fullName || "Kasir"}
            </p>
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase",
                user?.role === "ADMIN"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              )}
            >
              {user?.role || "CASHIER"}
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-stone-400">
            Menu Utama
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
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold shadow-md shadow-amber-500/20"
                    : "text-stone-300 hover:bg-stone-800/80 hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform duration-150",
                    isActive ? "text-white" : "text-stone-400"
                  )}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer Logout */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/20">
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors border border-transparent hover:border-rose-900/40"
          >
            <LogOut className="h-5 w-5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}
