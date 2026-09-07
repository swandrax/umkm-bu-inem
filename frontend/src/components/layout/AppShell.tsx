"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./Navbar";
import { useAuthStore } from "@/stores/auth.store";
import ThermalReceiptModal from "@/components/pos/ThermalReceiptModal";

function subscribe() {
  return () => {};
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const isMounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const handleUnauthorized = () => {
      router.push("/login?expired=1");
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [router]);

  useEffect(() => {
    if (!isMounted) return;

    if (!isAuthenticated && !isLoginPage) {
      router.push("/login");
    } else if (isAuthenticated && isLoginPage) {
      router.push("/pos");
    } else if (
      isAuthenticated &&
      !isAdmin() &&
      ["/dashboard", "/products", "/categories", "/reports", "/users"].includes(
        pathname
      )
    ) {
      router.push("/pos");
    }
  }, [isMounted, isAuthenticated, isLoginPage, pathname, router, isAdmin]);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#faf9f5] text-stone-800">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-xs sm:text-sm font-bold text-stone-600">Memuat Sistem Kasir UMKM...</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <main className="min-h-screen bg-[#faf9f5] text-stone-900">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-[#faf9f5] text-stone-900 flex flex-col antialiased">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
        {children}
      </main>

      {/* Semantic accessible footer */}
      <footer className="w-full border-t border-stone-200/80 bg-white py-4 px-4 sm:px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Jajanan Ibu Inem. Sistem Point of Sales UMKM Modern.</p>
          <div className="flex items-center justify-center gap-3 text-[11px]">
            <span>v1.0.0 (Spring Boot 3 + Next.js)</span>
            <span className="text-stone-300" aria-hidden="true">•</span>
            <span className="text-emerald-700 font-bold">POS Operasional Aktif</span>
          </div>
        </div>
      </footer>

      {/* Global Thermal Receipt Modal */}
      <ThermalReceiptModal />
    </div>
  );
}
