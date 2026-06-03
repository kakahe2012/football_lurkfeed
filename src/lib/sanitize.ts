// NOTE: This file is imported by hot-path route handlers (`/api/feed`,
// `/api/tags`, `/api/search`) via `lib/data/posts.ts`. We must NOT pull
// jsdom / isomorphic-dompurify into the closure of those routes because
// it bloats the function bundle to ~10MB and breaks Vercel deploys.
//
// `sanitizeHtml` (the only DOMPurify-dependent helper) lives in
// `./sanitize-html` and is consumed only by import scripts and the
// statically-generated story page.

/** First <img src> at the start of article body HTML. */
export function getLeadingContentImageSrc(html: string): string | null {
  if (!html?.trim()) return null;
  const m = html.trimStart().match(/^<img\b[^>]*\bsrc=(["'])([^"']+)\1/i);
  return m ? m[2].replace(/&amp;/g, "&") : null;
}

/**
 * Point the first body <img> at hero_image (Feed cover) so正文配图与 Feed 一致.
 */
export function syncLeadingContentImageToHero(
  html: string,
  heroUrl: string
): string {
  if (!html?.trim() || !heroUrl?.trim()) return html;
  const src = heroUrl.trim().replace(/&/g, "&amp;");
  let s = html.trimStart();
  if (!/^<img\b/i.test(s)) return html;
  return s.replace(
    /^(<img\b[^>]*\bsrc=)(["'])([^"']*)(\2)/i,
    `$1$2${src}$4`
  );
}

/**
 * Remove leading body <img> when it matches hero (shown once above the body).
 */
export function stripLeadingContentImage(html: string): string {
  if (!html?.trim()) return html;
  let s = html.trimStart();
  if (!/^<img\b/i.test(s)) return html;
  s = s
    .replace(/^<img\b[^>]*\/?>\s*/i, "")
    .replace(/^<img\b[\s\S]*?<\/img>\s*/i, "")
    .trimStart();
  return s;
}

/** Sync first body image to hero, then drop it from rendered body (hero block only). */
export function prepareArticleBodyHtml(
  html: string,
  heroUrl: string
): string {
  const synced = syncLeadingContentImageToHero(html, heroUrl);
  return stripLeadingContentImage(synced);
}

/** Pull the first <img src> out of an HTML blob (used when importing files). */
export function extractFirstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (!match) return null;
  const src = match[1].trim();
  if (/^https?:\/\//i.test(src)) return src;
  return null;
}

/** Plain-text excerpt from HTML (for intro_hook / seo_description fallbacks). */
export function htmlToText(html: string, maxLen = 200): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLen ? `${text.slice(0, maxLen).trim()}…` : text;
}
