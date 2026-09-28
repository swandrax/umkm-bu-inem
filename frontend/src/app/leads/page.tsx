"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  Plus,
  Search,
  Kanban,
  List,
  Phone,
  ArrowRight,
} from "lucide-react";
import {
  getLeads,
  createLead,
  updateLeadStatus,
} from "@/lib/api/leads";
import { formatRupiah } from "@/lib/utils";
import { Lead, LeadStatus, LeadRequest } from "@/types/crm";

const STATUS_COLUMNS: { key: LeadStatus; label: string; color: string; border: string }[] = [
  { key: "NEW", label: "Prospek Baru", color: "bg-blue-50 text-blue-800", border: "border-blue-200" },
  { key: "CONTACTED", label: "Dihubungi", color: "bg-purple-50 text-purple-800", border: "border-purple-200" },
  { key: "QUALIFIED", label: "Terkualifikasi", color: "bg-amber-50 text-amber-800", border: "border-amber-200" },
  { key: "PROPOSAL", label: "Penawaran / Proposal", color: "bg-indigo-50 text-indigo-800", border: "border-indigo-200" },
  { key: "NEGOTIATION", label: "Negosiasi", color: "bg-orange-50 text-orange-800", border: "border-orange-200" },
  { key: "WON", label: "Deal / Menang", color: "bg-emerald-50 text-emerald-800", border: "border-emerald-200" },
  { key: "LOST", label: "Batal / Hilang", color: "bg-stone-100 text-stone-600", border: "border-stone-200" },
];

export default function LeadsPage() {
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"KANBAN" | "TABLE">("KANBAN");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Lead Form State
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newService, setNewService] = useState("Website Company Profile");
  const [newValue, setNewValue] = useState(1500000);
  const [newNotes, setNewNotes] = useState("");

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["crm-leads", search],
    queryFn: () => getLeads(undefined, search || undefined),
  });

  const createMutation = useMutation({
    mutationFn: (req: LeadRequest) => createLead(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
      setIsModalOpen(false);
      setNewName("");
      setNewPhone("");
      setNewEmail("");
      setNewNotes("");
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateLeadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["crm-leads"] });
    },
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    createMutation.mutate({
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || undefined,
      serviceInterest: newService,
      estimatedValue: newValue,
      status: "NEW",
      notes: newNotes.trim() || undefined,
      source: "MANUAL_CRM",
    });
  };

  const getNextStatus = (current: LeadStatus): LeadStatus | null => {
    const order: LeadStatus[] = [
      "NEW",
      "CONTACTED",
      "QUALIFIED",
      "PROPOSAL",
      "NEGOTIATION",
      "WON",
    ];
    const idx = order.indexOf(current);
    if (idx >= 0 && idx < order.length - 1) {
      return order[idx + 1];
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2.5">
            <Users className="h-6 w-6 text-amber-500" />
            <span>Manajemen Prospek CRM (Leads Pipeline)</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Pantau dan tindak lanjuti peluang penjualan dari prospek baru hingga kesepakatan sukses.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* View Mode Toggle */}
          <div className="flex rounded-xl bg-stone-100 p-1 border border-stone-200">
            <button
              type="button"
              onClick={() => setViewMode("KANBAN")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "KANBAN"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-500 hover:text-stone-900"
              }`}
              title="Tampilan Pipeline Kanban"
            >
              <Kanban className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("TABLE")}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "TABLE"
                  ? "bg-white text-stone-900 shadow-2xs"
                  : "text-stone-500 hover:text-stone-900"
              }`}
              title="Tampilan Tabel"
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-xs font-extrabold hover:bg-amber-600 transition-colors shadow-xs cursor-pointer active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Prospek</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau telepon..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Total Prospek: <strong className="text-stone-900">{leads.length}</strong>
        </div>
      </div>

      {/* KANBAN / TABLE VIEW */}
      {isLoading ? (
        <div className="py-16 text-center text-xs text-stone-500 bg-white rounded-2xl border border-stone-200">
          Memuat data prospek CRM...
        </div>
      ) : viewMode === "KANBAN" ? (
        <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[550px]">
          {STATUS_COLUMNS.map((col) => {
            const columnLeads = leads.filter((l) => l.status === col.key);
            const totalValue = columnLeads.reduce(
              (acc, curr) => acc + (Number(curr.estimatedValue) || 0),
              0
            );

            return (
              <div
                key={col.key}
                className="w-72 shrink-0 rounded-2xl bg-stone-100/70 border border-stone-200 p-3 space-y-3 flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${col.color}`}
                    >
                      {columnLeads.length}
                    </span>
                    <h3 className="font-extrabold text-xs text-stone-800">{col.label}</h3>
                  </div>
                  {totalValue > 0 && (
                    <span className="text-[10px] font-mono font-bold text-stone-500">
                      {formatRupiah(totalValue)}
                    </span>
                  )}
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[650px] pr-1">
                  {columnLeads.length === 0 ? (
                    <div className="py-8 text-center text-[11px] text-stone-400 border border-dashed border-stone-200 rounded-xl">
                      Kosong
                    </div>
                  ) : (
                    columnLeads.map((lead) => {
                      const nextSt = getNextStatus(lead.status);
                      return (
                        <div
                          key={lead.id}
                          className="bg-white rounded-xl border border-stone-200 p-3.5 shadow-2xs hover:shadow-sm transition-all space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-extrabold text-xs text-stone-900 leading-snug">
                                {lead.name}
                              </p>
                              {lead.serviceInterest && (
                                <span className="inline-block text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded mt-0.5">
                                  {lead.serviceInterest}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-black text-stone-900 font-mono shrink-0">
                              {formatRupiah(lead.estimatedValue)}
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px] text-stone-500">
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3 w-3 text-stone-400 shrink-0" />
                              <a
                                href={`https://wa.me/${(lead.phone || "").replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-emerald-700 hover:underline"
                              >
                                {lead.phone}
                              </a>
                            </div>
                            {lead.notes && (
                              <p className="text-[10px] text-stone-600 line-clamp-2 italic pt-1 border-t border-stone-100">
                                &ldquo;{lead.notes}&rdquo;
                              </p>
                            )}
                          </div>

                          {/* Quick Stage Actions */}
                          <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1 text-[10px]">
                            {nextSt && (
                              <button
                                type="button"
                                onClick={() =>
                                  updateStatusMutation.mutate({
                                    id: lead.id,
                                    status: nextSt,
                                  })
                                }
                                className="inline-flex items-center gap-1 px-2 py-1 rounded bg-stone-100 hover:bg-amber-100 text-stone-700 font-bold cursor-pointer"
                              >
                                <span>Lanjut: {nextSt}</span>
                                <ArrowRight className="h-3 w-3" />
                              </button>
                            )}

                            {lead.status !== "WON" && lead.status !== "LOST" && (
                              <button
                                type="button"
                                onClick={() =>
                                  updateStatusMutation.mutate({
                                    id: lead.id,
                                    status: "WON",
                                  })
                                }
                                className="text-emerald-700 font-bold hover:underline"
                              >
                                Deal!
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-stone-200 overflow-x-auto shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Nama Prospek</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4">Layanan Diminati</th>
                <th className="py-3 px-4">Estimasi Nilai</th>
                <th className="py-3 px-4">Tahapan</th>
                <th className="py-3 px-4">Sumber</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-stone-900">{lead.name}</td>
                  <td className="py-3 px-4 text-stone-600">
                    <p>{lead.phone}</p>
                    {lead.email && <p className="text-stone-400 text-[10px]">{lead.email}</p>}
                  </td>
                  <td className="py-3 px-4 text-amber-800 font-medium">
                    {lead.serviceInterest || "-"}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">
                    {formatRupiah(lead.estimatedValue)}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        updateStatusMutation.mutate({ id: lead.id, status: e.target.value })
                      }
                      className="px-2 py-1 rounded border border-stone-200 bg-white text-[11px] font-bold"
                    >
                      {STATUS_COLUMNS.map((col) => (
                        <option key={col.key} value={col.key}>
                          {col.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 px-4 text-stone-400 text-[10px]">{lead.source}</td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={`https://wa.me/${(lead.phone || "").replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 font-bold hover:underline text-[11px]"
                    >
                      Hubungi WA
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CREATE LEAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-lg w-full p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-black text-base text-stone-900">
                Tambah Data Prospek Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xs font-bold"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Nama Prospek / Bisnis <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Contoh: Pak Hendra / Kopi Nusantara"
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    No. WhatsApp / HP <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="081234567890"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="email@bisnis.com"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Minat Layanan</label>
                  <select
                    value={newService}
                    onChange={(e) => setNewService(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Website Company Profile">Website Company Profile</option>
                    <option value="Website Katalog Online">Website Katalog Online</option>
                    <option value="Setup Sistem CRM">Setup Sistem CRM</option>
                    <option value="Integrasi QRIS">Integrasi QRIS</option>
                    <option value="Maintenance Sistem">Maintenance Sistem</option>
                    <option value="Aplikasi Kustom">Aplikasi Kustom</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Estimasi Nilai (Rp)</label>
                  <input
                    type="number"
                    value={newValue}
                    onChange={(e) => setNewValue(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Catatan Kebutuhan</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Catatan hasil diskusi atau kebutuhan spesifik klien..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-stone-900 focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 font-bold hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-white font-extrabold hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  {createMutation.isPending ? "Menyimpan..." : "Simpan Prospek"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
