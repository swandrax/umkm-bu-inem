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
import { useCartStore } from "@/stores/cart.store";
import { useCreateTransactionMutation } from "@/hooks/useTransactions";
import { formatRupiah } from "@/lib/utils";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (saleId: number) => void;
}

const PAYMENT_METHODS = [
  { id: "CASH", label: "Tunai (Cash)", icon: Banknote },
  { id: "QRIS", label: "QRIS", icon: QrCode },
  { id: "TRANSFER", label: "Transfer Bank", icon: Building2 },
  { id: "DEBIT", label: "Kartu Debit", icon: CreditCard },
  { id: "GOPAY", label: "GoPay", icon: Smartphone },
  { id: "OVO", label: "OVO", icon: Smartphone },
  { id: "DANA", label: "DANA", icon: Smartphone },
  { id: "SHOPEEPAY", label: "ShopeePay", icon: Smartphone },
];

export default function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const {
    items,
    customerId,
    discount,
    getTaxAmount,
    getGrandTotal,
    paymentMethod,
    cashAmount,
    setPaymentMethod,
    setCashAmount,
    clearCart,
  } = useCartStore();

  const [error, setError] = useState<string | null>(null);
  const createMutation = useCreateTransactionMutation();

  if (!isOpen) return null;

  const grandTotal = getGrandTotal();
  const change = Math.max(0, cashAmount - grandTotal);
  const isCash = paymentMethod === "CASH";
  const isValidAmount = !isCash || cashAmount >= grandTotal;

  const handleQuickCash = (amount: number) => {
    setCashAmount(amount);
  };

  const handleProcessPayment = async () => {
    setError(null);

    if (items.length === 0) {
      setError("Keranjang belanja kosong!");
      return;
    }

    if (isCash && cashAmount < grandTotal) {
      setError(`Nominal tunai kurang sebesar ${formatRupiah(grandTotal - cashAmount)}`);
      return;
    }

    try {
      const payload = {
        customerId,
        packageId: null,
        discount,
        tax: getTaxAmount(),
        paymentMethod: paymentMethod as any,
        cashAmount: isCash ? cashAmount : grandTotal,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      };

      const result = await createMutation.mutateAsync(payload);
      clearCart();
      onClose();
      onSuccess(result.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memproses pembayaran");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl bg-white border border-stone-200 shadow-2xl p-6 flex flex-col gap-5 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900">
              Proses Pembayaran Kasir
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Pilih metode transaksi dan konfirmasi pembayaran
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Total Display Banner */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Total yang Harus Dibayar
          </span>
          <p className="text-2xl sm:text-3xl font-black font-mono text-orange-700">
            {formatRupiah(grandTotal)}
          </p>
        </div>

        {/* Payment Methods Grid */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Metode Pembayaran
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PAYMENT_METHODS.map((m) => {
              const Icon = m.icon;
              const isSelected = paymentMethod === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? "border-amber-500 bg-amber-50/50 text-amber-800 font-bold shadow-xs ring-2 ring-amber-500/20"
                      : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:border-stone-300"
                  }`}
                >
                  <Icon className={`h-5 w-5 mb-1.5 ${isSelected ? "text-amber-600" : "text-stone-400"}`} />
                  <span className="text-[11px] leading-tight">{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cash Input & Quick Buttons if CASH */}
        {isCash && (
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Nominal Tunai Diterima (Rp)
              </label>
              <input
                type="number"
                value={cashAmount || ""}
                onChange={(e) => setCashAmount(Number(e.target.value) || 0)}
                placeholder="0"
                className="w-full rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-base font-bold font-mono text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* Quick Cash Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickCash(grandTotal)}
                className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Uang Pas
              </button>
              {[10000, 20000, 50000, 100000].map((nominal) => (
                <button
                  key={nominal}
                  type="button"
                  onClick={() => handleQuickCash(nominal)}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 bg-stone-50 text-xs font-bold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
                >
                  {formatRupiah(nominal)}
                </button>
              ))}
            </div>

            {/* Change Display */}
            <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center text-xs">
              <span className="font-bold text-stone-600 uppercase">Uang Kembalian:</span>
              <span
                className={`text-base font-bold font-mono ${
                  change >= 0 ? "text-emerald-700" : "text-rose-600"
                }`}
              >
                {formatRupiah(change)}
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm font-bold text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleProcessPayment}
            disabled={!isValidAmount || createMutation.isPending}
            className="flex-2 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-xs sm:text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50 cursor-pointer"
          >
            {createMutation.isPending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Selesaikan Pembayaran</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
