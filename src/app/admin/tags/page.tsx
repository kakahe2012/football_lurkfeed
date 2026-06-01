"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminStyles } from "@/components/admin/admin-styles";
import { CONTENT_TAGS } from "@/lib/data/tag-definitions";

export default function AdminTagsPage() {
  const [stats, setStats] = useState<{ slug: string; label: string; count: number }[]>([]);

  useEffect(() => {
    fetch("/api/tags")
      .then((r) => r.json())
      .then((d) => setStats(d.tags || []));
  }, []);

  return (
    <div>
      <h1 className={adminStyles.pageTitle}>标签管理</h1>
      <p className={adminStyles.pageDesc}>
        全站 {CONTENT_TAGS.length} 个预设标签。编辑文章时在「文章详情」中勾选。
        用户可在前台顶栏或文章页点击标签筛选。
      </p>

      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className={adminStyles.table}>
          <thead>
            <tr className={adminStyles.tableHead}>
              <th className="p-4 font-medium">标签</th>
              <th className="p-4 font-medium">Slug</th>
              <th className="p-4 font-medium">文章数</th>
              <th className="p-4 font-medium">前台链接</th>
            </tr>
          </thead>
          <tbody>
            {CONTENT_TAGS.map((t) => {
              const stat = stats.find((s) => s.slug === t.slug);
              return (
                <tr key={t.slug} className="hover:bg-gray-50">
                  <td className={adminStyles.tableCell}>{t.label}</td>
                  <td className={`${adminStyles.tableCell} font-mono text-xs text-gray-500`}>{t.slug}</td>
                  <td className={adminStyles.tableCell}>{stat?.count ?? 0}</td>
                  <td className={adminStyles.tableCell}>
                    <a
                      href={`/tag/${t.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-teal-700 hover:underline"
                    >
                      /tag/{t.slug}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        新增标签请编辑 <code className="text-gray-600">src/lib/data/tags.ts</code> 中的 CONTENT_TAGS 后重新部署。
      </p>
    </div>
  );
}
