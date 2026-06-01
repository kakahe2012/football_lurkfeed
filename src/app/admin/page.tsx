"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, DollarSign, Eye, TrendingUp, Zap } from "lucide-react";
import { adminStyles, getAdminToken, EMOTION_LABELS_ZH } from "@/components/admin/admin-styles";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    views: 1240000,
    rpm: 4.2,
    ctr: 12.4,
    pagesPerSession: 3.8,
    pending: 0,
  });

  useEffect(() => {
    fetch("/api/admin/posts?status=pending", {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setStats((s) => ({ ...s, pending: data.posts?.length || 0 }));
      });
  }, []);

  const cards = [
    { label: "总浏览量", value: "124 万", icon: Eye },
    { label: "RPM 广告收益", value: `$${stats.rpm}`, icon: DollarSign },
    { label: "标题 CTR", value: `${stats.ctr}%`, icon: TrendingUp },
    { label: "会话深度", value: `${stats.pagesPerSession} 页`, icon: BarChart3 },
    { label: "待审文章", value: String(stats.pending), icon: Zap },
  ];

  const topStories = [
    { title: "别再装懂越位了", views: 125000, emotion: "easy_football" },
    { title: "足球巨星奢华生活内幕", views: 203000, emotion: "icons" },
    { title: "英格兰球迷为何每届世界杯都心碎", views: 112000, emotion: "heartbreak" },
  ];

  return (
    <div>
      <h1 className={adminStyles.pageTitle}>仪表盘</h1>
      <p className={adminStyles.pageDesc}>AI 内容工厂运营概览</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className={adminStyles.card}>
            <c.icon className="h-4 w-4 text-gray-400" />
            <p className="mt-3 text-2xl font-semibold text-gray-900">{c.value}</p>
            <p className="text-xs text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/admin/pipeline" className={adminStyles.btnPrimary}>
          启动 AI 流水线
        </Link>
        <Link href="/admin/queue" className={adminStyles.btnSecondary}>
          待审队列 ({stats.pending})
        </Link>
        <Link href="/admin/articles" className={adminStyles.btnSecondary}>
          文章管理
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-gray-900">热门文章</h2>
        <div className={`mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white`}>
          <table className={adminStyles.table}>
            <thead>
              <tr className={adminStyles.tableHead}>
                <th className="p-4 font-medium">标题</th>
                <th className="p-4 font-medium">情绪</th>
                <th className="p-4 font-medium">浏览量</th>
              </tr>
            </thead>
            <tbody>
              {topStories.map((s) => (
                <tr key={s.title}>
                  <td className={adminStyles.tableCell}>{s.title}</td>
                  <td className={`${adminStyles.tableCell} text-gray-500`}>
                    {EMOTION_LABELS_ZH[s.emotion] || s.emotion}
                  </td>
                  <td className={adminStyles.tableCell}>{s.views.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className={`mt-6 ${adminStyles.card}`}>
        <h2 className="text-sm font-medium text-gray-900">内容增长飞轮</h2>
        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
          热点发现 → AI 九步生成 → Feed 分发 → 广告收益 → 更多内容 → SEO 流量 → 情绪推荐强化
        </p>
      </section>
    </div>
  );
}
