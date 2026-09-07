"use client";

import React, { useState } from "react";
import {
  X,
  CreditCard,
  Banknote,
  QrCode,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Building2,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import { PaymentMethod, Receipt, Sale } from "@/types/sales";
import { apiClient } from "@/lib/api-client";
import { formatRupiah } from "@/lib/utils";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (receipt: Receipt) => void;
}

const PAYMENT_METHODS: {
  id: PaymentMethod;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "cash" | "qris" | "transfer" | "ewallet" | "card";
}[] = [
  { id: "CASH", label: "Tunai (Cash)", icon: Banknote, category: "cash" },
  { id: "QRIS", label: "QRIS", icon: QrCode, category: "qris" },
  { id: "TRANSFER", label: "Transfer Bank", icon: Building2, category: "transfer" },
  { id: "DEBIT", label: "Kartu Debit", icon: CreditCard, category: "card" },
  { id: "GOPAY", label: "GoPay", icon: Smartphone, category: "ewallet" },
  { id: "OVO", label: "OVO", icon: Smartphone, category: "ewallet" },
  { id: "DANA", label: "DANA", icon: Smartphone, category: "ewallet" },
  { id: "SHOPEEPAY", label: "ShopeePay", icon: Smartphone, category: "ewallet" },
];

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const {
    items,
    customerId,
    packageId,
    discountAmount,
    taxAmount,
    grandTotal,
    changeAmount,
    paymentMethod,
    cashAmount,
    shipping,
    setPaymentMethod,
    setCashAmount,
    clearCart,
  } = useCartStore();

  const { openReceiptModal } = useUiStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const total = grandTotal();
  const change = changeAmount();

  const handleQuickCash = (amount: number) => {
    setCashAmount(amount);
  };

  const handleExactCash = () => {
    setCashAmount(total);
  };

  const handleCheckout = async () => {
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage("Keranjang belanja kosong");
      return;
    }

    if (paymentMethod === "CASH" && cashAmount < total) {
      setErrorMessage(`Uang tunai kurang sebesar ${formatRupiah(total - cashAmount)}`);
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        customerId,
        packageId,
        paymentMethod,
        cashAmount: paymentMethod === "CASH" ? cashAmount : total,
        discount: discountAmount(),
        tax: taxAmount(),
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        shipping: shipping || undefined,
      };

      const sale = await apiClient.post<Sale>("/sales", payload);

      // Fetch receipt data for 58mm preview
      const receipt = await apiClient.get<Receipt>(`/sales/${sale.id}/receipt`);

      clearCart();
      onClose();
      openReceiptModal(receipt);
      onSuccess(receipt);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses transaksi";
      setErrorMessage(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl p-6 flex flex-col gap-5 max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div>
            <h2 className="font-bold text-lg text-white">Konfirmasi Pembayaran</h2>
            <p className="text-xs text-stone-400">
              Pilih metode dan verifikasi jumlah pembayaran
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Total Display */}
        <div className="rounded-2xl bg-gradient-to-br from-stone-800/80 to-stone-950 p-4 border border-stone-700/60 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
              Total Pembayaran
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {formatRupiah(total)}
            </div>
          </div>
          <div className="text-right text-xs text-stone-400">
            <div>{items.length} jenis item</div>
            <div>PPN: {formatRupiah(taxAmount())}</div>
          </div>
        </div>

        {/* Payment Methods Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
            Metode Pembayaran
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PAYMENT_METHODS.map((pm) => {
              const Icon = pm.icon;
              const isSelected = paymentMethod === pm.id;
              return (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(pm.id);
                    if (pm.id === "CASH" && cashAmount === 0) {
                      setCashAmount(total);
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-amber-500 bg-amber-500/20 text-white font-bold shadow-md shadow-amber-500/20"
                      : "border-stone-800 bg-stone-800/60 text-stone-300 hover:bg-stone-800 hover:border-stone-700"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 mb-1.5 ${
                      isSelected ? "text-amber-400" : "text-stone-400"
                    }`}
                  />
                  <span className="text-xs">{pm.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Details Panel */}
        {paymentMethod === "CASH" ? (
          <div className="space-y-3 rounded-2xl bg-stone-800/40 p-4 border border-stone-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                Uang Diterima (Tunai)
              </label>
              <button
                type="button"
                onClick={handleExactCash}
                className="text-xs text-amber-400 hover:underline font-semibold cursor-pointer"
              >
                Uang Pas
              </button>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 font-bold text-sm">
                Rp
              </span>
              <input
                type="number"
                value={cashAmount || ""}
                onChange={(e) => setCashAmount(Number(e.target.value))}
                placeholder="0"
                className="w-full rounded-xl border border-stone-700 bg-stone-900 py-2.5 pl-12 pr-4 text-base font-mono font-bold text-white focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            {/* Quick Denominations */}
            <div className="flex flex-wrap gap-2">
              {[10000, 20000, 50000, 100000].map((nominal) => (
                <button
                  key={nominal}
                  type="button"
                  onClick={() => handleQuickCash(nominal)}
                  className="rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-200 hover:bg-stone-700 hover:border-amber-500/40 transition-colors cursor-pointer"
                >
                  +{formatRupiah(nominal)}
                </button>
              ))}
            </div>

            {/* Change Display */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-700/60 text-sm">
              <span className="text-stone-400">Kembalian:</span>
              <span
                className={`font-mono font-black text-base ${
                  cashAmount >= total ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {cashAmount >= total
                  ? formatRupiah(change)
                  : `Kurang ${formatRupiah(total - cashAmount)}`}
              </span>
            </div>
          </div>
        ) : paymentMethod === "QRIS" ? (
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-stone-800/40 border border-stone-800 text-center gap-2">
            <QrCode className="h-28 w-28 text-white p-2 bg-white/10 rounded-xl" />
            <p className="text-xs font-semibold text-stone-300">
              Tunjukkan QRIS ke pembeli &bull; Status LUNAS Otomatis
            </p>
            <p className="text-[11px] text-amber-400 font-mono">
              Total: {formatRupiah(total)}
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-stone-800/40 border border-stone-800 text-center space-y-1 text-xs text-stone-300">
            <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto mb-1" />
            <p className="font-semibold text-white">Pembayaran Non-Tunai ({paymentMethod})</p>
            <p className="text-stone-400">
              Pastikan dana telah diterima atau struk EDC telah berhasil dicetak.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-stone-700 bg-stone-800 px-5 py-3 text-sm font-semibold text-stone-300 hover:bg-stone-700 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isProcessing || (paymentMethod === "CASH" && cashAmount < total)}
            onClick={handleCheckout}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3 text-sm font-black text-white shadow-xl shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Memproses Checkout...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Bayar & Cetak Struk (F5)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
