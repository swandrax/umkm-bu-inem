"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SalesHistoryRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/transactions");
  }, [router]);

  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
    </div>
  );
}
