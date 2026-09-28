"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Globe,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
  Laptop,
  Database,
  QrCode,
  Wrench,
  Layers,
} from "lucide-react";
import { getServices } from "@/lib/api/services";
import { formatRupiah } from "@/lib/utils";
import { ServiceProduct } from "@/types/service";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "website-company-profile": Globe,
  "website-toko-online-katalog": Laptop,
  "crm-customer-management-setup": Database,
  "integrasi-pembayaran-qris": QrCode,
  "pemeliharaan-maintenance-sistem": Wrench,
  "pengembangan-aplikasi-kustom": Layers,
};

export default function ServicesPage() {
  const [search, setSearch] = useState("");

  const { data: services = [], isLoading } = useQuery<ServiceProduct[]>({
    queryKey: ["services"],
    queryFn: () => getServices(true),
    staleTime: 1000 * 60 * 5,
  });

  const filteredServices = services.filter((srv) => {
    const matchSearch =
      srv.name.toLowerCase().includes(search.toLowerCase()) ||
      (srv.shortDescription && srv.shortDescription.toLowerCase().includes(search.toLowerCase()));
    return matchSearch;
  });

  return (
    <div className="bg-[#faf9f5] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Katalog Resmi Layanan Digital UMKM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
            Paket Layanan Digital & Komersial
          </h1>
          <p className="text-sm sm:text-base text-stone-600">
            Didesain khusus untuk memberdayakan operasional bisnis UMKM dari presensi online, pencatatan transaksi, hingga retensi pelanggan.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari layanan (misal: Website, CRM, QRIS, Maintenance)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-stone-200 text-stone-900 placeholder-stone-400 text-sm shadow-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-80 rounded-3xl bg-white border border-stone-200/80 p-6 animate-pulse space-y-4"
              >
                <div className="h-10 w-10 rounded-2xl bg-stone-100" />
                <div className="h-6 w-3/4 rounded bg-stone-100" />
                <div className="h-4 w-full rounded bg-stone-100" />
                <div className="h-4 w-2/3 rounded bg-stone-100" />
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
            <Tag className="h-10 w-10 text-stone-400 mx-auto" />
            <h3 className="font-bold text-stone-900">Layanan tidak ditemukan</h3>
            <p className="text-xs text-stone-500">Coba ubah kata kunci pencarian Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredServices.map((srv) => {
              const Icon = ICON_MAP[srv.slug] || Globe;
              const hasDiscount = srv.basePrice > srv.finalPrice;

              return (
                <div
                  key={srv.id}
                  className="flex flex-col justify-between rounded-3xl bg-white border border-stone-200 p-6 shadow-xs hover:shadow-md hover:border-amber-400 transition-all group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-12 w-12 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      {srv.featured && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-900">
                          Unggulan
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-extrabold text-lg text-stone-900 leading-snug group-hover:text-amber-600 transition-colors">
                        {srv.name}
                      </h3>
                      <p className="text-xs text-stone-500 mt-2 leading-relaxed line-clamp-3">
                        {srv.shortDescription}
                      </p>
                    </div>

                    {srv.features && srv.features.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-stone-100">
                        <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                          Paket Termasuk:
                        </p>
                        <ul className="space-y-1.5 text-xs text-stone-600">
                          {srv.features.slice(0, 4).map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-stone-100 mt-6 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        {hasDiscount && (
                          <span className="block text-[11px] text-stone-400 line-through">
                            {formatRupiah(srv.basePrice)}
                          </span>
                        )}
                        <span className="text-xl font-black text-stone-900">
                          {formatRupiah(srv.finalPrice)}
                        </span>
                      </div>
                      {srv.duration && (
                        <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {srv.duration}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/services/${srv.slug}`}
                        className="inline-flex items-center justify-center py-2.5 px-3 rounded-xl border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
                      >
                        Lihat Detail
                      </Link>
                      <Link
                        href={`/order?service=${srv.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold hover:from-amber-600 hover:to-orange-700 transition-all shadow-xs"
                      >
                        <span>Pesan</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
