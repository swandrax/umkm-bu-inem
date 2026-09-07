"use client";

import React, { useState, useEffect } from "react";
import { Menu, Clock, ShoppingBag } from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { useCartStore } from "@/stores/cart.store";
import { formatRupiah } from "@/lib/utils";

export default function Navbar() {
  const { toggleSidebar } = useUIStore();
  const { user } = useAuthStore();
  const { items, getGrandTotal } = useCartStore();

  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");

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
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-stone-200 bg-white/95 px-4 sm:px-6 backdrop-blur-md shadow-xs">
      {/* Left: Hamburger & Title / Date */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-xl p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors cursor-pointer"
          aria-label="Buka navigasi menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2.5 text-xs font-medium text-stone-600 bg-stone-50 px-3.5 py-1.5 rounded-full border border-stone-200">
          <Clock className="h-3.5 w-3.5 text-amber-500" />
          <span>{currentDate}</span>
          <span className="font-bold text-stone-900 font-mono">
            {currentTime}
          </span>
        </div>
      </div>

      {/* Right: Quick cart badge, connection status, Cashier indicator */}
      <div className="flex items-center gap-3">
        {/* Real-time server status */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden md:inline">API Spring Boot: Aktif</span>
        </div>

        {/* Quick Cart summary if in POS */}
        {itemCount > 0 && (
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <ShoppingBag className="h-3.5 w-3.5 text-amber-600" />
            <span>{itemCount} item</span>
            <span className="text-orange-700 font-bold">
              ({formatRupiah(getGrandTotal())})
            </span>
          </div>
        )}

        {/* User Info */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-stone-200">
          <div className="text-right">
            <p className="text-xs font-bold text-stone-900 leading-none">
              {user?.fullName || "Kasir"}
            </p>
            <p className="text-[10px] text-stone-500 leading-none mt-1 font-medium">
              {user?.role === "ADMIN" ? "Administrator" : "Kasir Aktif"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
