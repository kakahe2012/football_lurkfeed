"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Eye, Share2, BookOpen, BarChart2, ExternalLink } from "lucide-react";
import type { Post, EmotionType } from "@/types";
import {
  adminStyles,
  getAdminToken,
  EMOTION_LABELS_ZH,
} from "@/components/admin/admin-styles";
import { CONTENT_TAGS } from "@/lib/data/tag-definitions";

interface PostStats {
  page_views: number;
  unique_sessions: number;
  shares: number;
  read_completes: number;
  avg_scroll_depth: number;
  sources: { source: string; visits: number }[];
  daily: { date: string; views: number }[];
}

const STATUS_ZH: Record<string, string> = {
  published: "已发布",
  pending: "待审核",
  draft: "草稿",
  rejected: "已拒绝",
};

export default function AdminArticleDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [stats, setStats] = useState<PostStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/articles/${id}`, {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setPost(data.post);
        setStats(data.stats);
        setLoading(false);
      });
  }, [id]);

  const patch = async (body: Record<string, unknown>) => {
    await fetch(`/api/admin/articles/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  const updateStatus = async (publish_status: string) => {
    await patch({ publish_status });
    window.location.reload();
  };

  const toggleTag = async (slug: string) => {
    if (!post) return;
    const tags = post.tags.includes(slug)
      ? post.tags.filter((t) => t !== slug)
      : [...post.tags, slug];
    setPost({ ...post, tags });
    await patch({ tags });
  };

  if (loading) return <p className="text-gray-500">加载中…</p>;
  if (!post) return <p className="text-gray-500">文章不存在</p>;

  const maxDaily = Math.max(...(stats?.daily.map((d) => d.views) || [1]), 1);

  return (
    <div>
      <Link
        href="/admin/articles"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={16} /> 返回列表
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-sm text-gray-500">
            {EMOTION_LABELS_ZH[post.emotion_type]} · {STATUS_ZH[post.publish_status] || post.publish_status}
          </span>
          <h1 className="mt-1 text-xl font-semibold text-gray-900">{post.title}</h1>
          <p className="mt-2 text-gray-500">{post.intro_hook}</p>
        </div>
        <div className="flex gap-2">
          {post.publish_status !== "published" && (
            <button
              type="button"
              onClick={() => updateStatus("published")}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-500"
            >
              发布
            </button>
          )}
          {post.publish_status === "published" && (
            <a
              href={`/story/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 ${adminStyles.btnSecondary}`}
            >
              <ExternalLink size={14} /> 前台预览
            </a>
          )}
        </div>
      </div>

      {stats && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { label: "页面浏览 (PV)", value: stats.page_views, icon: Eye },
              { label: "独立访客", value: stats.unique_sessions, icon: BarChart2 },
              { label: "分享次数", value: stats.shares, icon: Share2 },
              { label: "读完次数", value: stats.read_completes, icon: BookOpen },
              { label: "平均滚动深度", value: `${stats.avg_scroll_depth}%`, icon: BarChart2 },
            ].map((c) => (
              <div key={c.label} className={adminStyles.card}>
                <c.icon className="h-4 w-4 text-gray-400" />
                <p className="mt-2 text-2xl font-semibold">
                  {typeof c.value === "number" ? c.value.toLocaleString() : c.value}
                </p>
                <p className="text-xs text-gray-500">{c.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <section className={adminStyles.card}>
              <h2 className="text-sm font-medium text-gray-900">流量来源</h2>
              <ul className="mt-4 space-y-2">
                {stats.sources.map((s) => (
                  <li key={s.source} className="flex justify-between text-sm">
                    <span className="text-gray-700">{s.source}</span>
                    <span className="text-gray-500">
                      {s.visits.toLocaleString()} (
                      {stats.page_views ? Math.round((s.visits / stats.page_views) * 100) : 0}%)
                    </span>
                  </li>
                ))}
                {stats.sources.length === 0 && (
                  <li className="text-gray-400">暂无数据</li>
                )}
              </ul>
            </section>

            <section className={adminStyles.card}>
              <h2 className="text-sm font-medium text-gray-900">近 7 日 PV</h2>
              <div className="mt-4 flex h-28 items-end gap-2">
                {stats.daily.map((d) => (
                  <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-gray-800"
                      style={{
                        height: `${(d.views / maxDaily) * 100}%`,
                        minHeight: 4,
                      }}
                    />
                    <span className="text-[10px] text-gray-400">{d.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}

      <section className={`mt-6 ${adminStyles.card}`}>
        <h2 className="text-sm font-medium text-gray-900">正文预览</h2>
        <div
          className="prose prose-sm prose-gray mt-4 max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </section>

      <section className={`mt-4 ${adminStyles.card}`}>
        <h2 className="text-sm font-medium text-gray-900">分类标签</h2>
        <p className="mt-1 text-xs text-gray-500">点击切换，保存后前台可按标签筛选推荐</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {CONTENT_TAGS.map((t) => {
            const active = post.tags?.includes(t.slug);
            return (
              <button
                key={t.slug}
                type="button"
                onClick={() => toggleTag(t.slug)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  active
                    ? "bg-teal-700 text-white"
                    : "border border-gray-200 bg-gray-50 text-gray-600 hover:border-teal-200"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          链接：/story/{post.slug} · SEO：{post.seo_title}
        </p>
      </section>
    </div>
  );
}
