"use client";

import React, { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Printer,
  Home,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { getDigitalReceipt } from "@/lib/api/orders";
import { formatRupiah } from "@/lib/utils";
import { DigitalReceipt } from "@/types/order";

interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default function ReceiptPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const orderNumber = decodeURIComponent(resolvedParams.orderId);

  const { data: receipt, isLoading, isError } = useQuery<DigitalReceipt>({
    queryKey: ["receipt", orderNumber],
    queryFn: () => getDigitalReceipt(orderNumber),
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-xs text-stone-500 font-semibold">Menyiapkan struk transaksi...</p>
        </div>
      </div>
    );
  }

  if (isError || !receipt) {
    return (
      <div className="min-h-[70vh] bg-[#faf9f5] flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white p-8 rounded-3xl border border-stone-200 space-y-4">
          <FileText className="h-10 w-10 text-stone-400 mx-auto" />
          <h2 className="text-lg font-black text-stone-900">Struk Belum Tersedia</h2>
          <p className="text-xs text-stone-600">
            Struk resmi hanya diterbitkan untuk pesanan yang telah dikonfirmasi atau dibayar.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              href={`/payment/${encodeURIComponent(orderNumber)}`}
              className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold"
            >
              Halaman Pembayaran
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf9f5] min-h-screen py-8 sm:py-12">
      {/* Print Friendly Styling */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          header, footer, nav, .no-print {
            display: none !important;
          }
          .printable-receipt {
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 58mm !important;
            margin: 0 auto !important;
            padding: 4px !important;
            font-size: 11px !important;
            color: #000000 !important;
          }
        }
      `}</style>

      <div className="max-w-xl mx-auto px-4 space-y-6">
        {/* Navigation & Action Bar (Hidden during print) */}
        <div className="flex items-center justify-between no-print">
          <Link
            href={`/order/${encodeURIComponent(orderNumber)}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Status</span>
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-extrabold hover:bg-stone-800 transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Cetak Struk (Print / PDF)</span>
          </button>
        </div>

        {/* RECEIPT PAPER CONTAINER (58mm Thermal Friendly Layout) */}
        <div className="printable-receipt bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5 font-mono text-stone-800 text-xs">
          {/* HEADER: Business Identity */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-dashed border-stone-300">
            <h2 className="text-base sm:text-lg font-black tracking-tight text-stone-900 uppercase">
              {receipt.businessName || "UMKM BU INEM"}
            </h2>
            <p className="text-[11px] text-stone-600 leading-tight">
              {receipt.businessAddress || "Jl. Malioboro No. 45, D.I. Yogyakarta 55271"}
            </p>
            <p className="text-[11px] text-stone-600">
              Telp/WA: {receipt.businessPhone || "0812-3456-7890"}
            </p>
          </div>

          {/* META: Order & Customer Information */}
          <div className="space-y-1.5 text-[11px] text-stone-700 pb-3 border-b border-dashed border-stone-200">
            <div className="flex justify-between">
              <span>No. Struk:</span>
              <span className="font-bold">{receipt.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>No. Pesanan:</span>
              <span className="font-bold">{receipt.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span>Tanggal:</span>
              <span>{receipt.date || new Date().toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer:</span>
              <span className="font-bold truncate max-w-[180px]">{receipt.customerName}</span>
            </div>
            {receipt.customerPhone && (
              <div className="flex justify-between">
                <span>WhatsApp:</span>
                <span>{receipt.customerPhone}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Metode:</span>
              <span className="font-bold">
                {receipt.paymentMethod === "CASH" ? "TUNAI (CASH)" : "QRIS DEMO"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-extrabold text-emerald-800">
                {receipt.paymentStatus || "LUNAS"}
              </span>
            </div>
          </div>

          {/* ITEMS LIST */}
          <div className="space-y-2 pb-3 border-b-2 border-dashed border-stone-300">
            <div className="text-[10px] font-bold uppercase text-stone-400 flex justify-between">
              <span>Layanan / Item</span>
              <span>Subtotal</span>
            </div>

            {receipt.items?.map((item, idx) => (
              <div key={idx} className="space-y-0.5 text-xs">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold leading-tight">{item.name}</span>
                  <span className="font-bold shrink-0">{formatRupiah(item.lineTotal)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>{item.quantity} x {formatRupiah(item.unitPrice)}</span>
                  {item.discount > 0 && (
                    <span className="text-emerald-700 font-semibold">
                      Disc: -{formatRupiah(item.discount)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* FINANCIAL SUMMARY */}
          <div className="space-y-1.5 text-xs pt-1 pb-3 border-b border-dashed border-stone-200">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal:</span>
              <span>{formatRupiah(receipt.subtotal)}</span>
            </div>
            {receipt.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Total Diskon:</span>
                <span>-{formatRupiah(receipt.discount)}</span>
              </div>
            )}
            {receipt.tax > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Pajak:</span>
                <span>{formatRupiah(receipt.tax)}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-sm text-stone-900 pt-1.5 border-t border-stone-200">
              <span>TOTAL AKHIR:</span>
              <span>{formatRupiah(receipt.total)}</span>
            </div>

            {/* CASH SPECIFICS */}
            {receipt.paymentMethod === "CASH" && receipt.amountReceived !== undefined && (
              <>
                <div className="flex justify-between text-stone-700 pt-1">
                  <span>Uang Tunai:</span>
                  <span>{formatRupiah(receipt.amountReceived)}</span>
                </div>
                <div className="flex justify-between text-stone-900 font-bold">
                  <span>Kembalian:</span>
                  <span>{formatRupiah(receipt.changeAmount || 0)}</span>
                </div>
              </>
            )}
          </div>

          {/* FOOTER: Barcode & Thank You */}
          <div className="text-center space-y-3 pt-2">
            {/* Native Scalable Clean SVG Barcode */}
            <div className="flex flex-col items-center justify-center space-y-1">
              <svg
                viewBox="0 0 200 45"
                className="w-48 h-10 text-stone-900"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simulated standard Code128 bar pattern */}
                <rect x="5" y="0" width="3" height="35" />
                <rect x="11" y="0" width="2" height="35" />
                <rect x="16" y="0" width="5" height="35" />
                <rect x="24" y="0" width="2" height="35" />
                <rect x="29" y="0" width="4" height="35" />
                <rect x="36" y="0" width="3" height="35" />
                <rect x="42" y="0" width="6" height="35" />
                <rect x="51" y="0" width="2" height="35" />
                <rect x="56" y="0" width="4" height="35" />
                <rect x="63" y="0" width="3" height="35" />
                <rect x="69" y="0" width="5" height="35" />
                <rect x="77" y="0" width="2" height="35" />
                <rect x="82" y="0" width="6" height="35" />
                <rect x="91" y="0" width="4" height="35" />
                <rect x="98" y="0" width="2" height="35" />
                <rect x="103" y="0" width="5" height="35" />
                <rect x="111" y="0" width="3" height="35" />
                <rect x="117" y="0" width="6" height="35" />
                <rect x="126" y="0" width="2" height="35" />
                <rect x="131" y="0" width="4" height="35" />
                <rect x="138" y="0" width="3" height="35" />
                <rect x="144" y="0" width="5" height="35" />
                <rect x="152" y="0" width="3" height="35" />
                <rect x="158" y="0" width="6" height="35" />
                <rect x="167" y="0" width="2" height="35" />
                <rect x="172" y="0" width="4" height="35" />
                <rect x="179" y="0" width="3" height="35" />
                <rect x="185" y="0" width="5" height="35" />
                <rect x="193" y="0" width="2" height="35" />
              </svg>
              <span className="text-[10px] font-mono text-stone-500">
                {receipt.barcodeValue || `ORDER:${receipt.orderNumber}`}
              </span>
            </div>

            <p className="text-[11px] font-medium leading-relaxed text-stone-700">
              {receipt.receiptFooter ||
                "Terima kasih telah mempercayakan pertumbuhan bisnis Anda bersama UMKM Bu Inem."}
            </p>

            <p className="text-[10px] text-stone-500">
              Layanan Bantuan: {receipt.customerServiceEmail || "cs@bu-inem.com"}
            </p>
          </div>
        </div>

        {/* Bottom Actions (Hidden during print) */}
        <div className="text-center pt-2 no-print space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 hover:text-amber-800"
          >
            <Home className="h-4 w-4" />
            <span>Kembali ke Halaman Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
