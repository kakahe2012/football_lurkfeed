/**
 * Schema.org structured data factories — the single source of truth for
 * every JSON-LD block we emit on the site.
 *
 * Why centralized:
 *   - AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended) and
 *     classic search both rely on these. A single bad emit breaks rich
 *     results across the entire site.
 *   - Allows us to bump @id strategy / publisher metadata in one place.
 */

import type { Post } from "@/types";
import { getSiteUrl } from "@/lib/utils";
import {
  extractFaqPairs,
  extractTakeaways,
  extractMentionedPeople,
  extractMentionedTeams,
  detectArticleType,
} from "@/lib/seo/extract-geo";

const SITE_NAME = "LurkFeed Football";
const SITE_TAGLINE = "Football. The fun parts.";
const PUBLISHER_LOGO_PATH = "/logo.png";
const SAME_AS_LINKS: string[] = [
  // Add real social profile URLs here once they exist; AI engines use them
  // as entity-disambiguation anchors.
  // "https://twitter.com/lurkfeedfootball",
];

/* ----------------------------- generic builders ---------------------------- */

export function buildOrganizationSchema() {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: SITE_NAME,
    url: base,
    logo: {
      "@type": "ImageObject",
      url: `${base}${PUBLISHER_LOGO_PATH}`,
    },
    slogan: SITE_TAGLINE,
    sameAs: SAME_AS_LINKS,
  };
}

/**
 * WebSite + SearchAction.
 *
 * SearchAction is the magic that gives Google (and increasingly AI
 * answer engines) the ability to send users directly into our /search
 * page from the SERP — and signals to LLM crawlers that we have a
 * structured way to query content.
 */
export function buildWebSiteSchema() {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    url: base,
    name: SITE_NAME,
    description:
      "World Cup gossip, drama and culture for new fans. Built for stories, not stats.",
    publisher: { "@id": `${base}/#organization` },
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${base}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface BreadcrumbCrumb {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(crumbs: BreadcrumbCrumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
}

export function buildItemListSchema(
  posts: Post[],
  options: { name: string; url: string; description?: string }
) {
  const base = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: options.name,
    description: options.description,
    url: options.url,
    numberOfItems: posts.length,
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${base}/story/${p.slug}`,
      name: p.title,
    })),
  };
}

/* ----------------------------- article builders ---------------------------- */

/**
 * The big one. Builds an Article (or NewsArticle / OpinionNewsArticle / etc.)
 * with FULL GEO enrichment:
 *   - mentions[] (people + teams with sameAs)
 *   - about[] (top 3 tags as topic entities)
 *   - keywords (comma-separated)
 *   - speakable (CSS selectors for voice surfaces)
 *   - articleSection
 *   - publisher / author with @id refs back to Organization
 */
export function buildArticleSchema(post: Post) {
  const base = getSiteUrl();
  const url = `${base}/story/${post.slug}`;
  const articleType = detectArticleType(post.tags, post.emotion_type);

  const people = extractMentionedPeople(post.content, post.tags).map((p) => ({
    "@type": "Person",
    name: p.name,
    sameAs: p.sameAs,
  }));
  const teams = extractMentionedTeams(post.tags).map((t) => ({
    "@type": "SportsTeam",
    name: t.name,
    sameAs: t.sameAs,
  }));
  const mentions = [...people, ...teams];

  const aboutEntities = post.tags.slice(0, 5).map((t) => ({
    "@type": "Thing",
    name: t.replace(/-/g, " "),
  }));

  return {
    "@context": "https://schema.org",
    "@type": articleType,
    "@id": `${url}#article`,
    headline: post.title,
    alternativeHeadline: post.seo_title || undefined,
    description: post.seo_description || post.intro_hook,
    image: [post.og_image || post.hero_image],
    datePublished: post.published_at || post.created_at,
    dateModified: post.published_at || post.created_at,
    author: { "@id": `${base}/#organization` },
    publisher: { "@id": `${base}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isAccessibleForFree: true,
    articleSection: post.tags[0] || "Football",
    keywords: post.tags.join(", "),
    inLanguage: "en-US",
    wordCount: estimateWordCount(post.content),
    timeRequired: `PT${post.read_time_minutes || 3}M`,
    mentions: mentions.length > 0 ? mentions : undefined,
    about: aboutEntities,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".article-lead", ".takeaways"],
    },
  };
}

/**
 * Standalone FAQPage schema — emitted ONLY when we extract ≥ 2 real FAQ
 * pairs from the body. Keeping this as its own block (instead of nesting
 * under Article) is what unlocks Google's "FAQ rich result" + makes
 * Perplexity / ChatGPT cite the answer text directly.
 */
export function buildFaqSchema(post: Post) {
  const pairs = extractFaqPairs(post.content);
  if (pairs.length < 2) return null;

  const base = getSiteUrl();
  const url = `${base}/story/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    mainEntity: pairs.map((p) => ({
      "@type": "Question",
      name: p.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: p.answer,
      },
    })),
  };
}

/**
 * Person / SportsTeam entity blocks for the people/teams the article is about.
 * Emits only if we actually have at least one with sameAs. This is the second
 * lever (after FAQ) that meaningfully improves AI citation rates: it tells
 * an LLM crawler exactly which Wikipedia entity our article corresponds to.
 */
export function buildEntitySchemas(post: Post) {
  const people = extractMentionedPeople(post.content, post.tags);
  const teams = extractMentionedTeams(post.tags);
  const blocks: Record<string, unknown>[] = [];

  for (const p of people) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "Person",
      name: p.name,
      sameAs: p.sameAs,
    });
  }
  for (const t of teams) {
    blocks.push({
      "@context": "https://schema.org",
      "@type": "SportsTeam",
      name: t.name,
      sameAs: t.sameAs,
      sport: "Soccer",
    });
  }
  return blocks;
}

/**
 * Optional HowTo / ItemList style block when an article surfaces a
 * `.takeaways` block. Doubles as a "key points" summary that LLMs love
 * to lift verbatim.
 */
export function buildKeyTakeawaysSchema(post: Post) {
  const points = extractTakeaways(post.content);
  if (points.length < 3) return null;

  const base = getSiteUrl();
  const url = `${base}/story/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#takeaways`,
    name: "Key Takeaways",
    itemListElement: points.map((text, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: text,
    })),
  };
}

/* ------------------------------- helpers ---------------------------------- */

function estimateWordCount(html: string): number {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

/**
 * Combine the full GEO bundle for a story page. Returns an array of
 * JSON-LD objects ready to drop into <script type="application/ld+json">.
 * Skips null blocks (e.g. articles without FAQ).
 */
export function buildStoryGraph(post: Post): Record<string, unknown>[] {
  const blocks: (Record<string, unknown> | null)[] = [
    buildArticleSchema(post),
    buildFaqSchema(post),
    buildKeyTakeawaysSchema(post),
    ...buildEntitySchemas(post),
  ];
  return blocks.filter(Boolean) as Record<string, unknown>[];
}
