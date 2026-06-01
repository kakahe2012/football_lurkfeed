"use client";

import { useEffect, useRef, useState } from "react";
import { Check, FileUp, FolderUp, RefreshCw, X } from "lucide-react";
import {
  adminStyles,
  getAdminToken,
  EMOTION_LABELS_ZH,
} from "@/components/admin/admin-styles";

interface ImportResult {
  filename: string;
  ok: boolean;
  slug?: string;
  title?: string;
  emotion?: string;
  tags?: string[];
  error?: string;
}

interface PostRow {
  id: string;
  title: string;
  slug: string;
  emotion_type: string;
  publish_status: string;
}

const EMOTIONS = Object.keys(EMOTION_LABELS_ZH);

export default function AdminPublishPage() {
  // ---- Import section ----
  const [files, setFiles] = useState<{ filename: string; html: string }[]>([]);
  const [emotion, setEmotion] = useState("culture");
  const [status, setStatus] = useState("pending");
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult[] | null>(null);
  const folderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (folderRef.current) {
      folderRef.current.setAttribute("webkitdirectory", "");
      folderRef.current.setAttribute("directory", "");
    }
  }, []);

  const readFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    const htmlFiles = Array.from(fileList).filter((f) =>
      /\.(html?|htm)$/i.test(f.name)
    );
    const read = await Promise.all(
      htmlFiles.map(
        (f) =>
          new Promise<{ filename: string; html: string }>((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve({ filename: f.name, html: String(reader.result || "") });
            reader.readAsText(f);
          })
      )
    );
    setFiles(read);
    setResults(null);
  };

  const runImport = async () => {
    if (!files.length) return;
    setImporting(true);
    setResults(null);
    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: files, status, emotion }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResults([{ filename: "—", ok: false, error: data.error || "导入失败" }]);
      } else {
        setResults(data.results || []);
        if (!data.persisted) {
          setResults((prev) => [
            { filename: "⚠️ 提示", ok: false, error: "未连接 Supabase，未真正写入数据库（仅校验解析）。" },
            ...(prev || []),
          ]);
        }
        loadPending();
      }
    } finally {
      setImporting(false);
    }
  };

  // ---- Batch publish existing ----
  const [pending, setPending] = useState<PostRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loadingList, setLoadingList] = useState(true);
  const [batchWorking, setBatchWorking] = useState(false);

  const loadPending = async () => {
    setLoadingList(true);
    const res = await fetch("/api/admin/articles?status=all", {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    });
    const data = await res.json();
    const rows: PostRow[] = (data.posts || []).filter(
      (p: PostRow) => p.publish_status !== "published"
    );
    setPending(rows);
    setSelected(new Set());
    setLoadingList(false);
  };

  useEffect(() => {
    loadPending();
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === pending.length) setSelected(new Set());
    else setSelected(new Set(pending.map((p) => p.id)));
  };

  const batchUpdate = async (publish_status: string) => {
    if (!selected.size) return;
    setBatchWorking(true);
    try {
      await fetch("/api/admin/posts", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: Array.from(selected), publish_status }),
      });
      await loadPending();
    } finally {
      setBatchWorking(false);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className={adminStyles.pageTitle}>发布 / 导入</h1>
        <p className={adminStyles.pageDesc}>
          批量导入已排版好的 HTML 文章，或勾选现有草稿/待审文章一键发布
        </p>
      </div>

      {/* Import HTML */}
      <section className={adminStyles.card}>
        <h2 className="text-base font-semibold text-gray-900">① 导入 HTML 文章</h2>
        <p className="mt-1 text-sm text-gray-500">
          支持多个 <code>.html</code> 文件或整个文件夹。系统自动从 KC v3 模板（<code>og:image</code>、
          <code>meta keywords</code>、<code>article-category</code>、JSON-LD 等）提取标题、首图、标签、分类、发布日期，
          并做安全消毒后入库。下方下拉的「情绪分类」仅作为兜底，实际情绪会自动从分类/tag 推断。
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <label className={`${adminStyles.btnSecondary} inline-flex cursor-pointer items-center gap-2`}>
            <FileUp size={16} /> 选择文件
            <input
              type="file"
              accept=".html,.htm"
              multiple
              className="hidden"
              onChange={(e) => readFiles(e.target.files)}
            />
          </label>
          <label className={`${adminStyles.btnSecondary} inline-flex cursor-pointer items-center gap-2`}>
            <FolderUp size={16} /> 选择文件夹
            <input
              ref={folderRef}
              type="file"
              className="hidden"
              onChange={(e) => readFiles(e.target.files)}
            />
          </label>
        </div>

        {files.length > 0 && (
          <p className="mt-3 text-sm text-gray-600">
            已读取 <span className="font-semibold">{files.length}</span> 个 HTML 文件
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="text-sm text-gray-600">
            兜底情绪分类（自动识别失败时使用）
            <select
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
              className={`${adminStyles.select} min-w-[200px]`}
            >
              {EMOTIONS.map((em) => (
                <option key={em} value={em}>
                  {EMOTION_LABELS_ZH[em]}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-gray-600">
            发布状态
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`${adminStyles.select} min-w-[160px]`}
            >
              <option value="pending">待审核（推荐）</option>
              <option value="draft">草稿</option>
              <option value="published">直接发布</option>
            </select>
          </label>
          <button
            type="button"
            onClick={runImport}
            disabled={importing || !files.length}
            className={adminStyles.btnPrimary}
          >
            {importing ? "导入中…" : `导入 ${files.length || ""} 篇`}
          </button>
        </div>

        {results && (
          <div className="mt-5 overflow-hidden rounded-lg border border-gray-200">
            <table className={adminStyles.table}>
              <thead>
                <tr className={adminStyles.tableHead}>
                  <th className="p-3 font-medium">文件</th>
                  <th className="p-3 font-medium">结果</th>
                  <th className="p-3 font-medium">说明</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, i) => (
                  <tr key={i} className="border-b border-gray-100 last:border-0">
                    <td className="p-3 text-gray-700">{r.filename}</td>
                    <td className="p-3">
                      {r.ok ? (
                        <span className={adminStyles.badgeGreen}>成功</span>
                      ) : (
                        <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">
                          失败
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-gray-500">
                      {r.ok ? (
                        <>
                          <span className="text-gray-800">{r.title}</span>
                          <span className="ml-1 text-gray-400">→ /{r.slug}</span>
                          {r.emotion && (
                            <span className="ml-2 rounded bg-emerald-50 px-1.5 py-0.5 text-[11px] text-emerald-700">
                              {EMOTION_LABELS_ZH[r.emotion] || r.emotion}
                            </span>
                          )}
                          {r.tags && r.tags.length > 0 && (
                            <span className="ml-1 text-[11px] text-gray-400">
                              · {r.tags.slice(0, 4).join(", ")}
                            </span>
                          )}
                        </>
                      ) : (
                        r.error
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Batch publish existing */}
      <section className={adminStyles.card}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-gray-900">② 批量发布现有文章</h2>
            <p className="mt-1 text-sm text-gray-500">勾选草稿 / 待审文章，批量发布或拒绝</p>
          </div>
          <button
            type="button"
            onClick={loadPending}
            className={`${adminStyles.btnSecondary} inline-flex items-center gap-1`}
          >
            <RefreshCw size={14} /> 刷新
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={() => batchUpdate("published")}
            disabled={batchWorking || !selected.size}
            className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-2 text-sm text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            <Check size={16} /> 发布选中（{selected.size}）
          </button>
          <button
            type="button"
            onClick={() => batchUpdate("rejected")}
            disabled={batchWorking || !selected.size}
            className={`${adminStyles.btnSecondary} inline-flex items-center gap-1`}
          >
            <X size={16} /> 拒绝选中
          </button>
        </div>

        {loadingList ? (
          <p className="mt-6 text-gray-500">加载中…</p>
        ) : pending.length === 0 ? (
          <p className="mt-6 rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
            没有待处理文章
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
            <table className={adminStyles.table}>
              <thead>
                <tr className={adminStyles.tableHead}>
                  <th className="w-10 p-3">
                    <input
                      type="checkbox"
                      checked={selected.size === pending.length && pending.length > 0}
                      onChange={toggleAll}
                    />
                  </th>
                  <th className="p-3 font-medium">标题</th>
                  <th className="p-3 font-medium">情绪</th>
                  <th className="p-3 font-medium">状态</th>
                </tr>
              </thead>
              <tbody>
                {pending.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selected.has(p.id)}
                        onChange={() => toggle(p.id)}
                      />
                    </td>
                    <td className="p-3">
                      <p className="line-clamp-1 font-medium text-gray-900">{p.title}</p>
                      <p className="text-xs text-gray-400">/{p.slug}</p>
                    </td>
                    <td className="p-3 text-gray-600">
                      {EMOTION_LABELS_ZH[p.emotion_type] || p.emotion_type}
                    </td>
                    <td className="p-3">
                      <span
                        className={
                          p.publish_status === "pending"
                            ? adminStyles.badgeAmber
                            : adminStyles.badgeGray
                        }
                      >
                        {p.publish_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
