"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminStyles } from "@/components/admin/admin-styles";
import { getAdminToken } from "@/components/admin/admin-styles";

export default function AdminSitePage() {
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/admin/config", {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    })
      .then((r) => r.json())
      .then(setConfig);
  }, []);

  const items = [
    { label: "站点 URL", key: "site_url", ok: Boolean(config?.site_url) },
    { label: "Supabase 数据库", key: "supabase", ok: config?.supabase },
    { label: "AI 千问", key: "ai", ok: (config?.ai as { configured?: boolean })?.configured },
    { label: "R2 图片存储", key: "r2", ok: config?.r2 },
    { label: "Google AdSense", key: "adsense", ok: config?.adsense },
    { label: "Google Analytics", key: "ga4", ok: config?.ga4 },
  ];

  return (
    <div>
      <h1 className={adminStyles.pageTitle}>站点设置</h1>
      <p className={adminStyles.pageDesc}>服务连接状态与前台管理入口</p>

      <div className={`mt-6 grid gap-3 sm:grid-cols-2 ${adminStyles.card}`}>
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2">
            <span className="text-sm text-gray-700">{item.label}</span>
            <span className={item.ok ? adminStyles.badgeGreen : adminStyles.badgeAmber}>
              {item.ok ? "已连接" : "未配置"}
            </span>
          </div>
        ))}
      </div>

      <section className={`mt-6 ${adminStyles.card}`}>
        <h2 className="text-sm font-medium text-gray-900">前台快捷入口</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">
              打开首页 Feed
            </a>
          </li>
          <li>
            <a href="/search" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">
              打开搜索页
            </a>
          </li>
          <li>
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-teal-700 hover:underline">
              隐私政策页
            </a>
          </li>
        </ul>
      </section>

      <section className={`mt-6 ${adminStyles.card}`}>
        <h2 className="text-sm font-medium text-gray-900">广告位说明</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
          <li>瀑布流：每 {process.env.NEXT_PUBLIC_FEED_AD_EVERY || "6"} 篇故事插入 1 个广告卡（NEXT_PUBLIC_FEED_AD_EVERY）</li>
          <li>侧栏：Trending 列表下方矩形广告（NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR）</li>
          <li>文章：阅读 50% 插入文中广告（NEXT_PUBLIC_ADSENSE_SLOT_INLINE）</li>
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          完整上线步骤见 <code>docs/上线清单.md</code>
        </p>
      </section>
    </div>
  );
}
