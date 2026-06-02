"use client";

import { useEffect, useRef, useState } from "react";
import { FolderUp } from "lucide-react";
import { adminStyles } from "@/components/admin/admin-styles";
import { adminFetch } from "@/lib/admin/client";
import { buildStoryUrl, getSiteUrl } from "@/lib/utils";

interface ImportResult {
  filename: string;
  ok: boolean;
  slug?: string;
  title?: string;
  error?: string;
}

const IMAGE_RE = /\.(png|jpe?g|gif|webp|svg)$/i;
const HTML_RE = /\.(html?|htm)$/i;

async function readFolder(fileList: FileList): Promise<{
  items: { filename: string; html: string }[];
  assets: Record<string, string>;
}> {
  const files = Array.from(fileList);
  const assets: Record<string, string> = {};
  const items: { filename: string; html: string }[] = [];

  for (const f of files) {
    const path = (f.webkitRelativePath || f.name).replace(/\\/g, "/");
    if (HTML_RE.test(f.name)) {
      const html = await f.text();
      items.push({ filename: path, html });
    } else if (IMAGE_RE.test(f.name)) {
      const buf = await f.arrayBuffer();
      const b64 = btoa(
        new Uint8Array(buf).reduce((s, b) => s + String.fromCharCode(b), "")
      );
      const mime =
        f.type ||
        (f.name.endsWith(".png")
          ? "image/png"
          : f.name.endsWith(".webp")
            ? "image/webp"
            : "image/jpeg");
      assets[path] = `data:${mime};base64,${b64}`;
    }
  }

  return { items, assets };
}

export default function AdminPublishPage() {
  const [fileCount, setFileCount] = useState(0);
  const [htmlCount, setHtmlCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[] | null>(null);
  const folderRef = useRef<HTMLInputElement>(null);
  const pendingRef = useRef<{
    items: { filename: string; html: string }[];
    assets: Record<string, string>;
  } | null>(null);

  useEffect(() => {
    const el = folderRef.current;
    if (el) {
      el.setAttribute("webkitdirectory", "");
      el.setAttribute("directory", "");
    }
  }, []);

  const onFolder = async (list: FileList | null) => {
    if (!list?.length) return;
    const { items, assets } = await readFolder(list);
    pendingRef.current = { items, assets };
    setFileCount(list.length);
    setHtmlCount(items.length);
    setImageCount(Object.keys(assets).length);
    setResults(null);
  };

  const publish = async () => {
    const batch = pendingRef.current;
    if (!batch?.items.length) return;
    setImporting(true);
    setResults(null);
    try {
      const res = await adminFetch("/api/admin/import", {
        method: "POST",
        body: JSON.stringify({
          items: batch.items,
          assets: batch.assets,
          status: "published",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResults([
          { filename: "—", ok: false, error: data.error || "上架失败" },
        ]);
      } else {
        setResults(data.results || []);
        if (!data.persisted) {
          setResults((prev) => [
            {
              filename: "提示",
              ok: false,
              error:
                "未连接 Supabase，文章未写入数据库。请配置环境变量后重试。",
            },
            ...(prev || []),
          ]);
        }
      }
    } finally {
      setImporting(false);
    }
  };

  const siteBase = getSiteUrl();

  return (
    <div className="max-w-2xl">
      <h1 className={adminStyles.pageTitle}>文章上线</h1>
      <p className={adminStyles.pageDesc}>
        选择包含 HTML 文章与配图子文件夹的目录，解析后直接上架。配图会尝试上传到
        R2（若已配置），避免前台图片丢失。
      </p>

      <div className={`${adminStyles.card} mt-8`}>
        <label className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-12 transition hover:border-gray-300 hover:bg-gray-100/80">
          <FolderUp className="text-gray-400" size={32} />
          <span className="mt-3 text-sm font-medium text-gray-700">
            选择目标文件夹
          </span>
          <span className="mt-1 text-xs text-gray-500">
            支持 .html / .htm 及文件夹内 .jpg .png .webp 等配图
          </span>
          <input
            ref={folderRef}
            type="file"
            multiple
            className="sr-only"
            onChange={(e) => onFolder(e.target.files)}
          />
        </label>

        {fileCount > 0 && (
          <p className="mt-4 text-sm text-gray-600">
            已选 {fileCount} 个文件：{htmlCount} 篇文章，{imageCount} 张配图
          </p>
        )}

        <button
          type="button"
          disabled={!htmlCount || importing}
          onClick={publish}
          className={`${adminStyles.btnPrimary} mt-6`}
        >
          {importing ? "上架中…" : "一键上架"}
        </button>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-gray-500">
        若你通过 AI 直接更新代码仓库中的{" "}
        <code className="rounded bg-gray-100 px-1">seed-posts.ts</code>{" "}
        上线文章，本页导入功能不受影响；数据库中的文章仍在此列表管理。
      </p>

      {results && (
        <ul className="mt-8 space-y-2">
          {results.map((r) => (
            <li
              key={r.filename}
              className={`rounded-md border px-3 py-2 text-sm ${
                r.ok
                  ? "border-emerald-100 bg-emerald-50 text-emerald-900"
                  : "border-red-100 bg-red-50 text-red-800"
              }`}
            >
              {r.ok ? (
                <>
                  ✓ {r.title}{" "}
                  {r.slug && (
                    <a
                      href={buildStoryUrl(r.slug, siteBase)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      查看
                    </a>
                  )}
                </>
              ) : (
                <>
                  ✗ {r.filename}: {r.error}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
