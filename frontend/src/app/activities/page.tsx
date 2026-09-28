"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  Clock,
  User,
  ShoppingBag,
  CreditCard,
  FileText,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { getRecentActivities } from "@/lib/api/crm";
import { CrmActivity } from "@/types/crm";

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LEAD_CREATED: UserCheck,
  ORDER_CREATED: ShoppingBag,
  PAYMENT_CONFIRMED: CheckCircle2,
  PAYMENT_SIMULATION: CreditCard,
  NOTE_ADDED: FileText,
};

export default function ActivitiesPage() {
  const { data: activities = [], isLoading } = useQuery<CrmActivity[]>({
    queryKey: ["crm-activities"],
    queryFn: () => getRecentActivities(50),
    refetchInterval: 10000, // 10s auto-refresh
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2.5">
          <Activity className="h-6 w-6 text-amber-500" />
          <span>Timeline Aktivitas CRM & Transaksi</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Log kronologis interaksi prospek, pergerakan pesanan, dan verifikasi pembayaran.
        </p>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-stone-400">Memuat log aktivitas...</div>
      ) : activities.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <Activity className="h-10 w-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-stone-800">Belum ada aktivitas baru tercatat</h3>
          <p className="text-xs text-stone-500">
            Aktivitas akan muncul otomatis ketika prospek masuk atau pesanan dibuat.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs">
          <div className="relative border-l-2 border-stone-200 ml-4 space-y-8 py-2">
            {activities.map((act) => {
              const Icon = TYPE_ICONS[act.activityType] || Activity;
              return (
                <div key={act.id} className="relative pl-6 sm:pl-8 group">
                  {/* Timeline bullet */}
                  <div className="absolute -left-[17px] top-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-amber-500 shadow-2xs group-hover:scale-110 transition-transform">
                    <Icon className="h-4 w-4 text-amber-600" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm text-stone-900">
                        {act.title}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                        {act.activityType}
                      </span>
                    </div>

                    {act.description && (
                      <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                        {act.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] text-stone-400 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(act.createdAt).toLocaleString("id-ID")}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>Oleh: {act.actor}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
