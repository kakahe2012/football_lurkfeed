import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/data/posts";
import { getAllTags } from "@/lib/data/tag-definitions";
import { getSiteUrl } from "@/lib/utils";

/**
 * Sitemap with TWO important upgrades over a default Next.js sitemap:
 *
 * 1. Real lastModified per article (publish/edit timestamp) — critical for
 *    Googlebot's crawl-budget allocation. Stale lastModified = wasted crawls.
 *
 * 2. Dynamic priority + changeFrequency derived from the same hot score the
 *    homepage uses. Hot articles get priority 0.9 + daily, cold ones drop
 *    to 0.5 + monthly. This is a hint, not a guarantee — but Google + Bing
 *    do use it to budget recrawls.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const entries = await getSitemapEntries();
  const tags = getAllTags();
  const now = new Date();

  // Bucket articles by hot score so the highest-engagement content is recrawled
  // most aggressively. Buckets are tuned for a typical news/feed site:
  //   top quartile  → priority 0.9, daily
  //   middle        → priority 0.7, weekly
  //   bottom        → priority 0.5, monthly
  const sorted = [...entries].sort((a, b) => b.hotScore - a.hotScore);
  const topCutoff = sorted[Math.floor(sorted.length * 0.25)]?.hotScore ?? 0;
  const midCutoff = sorted[Math.floor(sorted.length * 0.75)]?.hotScore ?? 0;

  const articleEntries: MetadataRoute.Sitemap = entries.map((e) => {
    const isTop = e.hotScore >= topCutoff;
    const isMid = e.hotScore >= midCutoff;
    return {
      url: `${base}/story/${e.slug}`,
      lastModified: e.lastModified,
      changeFrequency: isTop ? "daily" : isMid ? "weekly" : "monthly",
      priority: isTop ? 0.9 : isMid ? 0.7 : 0.5,
    };
  });

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${base}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...articleEntries,
    ...tags.map((t) => ({
      url: `${base}/tag/${t.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
