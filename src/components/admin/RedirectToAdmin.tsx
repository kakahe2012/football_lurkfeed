"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function RedirectToAdmin() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin");
  }, [router]);
  return (
    <p className="text-sm text-gray-500">页面已迁移，正在跳转…</p>
  );
}
