"use client";

import { useCallback, useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { adminStyles } from "./admin-styles";

type GateState = "checking" | "locked" | "open" | "misconfigured";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GateState>("checking");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const verify = useCallback(async (value: string) => {
    const res = await fetch("/api/admin/verify", {
      headers: { Authorization: `Bearer ${value}` },
    });
    if (res.status === 503) {
      setState("misconfigured");
      return false;
    }
    if (res.ok) {
      setState("open");
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const saved = localStorage.getItem("admin_token");
      if (!saved) {
        if (active) setState("locked");
        return;
      }
      const ok = await verify(saved);
      if (active && !ok) setState("locked");
    })();
    return () => {
      active = false;
    };
  }, [verify]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const ok = await verify(token.trim());
    if (ok) {
      localStorage.setItem("admin_token", token.trim());
    } else {
      setError("口令不正确，请重试。");
    }
    setSubmitting(false);
  };

  if (state === "open") return <>{children}</>;

  if (state === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fb] text-gray-400">
        正在校验登录状态…
      </div>
    );
  }

  if (state === "misconfigured") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f9fb] px-4">
        <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          <h1 className="text-base font-semibold">后台未配置访问口令</h1>
          <p className="mt-2 leading-relaxed">
            生产环境检测到 <code>ADMIN_SECRET</code> 仍为默认值，已自动锁定后台。
            请在 Vercel 环境变量中设置一个强随机的 <code>ADMIN_SECRET</code> 后重新部署。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f9fb] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-2 text-gray-900">
          <Lock size={18} className="text-emerald-600" />
          <h1 className="text-lg font-semibold">后台登录</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500">请输入管理口令（ADMIN_SECRET）</p>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="管理口令"
          autoFocus
          className={adminStyles.input}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting || !token.trim()}
          className={`${adminStyles.btnPrimary} mt-4 w-full`}
        >
          {submitting ? "登录中…" : "进入后台"}
        </button>
      </form>
    </div>
  );
}
