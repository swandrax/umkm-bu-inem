"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
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
      <Sidebar />
      <div className="flex flex-1 flex-col transition-all duration-200 lg:pl-72">
        <Navbar />
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</main>
      </div>

      {/* Global Thermal Receipt Modal */}
      <ThermalReceiptModal />
    </div>
  );
}
