"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Store, Lock, User, AlertCircle, ArrowRight, UserPlus, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";
import { loginSchema, registerSchema, LoginFormValues, RegisterFormValues } from "@/schemas/auth.schema";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, isLoading, error } = useAuthStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormValues) => {
    setSuccessMsg(null);
    const success = await login(data.username.trim(), data.password);
    if (success) {
      router.push("/pos");
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setSuccessMsg(null);
    const success = await register(data.fullName.trim(), data.username.trim(), data.password);
    if (success) {
      setSuccessMsg("Pendaftaran akun berhasil! Mengalihkan ke kasir...");
      setTimeout(() => {
        router.push("/pos");
      }, 700);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#faf9f5] p-4 text-stone-900">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 p-3 shadow-xl shadow-amber-500/20">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-stone-900 sm:text-3xl">
            Jajanan Ibu Inem
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-medium">
            Sistem Point of Sales & Manajemen Operasional UMKM
          </p>
        </div>

        {/* Auth Box */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-stone-200/50">
          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-2 p-1 bg-stone-100 rounded-2xl border border-stone-200 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-white text-stone-900 shadow-sm border border-stone-200/60"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Masuk Kasir
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setSuccessMsg(null);
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-white text-stone-900 shadow-sm border border-stone-200/60"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Daftar Akun Baru
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 font-medium">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === "login" ? (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Username
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    {...loginForm.register("username")}
                    placeholder="Masukkan username..."
                    className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200/50 transition-all"
                    autoFocus
                  />
                </div>
                {loginForm.formState.errors.username && (
                  <p className="text-xs text-rose-600 font-medium">
                    {loginForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    {...loginForm.register("password")}
                    placeholder="Masukkan password..."
                    className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200/50 transition-all"
                  />
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-xs text-rose-600 font-medium">
                    {loginForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Memverifikasi...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Kasir</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={async () => {
                    await login("kasir", "kasir123");
                    router.push("/pos");
                  }}
                  className="w-full py-2.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/70 text-amber-900 text-xs font-bold hover:bg-amber-100/80 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>⚡ Masuk Cepat Sebagai Kasir (Mode Dummy)</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    {...registerForm.register("fullName")}
                    placeholder="Contoh: Siti Inem"
                    className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200/50 transition-all"
                    autoFocus
                  />
                </div>
                {registerForm.formState.errors.fullName && (
                  <p className="text-xs text-rose-600 font-medium">
                    {registerForm.formState.errors.fullName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Username
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    {...registerForm.register("username")}
                    placeholder="Masukkan username..."
                    className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200/50 transition-all"
                  />
                </div>
                {registerForm.formState.errors.username && (
                  <p className="text-xs text-rose-600 font-medium">
                    {registerForm.formState.errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    {...registerForm.register("password")}
                    placeholder="Minimal 4 karakter..."
                    className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200/50 transition-all"
                  />
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-xs text-rose-600 font-medium">
                    {registerForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    {...registerForm.register("confirmPassword")}
                    placeholder="Ulangi password..."
                    className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200/50 transition-all"
                  />
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-xs text-rose-600 font-medium">
                    {registerForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Mendaftarkan akun...</span>
                  </>
                ) : (
                  <>
                    <span>Daftar & Masuk Kasir</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[11px] text-stone-500 font-medium">
          Backend: Java 21 Spring Boot 3 REST API &bull; MySQL Database
        </p>
      </div>
    </div>
  );
}
