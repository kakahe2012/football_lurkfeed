"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, ExternalLink, Users } from "lucide-react";
import { EMOTION_LABELS } from "@/types";
import type { EmotionType, PublishStatus } from "@/types";
import {
  adminStyles,
  getAdminToken,
  EMOTION_LABELS_ZH,
} from "@/components/admin/admin-styles";

interface ArticleRow {
  id: string;
  title: string;
  slug: string;
  emotion_type: EmotionType;
  publish_status: PublishStatus;
  view_count: number;
  analytics: {
    page_views: number;
    unique_sessions: number;
    sources: { source: string; visits: number }[];
  };
}

const STATUS_ZH: Record<string, string> = {
  published: "已发布",
  pending: "待审核",
  draft: "草稿",
  rejected: "已拒绝",
};

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/articles?status=${status}`, {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.posts || []);
        setLoading(false);
      });
  }, [status]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className={adminStyles.pageTitle}>文章管理</h1>
          <p className={adminStyles.pageDesc}>浏览量、独立访客、流量来源</p>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={adminStyles.select}
        >
          <option value="all">全部状态</option>
          <option value="published">已发布</option>
          <option value="pending">待审核</option>
          <option value="draft">草稿</option>
          <option value="rejected">已拒绝</option>
        </select>
      </div>

      {loading ? (
        <p className="mt-8 text-gray-500">加载中…</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className={`${adminStyles.table} min-w-[800px]`}>
            <thead>
              <tr className={adminStyles.tableHead}>
                <th className="p-4 font-medium">标题</th>
                <th className="p-4 font-medium">情绪</th>
                <th className="p-4 font-medium">状态</th>
                <th className="p-4 font-medium">PV</th>
                <th className="p-4 font-medium">访客</th>
                <th className="p-4 font-medium">主要来源</th>
                <th className="p-4 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => {
                const em = EMOTION_LABELS[a.emotion_type];
                const topSource = a.analytics?.sources?.[0];
                return (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className={adminStyles.tableCell}>
                      <p className="line-clamp-2 font-medium text-gray-900">{a.title}</p>
                      <p className="mt-0.5 text-xs text-gray-400">/{a.slug}</p>
                    </td>
                    <td className={`${adminStyles.tableCell} whitespace-nowrap text-gray-600`}>
                      {em?.emoji} {EMOTION_LABELS_ZH[a.emotion_type]}
                    </td>
                    <td className={adminStyles.tableCell}>
                      <span
                        className={
                          a.publish_status === "published"
                            ? adminStyles.badgeGreen
                            : a.publish_status === "pending"
                              ? adminStyles.badgeAmber
                              : adminStyles.badgeGray
                        }
                      >
                        {STATUS_ZH[a.publish_status] || a.publish_status}
                      </span>
                    </td>
                    <td className={adminStyles.tableCell}>
                      <span className="inline-flex items-center gap-1 text-gray-700">
                        <Eye size={14} className="text-gray-400" />
                        {(a.analytics?.page_views ?? a.view_count).toLocaleString()}
                      </span>
                    </td>
                    <td className={adminStyles.tableCell}>
                      <span className="inline-flex items-center gap-1 text-gray-700">
                        <Users size={14} className="text-gray-400" />
                        {a.analytics?.unique_sessions?.toLocaleString() ?? "—"}
                      </span>
                    </td>
                    <td className={`${adminStyles.tableCell} text-gray-500`}>
                      {topSource ? (
                        <>
                          {topSource.source}{" "}
                          <span className="text-gray-400">({topSource.visits})</span>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className={adminStyles.tableCell}>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/articles/${a.id}`}
                          className="rounded-md border border-gray-300 px-3 py-1 text-xs hover:bg-gray-50"
                        >
                          详情
                        </Link>
                        {a.publish_status === "published" && (
                          <a
                            href={`/story/${a.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-md border border-gray-300 p-1 hover:bg-gray-50"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {articles.length === 0 && (
            <p className="p-8 text-center text-gray-500">暂无文章</p>
          )}
        </div>
      )}
    </div>
  );
}
