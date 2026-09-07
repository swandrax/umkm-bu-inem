"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Lock, User, AlertCircle, ArrowRight, UserPlus, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isLoading, error } = useAuthStore();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMsg(null);

    if (mode === "login") {
      if (!username.trim() || !password.trim()) {
        setLocalError("Username dan password wajib diisi");
        return;
      }

      const success = await login(username.trim(), password);
      if (success) {
        router.push("/pos");
      }
    } else {
      // Register mode
      if (!fullName.trim()) {
        setLocalError("Nama lengkap wajib diisi");
        return;
      }
      if (!username.trim() || username.trim().length < 3) {
        setLocalError("Username minimal 3 karakter");
        return;
      }
      if (!password || password.length < 4) {
        setLocalError("Password minimal 4 karakter");
        return;
      }
      if (password !== confirmPassword) {
        setLocalError("Konfirmasi password tidak cocok");
        return;
      }

      const success = await register(fullName.trim(), username.trim(), password);
      if (success) {
        setSuccessMsg("Pendaftaran berhasil! Mengalihkan ke kasir...");
        setTimeout(() => {
          router.push("/pos");
        }, 600);
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-950 p-4 text-stone-100">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-3 shadow-xl shadow-amber-500/20">
            <Store className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Jajanan Ibu Inem
          </h1>
          <p className="text-sm text-stone-400">
            Sistem Point of Sales & Manajemen UMKM
          </p>
        </div>

        {/* Auth Box */}
        <div className="rounded-3xl border border-stone-800 bg-stone-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 bg-stone-950/80 rounded-2xl border border-stone-800 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setLocalError(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === "login"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Masuk Kasir
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setLocalError(null);
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                mode === "register"
                  ? "bg-amber-500 text-stone-950 shadow-md"
                  : "text-stone-400 hover:text-white"
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(error || localError) && (
              <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{localError || error}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-500">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Siti Inem"
                    className="w-full rounded-xl border border-stone-700 bg-stone-800/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                    autoFocus
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username..."
                  className="w-full rounded-xl border border-stone-700 bg-stone-800/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  autoFocus={mode === "login"}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password..."
                  className="w-full rounded-xl border border-stone-700 bg-stone-800/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>

            {mode === "register" && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password..."
                    className="w-full rounded-xl border border-stone-700 bg-stone-800/80 py-2.5 pl-10 pr-4 text-sm text-white placeholder-stone-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{mode === "login" ? "Memverifikasi..." : "Mendaftarkan..."}</span>
                </>
              ) : (
                <>
                  <span>{mode === "login" ? "Masuk ke Kasir" : "Daftar & Masuk"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-stone-500">
          Backend: Java 21 Spring Boot REST API &bull; PostgreSQL Database
        </p>
      </div>
    </div>
  );
}
