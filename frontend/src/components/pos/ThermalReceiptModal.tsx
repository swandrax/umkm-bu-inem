"use client";

import React, { useRef } from "react";
import { X, Printer, CheckCircle2, QrCode } from "lucide-react";
import { useUIStore } from "@/stores/ui.store";
import { useReceiptQuery } from "@/hooks/useTransactions";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function ThermalReceiptModal() {
  const { activeReceiptId, closeReceiptModal } = useUIStore();
  const { data: receipt, isLoading } = useReceiptQuery(activeReceiptId);
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!activeReceiptId) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-sm rounded-3xl bg-white border border-stone-200 shadow-2xl p-5 flex flex-col gap-4 max-h-[90vh]">
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span className="font-bold text-xs sm:text-sm text-stone-900">
              Pratinjau Struk Kasir (58mm)
            </span>
          </div>
          <button
            onClick={closeReceiptModal}
            className="rounded-xl p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 58mm Receipt Canvas Preview */}
        <div className="overflow-y-auto flex justify-center py-2">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-stone-400">Memuat data struk...</div>
          ) : receipt ? (
            <div
              id="thermal-receipt"
              ref={receiptRef}
              className="w-[280px] bg-white text-stone-900 font-mono text-[11px] leading-tight p-4 shadow-sm rounded-lg border border-stone-200 select-all"
              style={{ fontFamily: "'Courier New', Courier, monospace" }}
            >
              {/* Store Header */}
              <div className="text-center space-y-0.5 mb-2">
                <h2 className="font-bold text-sm tracking-tight text-black">
                  {receipt.storeName || "JAJANAN IBU INEM"}
                </h2>
                <p className="text-[10px] text-stone-600">{receipt.storeAddress || "Jl. Malioboro No. 45, Yogyakarta"}</p>
                <p className="text-[10px] text-stone-600">Telp: {receipt.storePhone || "0812-3456-7890"}</p>
              </div>

              <div className="border-b border-dashed border-stone-400 my-2" />

              {/* Metadata */}
              <div className="space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>No. Nota:</span>
                  <span className="font-bold">{receipt.transactionNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tanggal:</span>
                  <span>{formatDate(receipt.transactionDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kasir:</span>
                  <span>{receipt.cashierName}</span>
                </div>
                {receipt.customerName && (
                  <div className="flex justify-between">
                    <span>Pelanggan:</span>
                    <span>{receipt.customerName}</span>
                  </div>
                )}
              </div>

              <div className="border-b border-dashed border-stone-400 my-2" />

              {/* Item List */}
              <div className="space-y-1.5">
                {receipt.items?.map((item, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <div className="font-semibold truncate">{item.productName}</div>
                    <div className="flex justify-between text-stone-600">
                      <span>
                        {item.quantity} x {formatRupiah(item.price)}
                      </span>
                      <span className="font-bold text-black">{formatRupiah(item.subtotal)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-b border-dashed border-stone-400 my-2" />

              {/* Totals Calculation */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatRupiah(receipt.subtotal)}</span>
                </div>
                {receipt.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Diskon:</span>
                    <span>-{formatRupiah(receipt.discount)}</span>
                  </div>
                )}
                {receipt.tax > 0 && (
                  <div className="flex justify-between">
                    <span>Pajak (11%):</span>
                    <span>+{formatRupiah(receipt.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-stone-300">
                  <span>TOTAL:</span>
                  <span>{formatRupiah(receipt.total)}</span>
                </div>
                <div className="flex justify-between pt-1 text-[10px] text-stone-600">
                  <span>Metode:</span>
                  <span className="font-bold uppercase text-black">{receipt.paymentMethod}</span>
                </div>
                {receipt.paymentMethod === "CASH" && (
                  <>
                    <div className="flex justify-between text-[10px]">
                      <span>Tunai Diterima:</span>
                      <span>{formatRupiah(receipt.cashAmount)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold">
                      <span>Kembalian:</span>
                      <span>{formatRupiah(receipt.changeAmount)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="border-b border-dashed border-stone-400 my-2" />

              {/* QR Code Verification Simulation */}
              <div className="text-center py-1 space-y-1">
                <div className="flex justify-center">
                  <div className="p-1 border border-stone-300 rounded bg-white">
                    <QrCode className="h-12 w-12 text-stone-800" />
                  </div>
                </div>
                <p className="text-[9px] text-stone-500 font-mono">Verifikasi: {receipt.transactionNumber}</p>
              </div>

              {/* Footer Note */}
              <div className="text-center pt-1 text-[9px] text-stone-500 space-y-0.5">
                <p>{receipt.footerMessage || "Terima Kasih Telah Berbelanja!"}</p>
                <p>Simpan struk ini sebagai bukti transaksi yang sah</p>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-rose-500">Gagal mengambil data struk.</div>
          )}
        </div>

        {/* Print Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={closeReceiptModal}
            className="flex-1 py-2 rounded-xl text-xs font-bold border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex-2 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Struk Thermal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
