import { uploadBuffer, isR2Configured, getPublicUrl } from "@/lib/storage/r2";

/** Map folder-relative paths → base64 data URLs from browser upload. */
export type AssetMap = Record<string, string>;

function dirname(relativePath: string): string {
  const i = relativePath.lastIndexOf("/");
  return i >= 0 ? relativePath.slice(0, i) : "";
}

function joinPath(base: string, rel: string): string {
  if (!base) return rel.replace(/^\.\//, "");
  if (rel.startsWith("/")) return rel.slice(1);
  return `${base}/${rel.replace(/^\.\//, "")}`.replace(/\/+/g, "/");
}

function parseDataUrl(dataUrl: string): { buffer: Buffer; contentType: string } | null {
  const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!m) return null;
  try {
    return {
      contentType: m[1],
      buffer: Buffer.from(m[2], "base64"),
    };
  } catch {
    return null;
  }
}

function extFromMime(mime: string): string {
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("svg")) return "svg";
  return "jpg";
}

async function persistAsset(
  slug: string,
  keyInMap: string,
  dataUrl: string
): Promise<string | null> {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;

  if (isR2Configured()) {
    const ext = extFromMime(parsed.contentType);
    const safeName = keyInMap.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
    const r2Key = `articles/${slug}/${safeName}.${ext}`;
    return uploadBuffer(parsed.buffer, r2Key, parsed.contentType);
  }

  // Dev fallback: keep data URL (works locally; not ideal for prod).
  return dataUrl;
}

/**
 * Rewrite <img src> in article HTML using files from the selected folder.
 * Relative paths are resolved against the HTML file's directory in the folder.
 */
export async function mirrorArticleAssets(
  html: string,
  slug: string,
  htmlFilename: string,
  assets: AssetMap
): Promise<string> {
  if (!assets || !Object.keys(assets).length) return html;

  const baseDir = dirname(htmlFilename.replace(/\\/g, "/"));
  const assetKeys = Object.keys(assets).map((k) => k.replace(/\\/g, "/"));

  const resolveAssetKey = (src: string): string | null => {
    const clean = src.trim();
    if (!clean || clean.startsWith("data:") || /^https?:\/\//i.test(clean)) {
      return null;
    }
    const candidates = [
      clean,
      joinPath(baseDir, clean),
      clean.replace(/^\.\//, ""),
      joinPath(baseDir, clean.replace(/^\.\//, "")),
    ];
    for (const c of candidates) {
      const hit = assetKeys.find(
        (k) => k === c || k.endsWith(`/${c}`) || k.endsWith(c)
      );
      if (hit) return hit;
    }
    return null;
  };

  const imgRe = /<img([^>]*)\ssrc=["']([^"']+)["']([^>]*)>/gi;
  let out = html;
  const replacements: { from: string; to: string }[] = [];

  let match: RegExpExecArray | null;
  while ((match = imgRe.exec(html)) !== null) {
    const full = match[0];
    const src = match[2];
    const key = resolveAssetKey(src);
    if (!key || !assets[key]) continue;
    const uploaded = await persistAsset(slug, key, assets[key]);
    if (uploaded && uploaded !== src) {
      replacements.push({ from: full, to: full.replace(src, uploaded) });
    }
  }

  for (const { from, to } of replacements) {
    out = out.split(from).join(to);
  }

  return out;
}
