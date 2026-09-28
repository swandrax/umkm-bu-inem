"use client";

import React, { useState } from "react";
import {
  Settings,
  Store,
  Printer,
  Save,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";
import { BusinessSettings } from "@/types/settings";

function SettingsForm({
  initialSettings,
  onSave,
  isSaving,
}: {
  initialSettings: BusinessSettings;
  onSave: (settings: Partial<BusinessSettings>) => Promise<void>;
  isSaving: boolean;
}) {
  const [businessName, setBusinessName] = useState(initialSettings.businessName || "");
  const [tagline, setTagline] = useState(initialSettings.tagline || "");
  const [description, setDescription] = useState(initialSettings.description || "");
  const [address, setAddress] = useState(initialSettings.address || "");
  const [phone, setPhone] = useState(initialSettings.phone || "");
  const [whatsapp, setWhatsapp] = useState(initialSettings.whatsapp || "");
  const [email, setEmail] = useState(initialSettings.email || "");
  const [customerServiceEmail, setCustomerServiceEmail] = useState(
    initialSettings.customerServiceEmail || ""
  );
  const [website, setWebsite] = useState(initialSettings.website || "");
  const [receiptFooter, setReceiptFooter] = useState(initialSettings.receiptFooter || "");
  const [taxRate, setTaxRate] = useState(initialSettings.taxRate || 0);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedError, setSavedError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedError(null);
    try {
      await onSave({
        businessName,
        tagline,
        description,
        address,
        phone,
        whatsapp,
        email,
        customerServiceEmail,
        website,
        receiptFooter,
        taxRate,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan pengaturan.";
      setSavedError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedSuccess && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Pengaturan bisnis berhasil diperbarui dan tersimpan ke database!</span>
        </div>
      )}

      {savedError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold">
          <span>{savedError}</span>
        </div>
      )}

      {/* Identitas Bisnis & Brand */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Store className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-bold text-stone-900">Identitas UMKM & Profil Brand</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Nama Bisnis / Brand</label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Slogan / Tagline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Deskripsi Singkat Usaha</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">Alamat Lengkap Operasional</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Kontak & Layanan Pelanggan */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Phone className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-bold text-stone-900">Kontak & Dukungan Pelanggan</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">No. Telepon Toko</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">No. WhatsApp Bisnis</label>
            <input
              type="text"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Email Resmi Usaha</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Email Customer Service (CS)</label>
            <input
              type="email"
              value={customerServiceEmail}
              onChange={(e) => setCustomerServiceEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Website Resmi</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700">Tarif Pajak PPN (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Template Struk & Catatan Kaki */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Printer className="h-4 w-4 text-amber-500" />
          <h2 className="text-sm font-bold text-stone-900">Konfigurasi Struk Transaksi Thermal 58mm</h2>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-stone-700">
            Pesan Ucapan Terima Kasih (Footer Struk)
          </label>
          <textarea
            rows={2}
            value={receiptFooter}
            onChange={(e) => setReceiptFooter(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Submit Action */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-white text-xs sm:text-sm font-extrabold hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-50 cursor-pointer active:scale-95"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? "Menyimpan ke Server..." : "Simpan Perubahan Pengaturan"}</span>
        </button>
      </div>
    </form>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, isUpdating, isLoading } = useBusinessSettings();

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-amber-500" />
          <span>Pengaturan Bisnis & Identitas Platform</span>
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Konfigurasi identitas UMKM yang terintegrasi secara dinamis ke website publik, invoice, dan struk transaksi thermal.
        </p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-xs text-stone-400">Memuat konfigurasi bisnis...</div>
      ) : (
        <SettingsForm
          key={settings?.id || "default"}
          initialSettings={settings}
          onSave={async (newSettings) => {
            await updateSettings(newSettings);
          }}
          isSaving={isUpdating}
        />
      )}
    </div>
  );
}
