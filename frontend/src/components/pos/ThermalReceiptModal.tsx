"use client";

import React, { useRef } from "react";
import { X, Printer, CheckCircle2, QrCode } from "lucide-react";
import { useUiStore } from "@/store/uiStore";
import { formatRupiah, formatDate } from "@/lib/utils";

export default function ThermalReceiptModal() {
  const { activeReceipt, isReceiptModalOpen, closeReceiptModal } = useUiStore();
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isReceiptModalOpen || !activeReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-sm rounded-2xl bg-stone-900 border border-stone-800 shadow-2xl p-5 flex flex-col gap-4 max-h-[90vh]">
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2 text-amber-400">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <span className="font-bold text-sm text-stone-100">
              Pratinjau Struk Kasir (58mm)
            </span>
          </div>
          <button
            onClick={closeReceiptModal}
            className="rounded-lg p-1 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 58mm Receipt Canvas Preview */}
        <div className="overflow-y-auto flex justify-center py-2">
          <div
            id="thermal-receipt"
            ref={receiptRef}
            className="w-[280px] bg-white text-stone-900 font-mono text-[11px] leading-tight p-4 shadow-md rounded-xs border border-stone-200 select-all"
            style={{ fontFamily: "'Courier New', Courier, monospace" }}
          >
            {/* Store Header */}
            <div className="text-center space-y-0.5 mb-2">
              <h2 className="font-bold text-sm tracking-tight text-black">
                {activeReceipt.storeName}
              </h2>
              <p className="text-[10px] text-stone-600">{activeReceipt.storeAddress}</p>
              <p className="text-[10px] text-stone-600">Telp: {activeReceipt.storePhone}</p>
            </div>

            <div className="border-b border-dashed border-stone-400 my-2" />

            {/* Metadata */}
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>No. Nota:</span>
                <span className="font-bold">{activeReceipt.transactionNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Waktu:</span>
                <span>{formatDate(activeReceipt.transactionDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Kasir:</span>
                <span>{activeReceipt.cashierName}</span>
              </div>
              {activeReceipt.customerName && (
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span>{activeReceipt.customerName}</span>
                </div>
              )}
            </div>

            <div className="border-b border-dashed border-stone-400 my-2" />

            {/* Items */}
            <div className="space-y-1.5 text-[10px]">
              {activeReceipt.items?.map((item, idx) => (
                <div key={idx}>
                  <div className="font-medium text-stone-900">{item.productName}</div>
                  <div className="flex justify-between text-stone-600">
                    <span>
                      {item.quantity} x {formatRupiah(item.price)}
                    </span>
                    <span className="font-semibold text-stone-900">
                      {formatRupiah(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-b border-dashed border-stone-400 my-2" />

            {/* Summary */}
            <div className="space-y-1 text-[10px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatRupiah(activeReceipt.subtotal)}</span>
              </div>
              {activeReceipt.discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Diskon:</span>
                  <span>-{formatRupiah(activeReceipt.discount)}</span>
                </div>
              )}
              {activeReceipt.tax > 0 && (
                <div className="flex justify-between">
                  <span>PPN (10%):</span>
                  <span>{formatRupiah(activeReceipt.tax)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-xs pt-1 border-t border-stone-300">
                <span>TOTAL:</span>
                <span>{formatRupiah(activeReceipt.total)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Metode:</span>
                <span className="font-bold uppercase">{activeReceipt.paymentMethod}</span>
              </div>
              {activeReceipt.paymentMethod === "CASH" && (
                <>
                  <div className="flex justify-between">
                    <span>Tunai:</span>
                    <span>{formatRupiah(activeReceipt.cashAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Kembalian:</span>
                    <span>{formatRupiah(activeReceipt.changeAmount)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="border-b border-dashed border-stone-400 my-2" />

            {/* QR Code / Barcode Simulation */}
            <div className="flex flex-col items-center justify-center my-2 gap-1 text-[9px] text-stone-500">
              <QrCode className="h-16 w-16 text-stone-900" />
              <span className="tracking-widest">{activeReceipt.transactionNumber}</span>
            </div>

            <div className="border-b border-dashed border-stone-400 my-2" />

            {/* Footer Message */}
            <div className="text-center text-[9px] text-stone-600 whitespace-pre-line leading-relaxed">
              {activeReceipt.footerMessage}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2 border-t border-stone-800">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all active:scale-95"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Struk (58mm)</span>
          </button>
          <button
            onClick={closeReceiptModal}
            className="rounded-xl border border-stone-700 bg-stone-800 px-4 py-2.5 text-sm font-semibold text-stone-300 hover:bg-stone-700 hover:text-white transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
