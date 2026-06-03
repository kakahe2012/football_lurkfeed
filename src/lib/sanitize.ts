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

/**
 * Remove the first <img> in article body HTML.
 * Cover is shown separately via hero_image (same image as Feed).
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
