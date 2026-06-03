import fs from "node:fs";
import path from "node:path";
import { uploadBuffer, isR2Configured } from "@/lib/storage/r2";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extFromMime(mime: string): string {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  return "jpg";
}

function safeSlug(slug: string): string {
  return slug.replace(/[^a-z0-9-]/gi, "-").slice(0, 80) || "post";
}

export async function persistAdminImage(
  buffer: Buffer,
  contentType: string,
  slug: string,
  originalName?: string
): Promise<{ url: string; storage: "r2" | "public" } | { error: string }> {
  if (!ALLOWED.has(contentType)) {
    return { error: "仅支持 JPEG / PNG / WebP / GIF" };
  }
  if (buffer.length > MAX_BYTES) {
    return { error: "文件不能超过 10MB" };
  }

  const safe = safeSlug(slug);
  const ext = extFromMime(contentType);
  const base =
    originalName?.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 40) ||
    "image";
  const filename = `${base}-${Date.now()}.${ext}`;

  if (isR2Configured()) {
    const key = `articles/${safe}/${filename}`;
    const url = await uploadBuffer(buffer, key, contentType);
    if (!url) return { error: "R2 上传失败" };
    return { url, storage: "r2" };
  }

  const relDir = path.join("public", "uploads", "articles", safe);
  fs.mkdirSync(relDir, { recursive: true });
  const diskPath = path.join(relDir, filename);
  fs.writeFileSync(diskPath, buffer);

  const url = `/uploads/articles/${safe}/${filename}`;
  return { url, storage: "public" };
}
