import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize untrusted article HTML (AI output, imported HTML files, etc.)
 * before it is stored or rendered via dangerouslySetInnerHTML.
 *
 * Strips <script>, <iframe>, event handlers, javascript: URLs, etc.
 * Video embeds are handled separately through the whitelisted parseVideoUrl,
 * never through raw content HTML.
 */
const ALLOWED_TAGS = [
  "p", "br", "hr", "span", "div", "section", "article", "aside",
  "h1", "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "blockquote", "pre", "code",
  "strong", "b", "em", "i", "u", "s", "mark", "small", "sub", "sup",
  "a", "img", "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td",
];

const ALLOWED_ATTR = [
  "href", "src", "alt", "title", "class", "target", "rel",
  "loading", "width", "height",
];

export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";
  const clean = DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "style"],
    ADD_ATTR: ["target"],
  });
  return clean;
}

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
