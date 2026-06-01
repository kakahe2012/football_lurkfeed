/**
 * GEO Extractor — distill structured signals out of an article body.
 *
 * Generative search engines (ChatGPT search, Perplexity, Google AI Overviews,
 * Bing Copilot) cite content much more reliably when it has machine-readable
 * Q&A pairs, person entities and bullet takeaways. The KC v3 template already
 * encodes those as semantic CSS classes — we just need to surface them.
 *
 * Why we do this at render time (not at import time):
 *   - The body content is the source of truth: human edits in admin land here.
 *   - Schema stays in sync with content automatically, no separate columns to
 *     keep up to date when an editor tweaks the FAQ.
 *   - Old / pre-KC-template articles still benefit when an editor adds a
 *     `.faq-item` block by hand.
 *
 * All extractors are forgiving: if the markup isn't there, they return [].
 */

export interface FaqPair {
  question: string;
  answer: string;
}

export interface RankedItem {
  position: number;
  name: string;
  description?: string;
}

/* ----------------------------- shared utils ------------------------------ */

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…");
}

function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/* ------------------------------- FAQ pairs -------------------------------- */

/**
 * Extract `<div class="faq-item"><h3>Q?</h3><p>A.</p></div>` pairs.
 * Falls back to `<details><summary>Q?</summary>...</details>` accordions.
 *
 * Filters: question must contain "?" and be ≤ 200 chars; answer ≤ 800 chars
 * after strip. Empty / one-word answers are dropped.
 */
export function extractFaqPairs(html: string): FaqPair[] {
  const pairs: FaqPair[] = [];
  if (!html) return pairs;

  const itemRe =
    /<div[^>]*class=["'][^"']*\bfaq-item\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(html)) !== null) {
    const inner = m[1];
    const qMatch = inner.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const aMatch = inner.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (!qMatch || !aMatch) continue;
    const question = stripTags(qMatch[1]);
    const answer = stripTags(aMatch[1]);
    if (!question || !answer) continue;
    if (!/[?？]/.test(question)) continue;
    if (question.length > 200 || answer.length < 5 || answer.length > 800) continue;
    pairs.push({ question, answer });
  }

  if (pairs.length === 0) {
    const detailsRe = /<details[^>]*>([\s\S]*?)<\/details>/gi;
    while ((m = detailsRe.exec(html)) !== null) {
      const inner = m[1];
      const sum = inner.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);
      if (!sum) continue;
      const question = stripTags(sum[1]);
      const answer = stripTags(inner.replace(/<summary[^>]*>[\s\S]*?<\/summary>/i, ""));
      if (!question || !answer) continue;
      if (!/[?？]/.test(question)) continue;
      pairs.push({ question, answer });
    }
  }

  return pairs.slice(0, 10);
}

/* ----------------------------- Key Takeaways ------------------------------ */

/** Extract `.takeaways ul li` lines as plain strings. */
export function extractTakeaways(html: string): string[] {
  if (!html) return [];
  const block = html.match(
    /<div[^>]*class=["'][^"']*\btakeaways\b[^"']*["'][^>]*>([\s\S]*?)<\/div>/i
  );
  if (!block) return [];
  const items: string[] = [];
  const liRe = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m: RegExpExecArray | null;
  while ((m = liRe.exec(block[1])) !== null) {
    const t = stripTags(m[1]);
    if (t && t.length >= 4 && t.length <= 220) items.push(t);
  }
  return items.slice(0, 8);
}

/* ----------------------------- Ranked list -------------------------------- */

/** Extract `.ranked-list .rank-item` -> { position, name, description }. */
export function extractRankedItems(html: string): RankedItem[] {
  if (!html) return [];
  const block = html.match(
    /<(?:ol|ul)[^>]*class=["'][^"']*\branked-list\b[^"']*["'][^>]*>([\s\S]*?)<\/(?:ol|ul)>/i
  );
  if (!block) return [];

  const items: RankedItem[] = [];
  const liRe = /<li[^>]*class=["'][^"']*\brank-item\b[^"']*["'][^>]*>([\s\S]*?)<\/li>/gi;
  let m: RegExpExecArray | null;
  let i = 1;
  while ((m = liRe.exec(block[1])) !== null) {
    const inner = m[1];
    const h = inner.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const p = inner.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const name = h ? stripTags(h[1]) : "";
    if (!name) {
      i++;
      continue;
    }
    items.push({
      position: i++,
      name,
      description: p ? stripTags(p[1]) || undefined : undefined,
    });
  }
  return items.slice(0, 20);
}

/* ----------------------------- Person entities ----------------------------- */

/**
 * Map common KC player tag slugs onto Wikipedia / official sameAs links.
 * sameAs gives AI engines a high-confidence entity disambiguation, so a query
 * like "what does Mbappé look like" can pull a citation from our article.
 *
 * Keep this list in sync with `references/naming-convention.md` Player tags.
 */
const PLAYER_KB: Record<string, { name: string; sameAs: string[] }> = {
  mbappe: {
    name: "Kylian Mbappé",
    sameAs: [
      "https://en.wikipedia.org/wiki/Kylian_Mbapp%C3%A9",
      "https://www.wikidata.org/wiki/Q19799642",
    ],
  },
  ronaldo: {
    name: "Cristiano Ronaldo",
    sameAs: [
      "https://en.wikipedia.org/wiki/Cristiano_Ronaldo",
      "https://www.wikidata.org/wiki/Q11571",
    ],
  },
  messi: {
    name: "Lionel Messi",
    sameAs: [
      "https://en.wikipedia.org/wiki/Lionel_Messi",
      "https://www.wikidata.org/wiki/Q615",
    ],
  },
  neymar: {
    name: "Neymar",
    sameAs: [
      "https://en.wikipedia.org/wiki/Neymar",
      "https://www.wikidata.org/wiki/Q142794",
    ],
  },
  bellingham: {
    name: "Jude Bellingham",
    sameAs: [
      "https://en.wikipedia.org/wiki/Jude_Bellingham",
      "https://www.wikidata.org/wiki/Q67233860",
    ],
  },
  haaland: {
    name: "Erling Haaland",
    sameAs: [
      "https://en.wikipedia.org/wiki/Erling_Haaland",
      "https://www.wikidata.org/wiki/Q23739283",
    ],
  },
  salah: {
    name: "Mohamed Salah",
    sameAs: [
      "https://en.wikipedia.org/wiki/Mohamed_Salah",
      "https://www.wikidata.org/wiki/Q3535635",
    ],
  },
  vinicius: {
    name: "Vinícius Júnior",
    sameAs: [
      "https://en.wikipedia.org/wiki/Vin%C3%ADcius_J%C3%BAnior",
      "https://www.wikidata.org/wiki/Q23012846",
    ],
  },
  modric: {
    name: "Luka Modrić",
    sameAs: [
      "https://en.wikipedia.org/wiki/Luka_Modri%C4%87",
      "https://www.wikidata.org/wiki/Q189835",
    ],
  },
  kane: {
    name: "Harry Kane",
    sameAs: [
      "https://en.wikipedia.org/wiki/Harry_Kane",
      "https://www.wikidata.org/wiki/Q5675459",
    ],
  },
  pedri: {
    name: "Pedri",
    sameAs: ["https://en.wikipedia.org/wiki/Pedri"],
  },
  gavi: {
    name: "Gavi",
    sameAs: ["https://en.wikipedia.org/wiki/Gavi_(footballer)"],
  },
  saka: {
    name: "Bukayo Saka",
    sameAs: ["https://en.wikipedia.org/wiki/Bukayo_Saka"],
  },
  foden: {
    name: "Phil Foden",
    sameAs: ["https://en.wikipedia.org/wiki/Phil_Foden"],
  },
  wirtz: {
    name: "Florian Wirtz",
    sameAs: ["https://en.wikipedia.org/wiki/Florian_Wirtz"],
  },
  musiala: {
    name: "Jamal Musiala",
    sameAs: ["https://en.wikipedia.org/wiki/Jamal_Musiala"],
  },
  yamal: {
    name: "Lamine Yamal",
    sameAs: ["https://en.wikipedia.org/wiki/Lamine_Yamal"],
  },
  alvarez: {
    name: "Julián Álvarez",
    sameAs: ["https://en.wikipedia.org/wiki/Juli%C3%A1n_%C3%81lvarez_(footballer)"],
  },
};

/**
 * Find players the article is "about" by intersecting tags + content body.
 * A player is added when:
 *   - their slug appears in `tags`, OR
 *   - their canonical name (case-insensitive) appears in plain content text
 *     AND we have a knowledge-base entry to map them to wiki links.
 */
export function extractMentionedPeople(
  html: string,
  tags: string[]
): { name: string; sameAs: string[] }[] {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  const text = stripTags(html).toLowerCase();
  const out: Map<string, { name: string; sameAs: string[] }> = new Map();

  for (const [slug, kb] of Object.entries(PLAYER_KB)) {
    if (
      tagSet.has(slug) ||
      text.includes(kb.name.toLowerCase()) ||
      text.includes(slug.replace(/-/g, " "))
    ) {
      out.set(slug, kb);
    }
  }

  // Cap to avoid runaway schemas; most articles are about ≤ 5 players anyway.
  return Array.from(out.values()).slice(0, 8);
}

/* --------------------------- Country / team entities ----------------------- */

const COUNTRY_KB: Record<string, string> = {
  france: "https://en.wikipedia.org/wiki/France_national_football_team",
  brazil: "https://en.wikipedia.org/wiki/Brazil_national_football_team",
  argentina: "https://en.wikipedia.org/wiki/Argentina_national_football_team",
  england: "https://en.wikipedia.org/wiki/England_national_football_team",
  spain: "https://en.wikipedia.org/wiki/Spain_national_football_team",
  germany: "https://en.wikipedia.org/wiki/Germany_national_football_team",
  portugal: "https://en.wikipedia.org/wiki/Portugal_national_football_team",
  netherlands: "https://en.wikipedia.org/wiki/Netherlands_national_football_team",
  belgium: "https://en.wikipedia.org/wiki/Belgium_national_football_team",
  croatia: "https://en.wikipedia.org/wiki/Croatia_national_football_team",
  italy: "https://en.wikipedia.org/wiki/Italy_national_football_team",
  morocco: "https://en.wikipedia.org/wiki/Morocco_national_football_team",
  japan: "https://en.wikipedia.org/wiki/Japan_national_football_team",
  usa: "https://en.wikipedia.org/wiki/United_States_men%27s_national_soccer_team",
  mexico: "https://en.wikipedia.org/wiki/Mexico_national_football_team",
  canada: "https://en.wikipedia.org/wiki/Canada_men%27s_national_soccer_team",
};

export function extractMentionedTeams(tags: string[]): { name: string; sameAs: string[] }[] {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  return Object.entries(COUNTRY_KB)
    .filter(([slug]) => tagSet.has(slug))
    .map(([slug, url]) => ({
      name: slug.charAt(0).toUpperCase() + slug.slice(1),
      sameAs: [url],
    }));
}

/* --------------------------- Detect article shape -------------------------- */

/**
 * KC tag vocabulary tells us roughly what kind of content this is, which
 * decides whether to use Article vs NewsArticle vs OpinionNewsArticle vs
 * AnalysisNewsArticle. AI engines weight these slightly differently.
 */
export function detectArticleType(
  tags: string[],
  category: string | null | undefined
):
  | "Article"
  | "NewsArticle"
  | "OpinionNewsArticle"
  | "AnalysisNewsArticle"
  | "ReviewNewsArticle" {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()));
  const c = (category || "").toLowerCase();

  if (
    c.includes("opinion") ||
    c.includes("debate") ||
    tagSet.has("debate") ||
    tagSet.has("controversial")
  )
    return "OpinionNewsArticle";

  if (
    c.includes("prediction") ||
    c.includes("odds") ||
    c.includes("analysis") ||
    tagSet.has("prediction") ||
    tagSet.has("odds") ||
    tagSet.has("analysis")
  )
    return "AnalysisNewsArticle";

  if (
    c.includes("review") ||
    tagSet.has("review") ||
    tagSet.has("rating-controversy")
  )
    return "ReviewNewsArticle";

  if (
    c.includes("news") ||
    c.includes("transfer") ||
    c.includes("breaking") ||
    tagSet.has("transfer") ||
    tagSet.has("trending")
  )
    return "NewsArticle";

  return "Article";
}
