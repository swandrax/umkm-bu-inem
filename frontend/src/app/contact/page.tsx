"use client";

import React, { useState } from "react";
import {
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Headphones,
  Clock,
} from "lucide-react";
import { createLead } from "@/lib/api/leads";
import { useBusinessSettings } from "@/hooks/useBusinessSettings";

export default function ContactPage() {
  const { settings } = useBusinessSettings();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    serviceInterest: "Website Company Profile",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await createLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        serviceInterest: formData.serviceInterest,
        notes: formData.notes.trim() || undefined,
        source: "WEBSITE_CONTACT",
      });

      setSuccessMessage(
        "Pesan dan permohonan konsultasi Anda berhasil dikirim! Tim konsultan kami akan menghubungi Anda melalui WhatsApp / Telepon."
      );
      setFormData({
        name: "",
        phone: "",
        email: "",
        serviceInterest: "Website Company Profile",
        notes: "",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal mengirimkan pesan.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#faf9f5] min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Respons Cepat & Ramah</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Hubungi Tim Konsultan UMKM
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Punya pertanyaan mengenai paket layanan, teknis sistem, atau ingin mendiskusikan kebutuhan khusus? Kami siap mendengar dan membantu Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="text-xl font-black text-stone-900">
                Informasi Kontak Resmi
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-xs uppercase tracking-wider text-stone-400">
                      Alamat Kantor
                    </span>
                    <p className="font-semibold text-stone-800 mt-0.5">
                      {settings.address || "Jl. Malioboro No. 45, D.I. Yogyakarta 55271"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-xs uppercase tracking-wider text-stone-400">
                      Telepon & WhatsApp
                    </span>
                    <p className="font-semibold text-stone-800 mt-0.5">
                      {settings.phone || "0812-3456-7890"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-xs uppercase tracking-wider text-stone-400">
                      Email Komunikasi
                    </span>
                    <p className="font-semibold text-stone-800 mt-0.5">
                      {settings.email || "halo@bu-inem.com"}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      CS: {settings.customerServiceEmail || "cs@bu-inem.com"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block text-xs uppercase tracking-wider text-stone-400">
                      Jam Kerja Operasional
                    </span>
                    <p className="font-semibold text-stone-800 mt-0.5">
                      Senin - Sabtu: 08.00 - 17.00 WIB
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Respon Darurat Server: 24 Jam
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA Button */}
              <div className="pt-4 border-t border-stone-100">
                <a
                  href={`https://wa.me/${settings.whatsapp?.replace(/[^0-9]/g, "") || "6281234567890"}?text=Halo%20UMKM%20Bu%20Inem,%20saya%20ingin%20konsultasi`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <Headphones className="h-4 w-4" />
                  <span>Chat Langsung via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact & Consultation Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h2 className="text-xl font-black text-stone-900">
                Kirim Permintaan Konsultasi / Penawaran
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Formulir ini terhubung langsung ke sistem CRM kami untuk penjadwalan tindak lanjut cepat.
              </p>
            </div>

            {successMessage && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <p className="font-semibold leading-relaxed">{successMessage}</p>
              </div>
            )}

            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="font-semibold leading-relaxed">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nama Lengkap / Pemilik Usaha <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Ibu Inem / Bpk. Hendra"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    No. WhatsApp / Telepon <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Alamat Email (Opsional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nama@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Layanan yang Diminati
                </label>
                <select
                  value={formData.serviceInterest}
                  onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                >
                  <option value="Website Company Profile">Website Company Profile UMKM</option>
                  <option value="Website Katalog Online">Website Katalog & Pemesanan Online</option>
                  <option value="Sistem CRM Pelanggan">Setup Sistem CRM & Pelanggan</option>
                  <option value="Integrasi QRIS & Kasir">Integrasi Pembayaran QRIS & Kasir</option>
                  <option value="Pemeliharaan Sistem">Layanan Pemeliharaan & Maintenance</option>
                  <option value="Aplikasi Kustom">Pengembangan Sistem / Aplikasi Kustom</option>
                  <option value="Lainnya">Lainnya / Konsultasi Bebas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Deskripsi Kebutuhan atau Catatan Usaha
                </label>
                <textarea
                  rows={4}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Ceritakan sedikit tentang jenis usaha Anda, target pasar, atau kendala yang ingin diselesaikan..."
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs sm:text-sm font-extrabold shadow-sm hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? "Mengirim Permintaan..." : "Kirim Formulir Konsultasi"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
