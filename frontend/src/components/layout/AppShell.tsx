"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "./Navbar";
import PublicNavbar from "@/components/marketing/PublicNavbar";
import PublicFooter from "@/components/marketing/PublicFooter";
import { useAuthStore } from "@/stores/auth.store";
import ThermalReceiptModal from "@/components/pos/ThermalReceiptModal";

function subscribe() {
  return () => {};
}

// Routes that can be accessed publicly without authentication
const PUBLIC_PREFIXES = [
  "/services",
  "/about",
  "/portfolio",
  "/pricing",
  "/contact",
  "/faq",
  "/order",
  "/payment",
  "/receipt",
];

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
  const isPublicRoute =
    pathname === "/" ||
    PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  useEffect(() => {
    const handleUnauthorized = () => {
      router.push("/login?expired=1");
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => window.removeEventListener("unauthorized", handleUnauthorized);
  }, [router]);

  useEffect(() => {
    if (!isMounted) return;

    // If on protected admin route and not authenticated -> redirect to login
    if (!isAuthenticated && !isLoginPage && !isPublicRoute) {
      router.push("/login");
    } else if (isAuthenticated && isLoginPage) {
      router.push("/dashboard");
    } else if (
      isAuthenticated &&
      !isAdmin() &&
      ["/users"].includes(pathname)
    ) {
      router.push("/dashboard");
    }
  }, [isMounted, isAuthenticated, isLoginPage, isPublicRoute, pathname, router, isAdmin]);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#faf9f5] text-stone-800">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-xs sm:text-sm font-bold text-stone-600">Memuat Platform Digital UMKM...</p>
        </div>
      </div>
    );
  }

  // Login page has its own standalone container
  if (isLoginPage) {
    return <main className="min-h-screen bg-[#faf9f5] text-stone-900">{children}</main>;
  }

  // Public marketing & commerce routes
  if (isPublicRoute) {
    return (
      <div className="min-h-screen bg-[#faf9f5] text-stone-900 flex flex-col antialiased">
        <PublicNavbar />
        <main className="flex-1 w-full">{children}</main>
        <PublicFooter />
        <ThermalReceiptModal />
      </div>
    );
  }

  // Internal CRM & Admin Dashboard routes
  return (
    <div className="min-h-screen bg-[#faf9f5] text-stone-900 flex flex-col antialiased">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
        {children}
      </main>

      {/* Admin CRM Semantic Footer */}
      <footer className="w-full border-t border-stone-200/80 bg-white py-4 px-4 sm:px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} UMKM Bu Inem. Platform CRM & Operasional Digital.</p>
          <div className="flex items-center justify-center gap-3 text-[11px]">
            <span>Spring Boot 3 + Next.js</span>
            <span className="text-stone-300" aria-hidden="true">•</span>
            <span className="text-emerald-700 font-bold">CRM & Service Engine Online</span>
          </div>
        </div>
      </footer>

      {/* Global Thermal Receipt Modal */}
      <ThermalReceiptModal />
    </div>
  );
}
