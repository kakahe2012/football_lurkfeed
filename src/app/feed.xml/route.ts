import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/data/posts";
import { getSiteUrl } from "@/lib/utils";

/**
 * RSS 2.0 feed at /feed.xml.
 *
 * Why we ship this in addition to /llms.txt and /sitemap.xml:
 *   - Several AI crawlers (Bytespider, Applebot, news aggregators) prioritize
 *     RSS for "what's new today" detection — sitemap is for full discovery,
 *     RSS is for delta updates.
 *   - Lets fans subscribe in Feedly / Inoreader, which gives us free
 *     long-tail traffic.
 *
 * Cache 5 min: news consumers expect freshness but we don't want to thrash
 * Supabase for every robot fetch.
 */

export const revalidate = 300;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const base = getSiteUrl();
  const posts = await getPublishedPosts(40, "newest");
  const buildDate = new Date().toUTCString();

  const items = posts
    .map((p) => {
      const url = `${base}/story/${p.slug}`;
      const pubDate = new Date(p.published_at || p.created_at).toUTCString();
      return `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(p.intro_hook || p.seo_description || "")}</description>
      ${(p.tags || []).map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
      ${p.hero_image ? `<enclosure url="${escapeXml(p.hero_image)}" type="image/jpeg" />` : ""}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>LurkFeed Football</title>
    <link>${base}</link>
    <description>World Cup gossip, drama and culture for new fans.</description>
    <language>en-US</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=1800",
    },
  });
}
