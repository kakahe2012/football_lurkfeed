"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { adminStyles } from "@/components/admin/admin-styles";
import { FallbackImage } from "@/components/media/FallbackImage";
import { resolvePostCoverForFeed } from "@/lib/media/cover-image";
import { adminFetch } from "@/lib/admin/client";
import { buildStoryUrl, getSiteUrl } from "@/lib/utils";

interface PostRow {
  id: string;
  title: string;
  slug: string;
  content?: string;
  hero_image?: string;
  tags: string[];
  publish_status: string;
  published_at?: string;
  created_at: string;
  share_count: number;
  view_count: number;
  analytics: {
    page_views: number;
    unique_sessions: number;
    sources: { source: string; visits: number }[];
  };
}

/** Matches homepage FeedCard cover (resolveHeroImage + culture fallback). */
function FeedCoverThumb({
  post,
  title,
}: {
  post: PostRow;
  title: string;
}) {
  const coverSrc = resolvePostCoverForFeed({
    hero_image: post.hero_image || "",
    slug: post.slug,
  });
  return (
    <div
      className="relative h-12 w-20 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-100"
      title={title}
    >
      <FallbackImage
        src={coverSrc}
        fallbackSeed={post.slug}
        aspect="card"
        alt=""
        width={80}
        height={48}
        className="object-cover"
      />
    </div>
  );
}

export default function AdminArticlesPage() {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [persisted, setPersisted] = useState(true);
  const siteBase = getSiteUrl();

  const load = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch("/api/admin/articles?status=all");
    const data = await res.json();
    if (res.ok) {
      setPosts(data.posts || []);
      setPersisted(data.persisted !== false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, publish_status: string) => {
    await adminFetch(`/api/admin/articles/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ publish_status }),
    });
    load();
  };

  const copyLink = async (slug: string) => {
    const url = buildStoryUrl(slug, siteBase);
    await navigator.clipboard.writeText(url);
  };

  const topSource = (p: PostRow) =>
    p.analytics.sources[0]?.source || "—";

  if (loading) {
    return <p className="text-sm text-gray-500">加载文章…</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className={adminStyles.pageTitle}>文章管理</h1>
          <p className={adminStyles.pageDesc}>
            共 {posts.length} 篇
            {!persisted && "（未连接数据库，仅本地种子）"}
          </p>
        </div>
        <button type="button" onClick={load} className={adminStyles.btnSecondary}>
          刷新
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className={adminStyles.table}>
          <thead>
            <tr>
              <th className={`${adminStyles.tableHead} p-3 w-24`}>Feed 封面</th>
              <th className={`${adminStyles.tableHead} p-3`}>标题</th>
              <th className={`${adminStyles.tableHead} p-3`}>上架时间</th>
              <th className={`${adminStyles.tableHead} p-3`}>分享(真实)</th>
              <th className={`${adminStyles.tableHead} p-3`}>标签</th>
              <th className={`${adminStyles.tableHead} p-3`}>PV</th>
              <th className={`${adminStyles.tableHead} p-3`}>UV</th>
              <th className={`${adminStyles.tableHead} p-3`}>主要来源</th>
              <th className={`${adminStyles.tableHead} p-3`}>状态</th>
              <th className={`${adminStyles.tableHead} p-3`}>操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/80">
                <td className={`${adminStyles.tableCell} p-3`}>
                  <FeedCoverThumb
                    post={p}
                    title={p.title}
                  />
                </td>
                <td className={`${adminStyles.tableCell} max-w-[220px]`}>
                  <span className="line-clamp-2 font-medium text-gray-900">
                    {p.title}
                  </span>
                </td>
                <td className={`${adminStyles.tableCell} whitespace-nowrap text-gray-600`}>
                  {p.published_at
                    ? new Date(p.published_at).toLocaleString("zh-CN")
                    : "—"}
                </td>
                <td className={`${adminStyles.tableCell} tabular-nums`}>
                  {p.share_count}
                </td>
                <td className={adminStyles.tableCell}>
                  <span className="line-clamp-2 text-xs text-gray-600">
                    {(p.tags || []).slice(0, 4).join(", ") || "—"}
                  </span>
                </td>
                <td className={`${adminStyles.tableCell} tabular-nums`}>
                  {p.analytics.page_views}
                </td>
                <td className={`${adminStyles.tableCell} tabular-nums`}>
                  {p.analytics.unique_sessions}
                </td>
                <td className={`${adminStyles.tableCell} text-xs text-gray-600`}>
                  {topSource(p)}
                </td>
                <td className={adminStyles.tableCell}>
                  {p.publish_status === "published" ? (
                    <span className={adminStyles.badgeGreen}>已上架</span>
                  ) : (
                    <span className={adminStyles.badgeGray}>已下架</span>
                  )}
                </td>
                <td className={adminStyles.tableCell}>
                  <div className="flex flex-wrap gap-1.5">
                    {p.publish_status === "published" ? (
                      <button
                        type="button"
                        className="text-xs text-amber-700 hover:underline"
                        onClick={() => setStatus(p.id, "draft")}
                      >
                        下架
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="text-xs text-emerald-700 hover:underline"
                        onClick={() => setStatus(p.id, "published")}
                      >
                        上架
                      </button>
                    )}
                    <Link
                      href={`/admin/articles/${p.id}`}
                      className="text-xs text-blue-700 hover:underline"
                    >
                      改图
                    </Link>
                    <a
                      href={buildStoryUrl(p.slug, siteBase)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-700 hover:underline"
                    >
                      预览
                    </a>
                    <button
                      type="button"
                      className="text-xs text-gray-700 hover:underline"
                      onClick={() => copyLink(p.slug)}
                    >
                      链接
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!posts.length && (
          <p className="p-8 text-center text-sm text-gray-500">暂无文章</p>
        )}
      </div>
    </div>
  );
}
