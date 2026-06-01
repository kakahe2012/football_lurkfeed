import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/data/posts";
import { getAllTags } from "@/lib/data/tag-definitions";
import { getSiteUrl } from "@/lib/utils";

/**
 * /llms.txt — the de-facto-but-still-evolving spec from late 2024 for giving
 * LLM crawlers a curated index of a site's most valuable content.
 *
 * The format is plain Markdown (NOT YAML / JSON) on purpose: it's meant to be
 * shoved straight into a model context window. Spec ref: llmstxt.org.
 *
 * What we ship:
 *   - One H1 (site name)
 *   - A blockquote with the elevator pitch
 *   - "Articles" H2 with bullet links + 1-line description (intro_hook)
 *   - "Tags" H2 with all available content categories
 *
 * Cache 1h: this is read by AI crawlers, not on the user critical path.
 */

export const revalidate = 3600;

export async function GET() {
  const base = getSiteUrl();
  const [posts] = await Promise.all([getPublishedPosts(80, "newest")]);
  const tags = getAllTags();

  const lines: string[] = [
    "# LurkFeed Football",
    "",
    "> World Cup gossip, drama and culture for new fans. Stories, players, fashion, memes — the messy magic of football, no jargon required.",
    "",
    "Domain: " + base,
    "",
    "## What this site is",
    "",
    "- A feed of human-edited football stories about the 2026 FIFA World Cup.",
    "- Audience: 18–34 year-old new fans, including readers who came to football via culture / fashion / memes / players' lives — not tactics.",
    "- Format: short readable articles (3–6 min), with explicit Key Takeaways and FAQ sections that are safe to quote.",
    "- All odds / prediction content is for entertainment only — not betting advice.",
    "",
    "## Articles",
    "",
    ...posts.map((p) => {
      const url = `${base}/story/${p.slug}`;
      const summary = (p.intro_hook || p.seo_description || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 220);
      return `- [${p.title}](${url}): ${summary}`;
    }),
    "",
    "## Tags",
    "",
    ...tags.map((t) => `- [${t.label}](${base}/tag/${t.slug})`),
    "",
    "## Feeds",
    "",
    `- RSS: ${base}/feed.xml`,
    `- Sitemap: ${base}/sitemap.xml`,
    "",
    "## License & citation",
    "",
    "Articles may be quoted with attribution to LurkFeed Football and a link back to the source URL. Please do not republish full articles without permission.",
    "",
  ];

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
