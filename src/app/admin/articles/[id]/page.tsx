"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminStyles } from "@/components/admin/admin-styles";
import { FallbackImage } from "@/components/media/FallbackImage";
import { adminFetch, adminUpload } from "@/lib/admin/client";
import { extractImageSrcs, replaceImageSrcInHtml } from "@/lib/admin/article-images";
import { resolvePostCoverForFeed } from "@/lib/media/cover-image";
import { stripLeadingContentImage } from "@/lib/sanitize";
import type { Post } from "@/types";

function ImageEditorRow({
  label,
  src,
  previewUrl,
  onUrlChange,
  onUpload,
  uploading,
}: {
  label: string;
  src: string;
  previewUrl: string;
  onUrlChange: (url: string) => void;
  onUpload: (file: File) => void;
  uploading: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <div className="mt-3 flex flex-wrap gap-4">
        <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-gray-400">
              无预览
            </span>
          )}
        </div>
        <div className="min-w-[200px] flex-1 space-y-2">
          <input
            type="url"
            className={adminStyles.input + " mt-0"}
            value={src}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder="https://..."
          />
          <label className="inline-block cursor-pointer">
            <span className={adminStyles.btnSecondary + " inline-block"}>
              {uploading ? "上传中…" : "上传本地图片"}
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onUpload(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default function AdminArticleEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [heroImage, setHeroImage] = useState("");
  const [content, setContent] = useState("");
  const [contentReplacements, setContentReplacements] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const originalImages = useMemo(
    () => (post ? extractImageSrcs(post.content) : []),
    [post]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await adminFetch(`/api/admin/articles/${id}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "加载失败");
      setLoading(false);
      return;
    }
    const p = data.post as Post;
    setPost(p);
    setHeroImage(p.hero_image || "");
    setContent(stripLeadingContentImage(p.content || ""));
    setContentReplacements({});
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const resolvedContent = useMemo(() => {
    let html = content;
    for (const [oldSrc, newSrc] of Object.entries(contentReplacements)) {
      if (newSrc) html = replaceImageSrcInHtml(html, oldSrc, newSrc);
    }
    return html;
  }, [content, contentReplacements]);

  const getContentSrc = (original: string) =>
    contentReplacements[original] ?? original;

  const setContentSrc = (original: string, url: string) => {
    setContentReplacements((prev) => ({ ...prev, [original]: url }));
  };

  const uploadFor = async (
    file: File,
    key: string,
    apply: (url: string) => void
  ) => {
    if (!post) return;
    setUploadingKey(key);
    setError(null);
    const { url, error: err } = await adminUpload(file, post.slug);
    setUploadingKey(null);
    if (err || !url) {
      setError(err || "上传失败");
      return;
    }
    apply(url);
  };

  const save = async () => {
    if (!post) return;
    setSaving(true);
    setMessage(null);
    setError(null);

    const res = await adminFetch(`/api/admin/articles/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        hero_image: heroImage,
        og_image: heroImage,
        content: resolvedContent,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "保存失败");
      return;
    }

    setMessage(
      data.message ||
        "已保存。请在本地执行 git add / commit / push 后 Vercel 才会更新生产环境。"
    );
    setPost(data.post || post);
    setContent(data.post?.content ?? resolvedContent);
    setContentReplacements({});
  };

  if (loading) {
    return <p className="text-sm text-gray-500">加载文章…</p>;
  }

  if (!post) {
    return (
      <div>
        <p className="text-sm text-red-600">{error || "文章不存在"}</p>
        <Link href="/admin/articles" className="mt-4 inline-block text-sm text-gray-600 hover:underline">
          ← 返回列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/articles"
            className="text-xs text-gray-500 hover:text-gray-800"
          >
            ← 文章管理
          </Link>
          <h1 className={`${adminStyles.pageTitle} mt-2`}>编辑图片</h1>
          <p className={adminStyles.pageDesc + " line-clamp-2"}>{post.title}</p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className={adminStyles.btnPrimary}
        >
          {saving ? "保存中…" : "保存到 seed-posts.ts"}
        </button>
      </div>

      {message && (
        <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {message}
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <section className={`${adminStyles.card} mt-6`}>
        <h2 className="text-sm font-semibold text-gray-900">封面图 hero_image</h2>
        <p className="mt-1 text-xs text-gray-500">
          与首页 Feed、文章页顶部大图同一字段；正文配图在下方单独编辑（不会重复显示封面）
        </p>
        {post && (
          <div className="mt-3 flex items-center gap-3 rounded-md border border-dashed border-gray-200 bg-gray-50 p-3">
            <span className="text-xs text-gray-500">Feed 预览</span>
            <div className="relative h-16 w-24 overflow-hidden rounded bg-gray-200">
              <FallbackImage
                src={resolvePostCoverForFeed({
                  hero_image: heroImage,
                  slug: post.slug,
                })}
                fallbackSeed={post.slug}
                aspect="card"
                alt=""
                width={96}
                height={64}
                className="object-cover"
              />
            </div>
          </div>
        )}
        <div className="mt-4">
          <ImageEditorRow
            label="封面 URL"
            src={heroImage}
            previewUrl={heroImage}
            onUrlChange={setHeroImage}
            onUpload={(f) => uploadFor(f, "hero", setHeroImage)}
            uploading={uploadingKey === "hero"}
          />
        </div>
      </section>

      <section className={`${adminStyles.card} mt-6`}>
        <h2 className="text-sm font-semibold text-gray-900">正文配图</h2>
        <p className="mt-1 text-xs text-gray-500">
          共 {originalImages.length} 张（仅替换地址，不改文字）
        </p>
        <div className="mt-4 space-y-4">
          {originalImages.length === 0 && (
            <p className="text-sm text-gray-500">正文中未检测到图片</p>
          )}
          {originalImages.map((src, i) => {
            const current = getContentSrc(src);
            const key = `body-${i}`;
            return (
              <ImageEditorRow
                key={src}
                label={`正文图 ${i + 1}`}
                src={current}
                previewUrl={current}
                onUrlChange={(url) => setContentSrc(src, url)}
                onUpload={(f) =>
                  uploadFor(f, key, (url) => setContentSrc(src, url))
                }
                uploading={uploadingKey === key}
              />
            );
          })}
        </div>
      </section>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className={adminStyles.btnPrimary}
        >
          {saving ? "保存中…" : "保存到 seed-posts.ts"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/articles")}
          className={adminStyles.btnSecondary}
        >
          取消
        </button>
      </div>
    </div>
  );
}
