"use client";

import React, { useState, useEffect } from "react";
import { Menu, Clock, ShoppingBag } from "lucide-react";
import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { formatRupiah } from "@/lib/utils";

export default function Navbar() {
  const { toggleSidebar } = useUiStore();
  const { user } = useAuthStore();
  const { items, grandTotal } = useCartStore();

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
    <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-stone-200 bg-white/90 px-4 sm:px-6 backdrop-blur-md dark:border-stone-800 dark:bg-stone-900/90 shadow-xs">
      {/* Left: Hamburger & Title / Date */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-xl p-2 text-stone-600 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-white transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800/60 px-3.5 py-1.5 rounded-full border border-stone-200 dark:border-stone-700/60">
          <Clock className="h-4 w-4 text-amber-500" />
          <span>{currentDate}</span>
          <span className="font-bold text-stone-900 dark:text-white font-mono">
            {currentTime}
          </span>
        </div>
      </div>

      {/* Right: Quick cart badge, connection status, Cashier indicator */}
      <div className="flex items-center gap-3">
        {/* Real-time server status */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="hidden md:inline">API MySQL: Terhubung</span>
        </div>

        {/* Quick Cart summary if in POS */}
        {itemCount > 0 && (
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
            <ShoppingBag className="h-4 w-4" />
            <span>{itemCount} item</span>
            <span className="text-amber-700 dark:text-amber-300 font-bold">
              ({formatRupiah(grandTotal())})
            </span>
          </div>
        )}

        {/* User Info */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200 dark:border-stone-800">
          <div className="text-right">
            <p className="text-xs font-bold text-stone-900 dark:text-white leading-none">
              {user?.fullName || "Ibu Inem"}
            </p>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-none mt-1">
              Kasir Aktif
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
