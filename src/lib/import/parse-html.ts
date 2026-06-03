import {
  extractFirstImage,
  htmlToText,
  stripLeadingContentImage,
} from "@/lib/sanitize";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { slugify } from "@/lib/utils";
import type { EmotionType } from "@/types";

export interface ParsedArticle {
  title: string;
  slug: string;
  content: string;
  intro_hook: string;
  hero_image: string | null;
  seo_title: string;
  seo_description: string;
  read_time_minutes: number;
  emotion_type: EmotionType;
  tags: string[];
  published_at: string | null;
}

/* ----------------------------- helpers ------------------------------ */

function firstMatch(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? m[1] : null;
}

const NAMED_ENTITIES: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  apos: "'",
  quot: '"',
  mdash: "—",
  ndash: "–",
  hellip: "…",
  eacute: "é",
  Eacute: "É",
  aacute: "á",
  iacute: "í",
  oacute: "ó",
  uacute: "ú",
  ntilde: "ñ",
  ccedil: "ç",
};

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) =>
      String.fromCharCode(parseInt(h, 16))
    )
    .replace(/&([a-z]+);/gi, (full, name) => NAMED_ENTITIES[name] ?? full)
    .trim();
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Pull a meta tag's content. We use `("([^"]*)"|'([^']*)')` so apostrophes inside
 * a double-quoted attribute (e.g. `content="They're"`) don't terminate the match.
 */
function getMeta(html: string, key: "name" | "property", value: string): string | null {
  const v = escapeRe(value);
  const re = new RegExp(
    `<meta[^>]+${key}=(?:"${v}"|'${v}')[^>]*content=(?:"([^"]*)"|'([^']*)')`,
    "i"
  );
  const reReverse = new RegExp(
    `<meta[^>]+content=(?:"([^"]*)"|'([^']*)')[^>]*${key}=(?:"${v}"|'${v}')`,
    "i"
  );
  const m = html.match(re) || html.match(reReverse);
  if (!m) return null;
  const raw = m[1] ?? m[2] ?? "";
  return decodeEntities(raw);
}

function getAllMeta(html: string, key: "name" | "property", value: string): string[] {
  const v = escapeRe(value);
  const out: string[] = [];
  const re = new RegExp(
    `<meta[^>]+${key}=(?:"${v}"|'${v}')[^>]*content=(?:"([^"]*)"|'([^']*)')`,
    "gi"
  );
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const raw = m[1] ?? m[2] ?? "";
    if (raw) out.push(decodeEntities(raw));
  }
  return out;
}

/** Map KC v3 categories / tag vocabulary onto our 6 emotion buckets. */
function mapCategoryToEmotion(
  category: string | null | undefined,
  tags: string[]
): EmotionType {
  const c = (category || "").toLowerCase();
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  const has = (...keys: string[]) => keys.some((k) => tagSet.has(k));

  if (
    c.includes("prediction") ||
    c.includes("odds") ||
    c.includes("hype") ||
    has("prediction", "odds", "match-prediction", "winner-picks", "fantasy")
  ) return "hype";

  if (
    c.includes("heartbreak") ||
    c.includes("retrospective") ||
    has("heartbreak", "retrospective", "controversial", "scandal")
  ) return "heartbreak";

  if (
    c.includes("luxury") ||
    c.includes("icon") ||
    c.includes("fashion") ||
    has("luxury", "cars", "mansions", "watches", "fashion", "jersey", "boots", "celebrity") ||
    has("mbappe", "ronaldo", "messi", "haaland", "kane", "neymar", "vinicius", "bellingham")
  ) return "icons";

  if (
    c.includes("gossip") ||
    c.includes("drama") ||
    c.includes("debate") ||
    has("gossip", "drama", "wags", "relationships", "debate", "scandal", "transfer")
  ) return "secrets";

  if (
    c.includes("guide") ||
    c.includes("beginner") ||
    c.includes("explain") ||
    has("for-new-fans", "beginners-guide", "explain-meme", "guide", "trivia", "funfacts")
  ) return "easy_football";

  // default → culture (memes, fan culture, fashion vibes, fan experience)
  return "culture";
}

function parsePublishedAt(html: string, jsonLd: Record<string, unknown> | null): string | null {
  if (jsonLd && typeof jsonLd.datePublished === "string") {
    const d = new Date(jsonLd.datePublished);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  const meta = getMeta(html, "property", "article:published_time") ||
    getMeta(html, "name", "article:published_time");
  if (meta) {
    const d = new Date(meta);
    if (!isNaN(d.getTime())) return d.toISOString();
  }
  return null;
}

function extractJsonLd(html: string, type: string): Record<string, unknown> | null {
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const obj = JSON.parse(m[1].trim());
      if (obj && (obj["@type"] === type || (Array.isArray(obj["@graph"]) &&
        obj["@graph"].some((g: Record<string, unknown>) => g["@type"] === type)))) {
        return obj;
      }
    } catch {
      // ignore malformed JSON-LD blocks
    }
  }
  return null;
}

/** Pick the most useful article container. KC v3 uses <article class="article-wrap">. */
function extractArticleContent(html: string): string {
  // Strip <head>, scripts and styles up-front so they can never leak into content.
  const noHead = html
    .replace(/<head\b[\s\S]*?<\/head>/i, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "");

  const article =
    firstMatch(noHead, /<article[^>]*class=["'][^"']*article-wrap[^"']*["'][^>]*>([\s\S]*?)<\/article>/i) ||
    firstMatch(noHead, /<article[^>]*>([\s\S]*?)<\/article>/i) ||
    firstMatch(noHead, /<main[^>]*>([\s\S]*?)<\/main>/i) ||
    firstMatch(noHead, /<body[^>]*>([\s\S]*?)<\/body>/i) ||
    noHead;

  // Drop the imported nav, hero block (we render hero separately), title/meta block
  // (we render those ourselves), in-article tag chips and external CTAs.
  let cleaned = article
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<div[^>]*class=["'][^"']*\bhero\b[^"']*["'][\s\S]*?<\/div>/gi, "")
    .replace(/<p[^>]*class=["'][^"']*\barticle-category\b[^"']*["'][\s\S]*?<\/p>/gi, "")
    .replace(/<h1[^>]*class=["'][^"']*\barticle-title\b[^"']*["'][\s\S]*?<\/h1>/gi, "")
    .replace(/<div[^>]*class=["'][^"']*\barticle-meta\b[^"']*["'][\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*class=["'][^"']*\barticle-tags\b[^"']*["'][\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*class=["'][^"']*\bread-more\b[^"']*["'][\s\S]*?<\/div>/gi, "")
    .replace(/<a[^>]*class=["'][^"']*\binternal-link-card\b[^"']*["'][\s\S]*?<\/a>/gi, "");

  // Optional: unwrap the outer .article-body / .article-wrap shell so content sits flat
  cleaned = cleaned.replace(
    /<div[^>]*class=["']article-body["'][^>]*>([\s\S]*)<\/div>\s*$/i,
    "$1"
  );

  return cleaned.trim();
}

/* ----------------------------- main ------------------------------ */

/**
 * KC v4 filename: `{slug}_wc{YYYYMMDD}_{seq}_{tags}_{lang}.html`
 * Prefer this slug over title-derived slugs for stable URLs across imports.
 */
export function slugFromFilename(filename: string): string | null {
  const base = filename.replace(/^.*[/\\]/, "").replace(/\.html$/i, "");
  const m = base.match(/^([a-z0-9-]+)_wc\d{8}_\d+/i);
  return m ? m[1].toLowerCase() : null;
}

export function parseArticleHtml(
  rawHtml: string,
  filename: string,
  defaultEmotion: EmotionType = "culture"
): ParsedArticle {
  const html = rawHtml || "";

  // Title: prefer og:title (cleaner) → <h1 class="article-title"> → <title> → filename
  const ogTitle = getMeta(html, "property", "og:title");
  const h1 = firstMatch(html, /<h1[^>]*class=["'][^"']*article-title[^"']*["'][^>]*>([\s\S]*?)<\/h1>/i)
    || firstMatch(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const docTitle = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const fallback = filename.replace(/\.[^.]+$/, "").replace(/_/g, " ").replace(/-/g, " ");
  const titleRaw = ogTitle || h1 || docTitle || fallback;
  const title = decodeEntities(titleRaw.replace(/<[^>]+>/g, " ")).slice(0, 180) || "Untitled";

  // Hero image: og:image → first <img> in source
  const ogImage = getMeta(html, "property", "og:image");
  const heroImage = ogImage || extractFirstImage(html);

  // Tags: keywords → article:tag → empty (slugified, deduped, max 8)
  const keywords = getMeta(html, "name", "keywords");
  const articleTags = getAllMeta(html, "property", "article:tag")
    .concat(getAllMeta(html, "name", "article:tag"));
  const rawTags = (keywords ? keywords.split(/[,;]/) : []).concat(articleTags);
  const tags = Array.from(
    new Set(
      rawTags
        .map((t) => slugify(decodeEntities(t)))
        .filter((t) => t.length > 0 && t.length <= 40)
    )
  ).slice(0, 8);

  // Category → emotion mapping
  const category =
    getMeta(html, "name", "article:section") ||
    firstMatch(html, /<p[^>]*class=["'][^"']*article-category[^"']*["'][^>]*>([\s\S]*?)<\/p>/i) ||
    firstMatch(html, /<span[^>]*class=["'][^"']*hero-badge[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
  const cleanCategory = category
    ? decodeEntities(category.replace(/<[^>]+>/g, " "))
    : null;
  const emotion = mapCategoryToEmotion(cleanCategory, tags) || defaultEmotion;

  // SEO description / lead intro
  const metaDesc =
    getMeta(html, "name", "description") ||
    getMeta(html, "property", "og:description");
  const articleLead = firstMatch(
    html,
    /<p[^>]*class=["'][^"']*article-lead[^"']*["'][^>]*>([\s\S]*?)<\/p>/i
  );

  // Body content (sanitized)
  const rawBody = extractArticleContent(html);
  const sanitized = sanitizeHtml(rawBody);
  const content = stripLeadingContentImage(sanitized);

  // intro_hook precedence: lead → meta description → first 160 chars of plain text
  const intro =
    (articleLead && htmlToText(articleLead, 220)) ||
    metaDesc ||
    htmlToText(content, 160) ||
    title;

  // Read time: prefer the badge "5 min read" if present, otherwise estimate at 200 wpm
  const readBadge = firstMatch(
    html,
    /(\d{1,2})\s*min\s*read/i
  );
  const wordCount = htmlToText(content, 200000).split(/\s+/).filter(Boolean).length;
  const readTime = readBadge
    ? Math.max(1, parseInt(readBadge, 10))
    : Math.max(1, Math.round(wordCount / 200));

  // Article JSON-LD for date
  const articleLd = extractJsonLd(html, "Article");
  const publishedAt = parsePublishedAt(html, articleLd);

  const filenameSlug = slugFromFilename(filename);
  const titleSlug = slugify(title);

  return {
    title,
    slug: filenameSlug || titleSlug || `post-${Date.now()}`,
    content,
    intro_hook: intro,
    hero_image: heroImage,
    seo_title: (getMeta(html, "name", "twitter:title") || title).slice(0, 70),
    seo_description: (metaDesc || htmlToText(content, 155)).slice(0, 200),
    read_time_minutes: readTime,
    emotion_type: emotion,
    tags,
    published_at: publishedAt,
  };
}
