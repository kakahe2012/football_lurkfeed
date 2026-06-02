"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin/client";

type GateState = "checking" | "locked" | "open" | "misconfigured";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<GateState>("checking");

  const check = useCallback(async () => {
    const res = await adminFetch("/api/admin/verify");
    if (res.status === 503) {
      setState("misconfigured");
      return;
    }
    if (res.ok) {
      setState("open");
      return;
    }
    setState("locked");
    router.replace(`/admin/login?next=${encodeURIComponent(pathname)}`);
  }, [pathname, router]);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    check();
  }, [pathname, check]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (state === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-gray-500">
        验证登录…
      </div>
    );
  }

  if (state === "misconfigured") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6">
        <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <p className="font-medium">后台未正确配置</p>
          <p className="mt-2 text-amber-800">
            请在 Vercel 设置 <code className="rounded bg-white px-1">ADMIN_SECRET</code>、
            <code className="rounded bg-white px-1">ADMIN_USERNAME</code>、
            <code className="rounded bg-white px-1">ADMIN_PASSWORD</code> 后重新部署。
          </p>
        </div>
      </div>
    );
  }

  if (state === "locked") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-sm text-gray-500">
        跳转登录…
      </div>
    );
  }

  return <>{children}</>;
}
