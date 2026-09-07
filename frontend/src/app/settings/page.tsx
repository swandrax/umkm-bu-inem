"use client";

import React, { useState } from "react";
import {
  Settings,
  Store,
  Printer,
  Percent,
  Save,
  CheckCircle2,
  Phone,
  MapPin,
} from "lucide-react";

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("Jajanan Ibu Inem");
  const [storePhone, setStorePhone] = useState("0812-3456-7890");
  const [storeAddress, setStoreAddress] = useState("Jl. Merpati No. 12, Sleman, D.I. Yogyakarta");
  const [footerMessage, setFooterMessage] = useState("Matur Nuwun Sampun Blonjo wonten Bu Inem!");
  const [paperWidth, setPaperWidth] = useState<"58mm" | "80mm">("58mm");
  const [defaultTax, setDefaultTax] = useState(0);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-amber-500" />
          <span>Pengaturan Toko & POS</span>
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Konfigurasi identitas UMKM, template struk kasir thermal, dan preferensi operasional
        </p>
      </div>

      {savedSuccess && (
        <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Pengaturan berhasil disimpan ke sistem!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Identitas Toko */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Store className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-bold text-stone-800">Identitas UMKM</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Nama Usaha / Toko
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                No. Telepon / WhatsApp Toko
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                <input
                  type="text"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white pl-9 pr-3 py-2.5 text-xs sm:text-sm font-mono text-stone-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Alamat Toko
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-stone-400" />
                <textarea
                  rows={2}
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white pl-9 pr-3 py-2 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pengaturan Printer & Struk Kasir */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Printer className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-bold text-stone-800">Printer & Struk Thermal</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Ukuran Kertas Thermal
              </label>
              <select
                value={paperWidth}
                onChange={(e) => setPaperWidth(e.target.value as "58mm" | "80mm")}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500"
              >
                <option value="58mm">58mm (Standar Mini POS Thermal)</option>
                <option value="80mm">80mm (Printer Thermal Lebar)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Pesan Kaki Struk (Footer Note)
              </label>
              <input
                type="text"
                value={footerMessage}
                onChange={(e) => setFooterMessage(e.target.value)}
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Pajak & Biaya Standar */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Percent className="h-4 w-4 text-amber-500" />
            <h2 className="text-sm font-bold text-stone-800">Pajak Standar (%)</h2>
          </div>

          <div className="max-w-xs space-y-1">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              Pajak Resto / PB1 Standar
            </label>
            <div className="relative">
              <input
                type="number"
                value={defaultTax}
                onChange={(e) => setDefaultTax(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full rounded-xl border border-stone-300 bg-white p-2.5 text-xs sm:text-sm font-mono text-stone-900 focus:outline-none focus:border-amber-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                %
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all cursor-pointer"
        >
          <Save className="h-4 w-4" />
          <span>Simpan Semua Pengaturan</span>
        </button>
      </form>
    </div>
  );
}
