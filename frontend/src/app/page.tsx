"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/pos");
    } else {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-stone-950 text-stone-100">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
    </div>
  );
}
