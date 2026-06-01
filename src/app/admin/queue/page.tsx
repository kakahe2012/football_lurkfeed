"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { adminStyles, getAdminToken, EMOTION_LABELS_ZH } from "@/components/admin/admin-styles";

interface QueuePost {
  id: string;
  title: string;
  emotion_type: string;
  intro_hook?: string;
}

export default function AdminQueuePage() {
  const [posts, setPosts] = useState<QueuePost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/posts?status=pending", {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    });
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, publish_status: string) => {
    await fetch("/api/admin/posts", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getAdminToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, publish_status }),
    });
    load();
  };

  return (
    <div>
      <h1 className={adminStyles.pageTitle}>待审队列</h1>
      <p className={adminStyles.pageDesc}>审批 AI 生成的文章，通过后即发布到前台</p>

      {loading ? (
        <p className="mt-8 text-gray-500">加载中…</p>
      ) : posts.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
          暂无待审文章。请前往 AI 流水线生成内容。
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {posts.map((p) => (
            <li key={p.id} className={adminStyles.card}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className={adminStyles.badgeAmber}>待审核</span>
                  <span className="ml-2 text-xs text-gray-500">
                    {EMOTION_LABELS_ZH[p.emotion_type] || p.emotion_type}
                  </span>
                  <h2 className="mt-2 font-medium text-gray-900">{p.title}</h2>
                  {p.intro_hook && (
                    <p className="mt-1 text-sm text-gray-500">{p.intro_hook}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(p.id, "published")}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-500"
                  >
                    <Check size={16} /> 通过发布
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(p.id, "rejected")}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    <X size={16} /> 拒绝
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
