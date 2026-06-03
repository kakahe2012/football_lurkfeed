import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize untrusted article HTML (AI output, imported HTML files, etc.)
 * before it is stored or rendered via dangerouslySetInnerHTML.
 *
 * Strips <script>, <iframe>, event handlers, javascript: URLs, etc.
 * Video embeds are handled separately through the whitelisted parseVideoUrl,
 * never through raw content HTML.
 *
 * Lives in its own module because DOMPurify pulls in jsdom (~10MB);
 * keeping it isolated lets the feed read-path (`lib/data/posts.ts`) stay
 * lightweight enough for Vercel's serverless function size limits.
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
