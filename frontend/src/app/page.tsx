"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#faf9f5] text-stone-900">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-600 border-t-transparent" />
    </div>
  );
}
