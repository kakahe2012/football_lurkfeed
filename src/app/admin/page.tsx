"use client";

import { useEffect, useState } from "react";
import { adminStyles } from "@/components/admin/admin-styles";
import { adminFetch } from "@/lib/admin/client";
import type { DashboardStats } from "@/lib/admin/analytics-stats";

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className={adminStyles.card}>
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tabular-nums text-gray-900">
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/dashboard")
      .then((r) => r.json())
      .then((d) => setStats(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">加载数据…</p>;
  }

  if (!stats?.persisted) {
    return (
      <div>
        <h1 className={adminStyles.pageTitle}>仪表盘</h1>
        <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-medium">未连接 Supabase 数据库</p>
          <p className="mt-2">
            生产环境请在 Vercel 配置{" "}
            <code className="rounded bg-white px-1">NEXT_PUBLIC_SUPABASE_URL</code>、
            <code className="rounded bg-white px-1">SUPABASE_SERVICE_ROLE_KEY</code>
            ，否则无法展示真实 UV/PV。前台种子文章仍可通过代码部署更新。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className={adminStyles.pageTitle}>仪表盘</h1>
      <p className={adminStyles.pageDesc}>全站真实访问与分享数据（UTC 日切）</p>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-medium text-gray-700">浏览量 PV / 访客 UV</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="总 PV"
            value={stats.total.pv.pv.toLocaleString()}
            sub={`UV ${stats.total.pv.uv.toLocaleString()}`}
          />
          <StatCard
            label="今日 PV"
            value={stats.today.pv.pv.toLocaleString()}
            sub={`UV ${stats.today.pv.uv.toLocaleString()}`}
          />
          <StatCard
            label="昨日 PV"
            value={stats.yesterday.pv.pv.toLocaleString()}
            sub={`UV ${stats.yesterday.pv.uv.toLocaleString()}`}
          />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-medium text-gray-700">
          分享 / Copy link 点击
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="总分享" value={stats.total.share.toLocaleString()} />
          <StatCard label="今日分享" value={stats.today.share.toLocaleString()} />
          <StatCard
            label="昨日分享"
            value={stats.yesterday.share.toLocaleString()}
          />
        </div>
      </section>
    </div>
  );
}
