/**
 * Publish news articles 009–010 to seed-posts (KC format + SEO/GEO).
 * Prerequisite: npx tsx scripts/sync-news-images.ts
 * Usage: npx tsx scripts/publish-news-009-010.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  NEWS_ARTICLE_ENRICHMENTS_009_010,
  buildEnrichedContentBatch009010,
} from "../src/lib/import/news-article-enrichments-009-010";
import type { NewsArticleEnrichment } from "../src/lib/import/news-article-enrichments";
import type { Post } from "../src/types";

const SEED_PATH = join(process.cwd(), "src/lib/data/seed-posts.ts");

const META: Record<
  string,
  { id: string; title: string; publishedAt: string; view_count: number }
> = {
  "england-baked-beans-secret-weapon": {
    id: "60",
    title: "England's Secret World Cup Weapon? Baked Beans on Toast",
    publishedAt: "2026-06-04T06:29:00.000Z",
    view_count: 14200,
  },
  "england-100m-luxury-world-cup-hotel": {
    id: "61",
    title:
      "England's World Cup Base Is a $100 Million Resort With Three Pools and a Foie Gras Menu",
    publishedAt: "2026-06-03T08:08:00.000Z",
    view_count: 16800,
  },
};

function enrichmentToPost(e: NewsArticleEnrichment): Post {
  const m = META[e.slug];
  if (!m) throw new Error(`Missing META for ${e.slug}`);

  const content = buildEnrichedContentBatch009010(e);
  const hook =
    e.lead.length > 200 ? `${e.lead.slice(0, 197)}…` : e.lead;

  return {
    id: m.id,
    title: m.title,
    slug: e.slug,
    content,
    intro_hook: hook,
    hero_image: e.hero_image,
    emotion_type: e.emotion_type,
    feed_type: "story",
    media_type: "article",
    tags: e.tags,
    seo_title: e.seo_title,
    seo_description: e.seo_description,
    og_image: e.og_image ?? e.hero_image,
    publish_status: "published",
    read_time_minutes: e.read_time_minutes,
    view_count: m.view_count,
    share_count: Math.round(m.view_count * 0.07),
    ctr_score: 0.08,
    created_at: m.publishedAt,
    published_at: m.publishedAt,
  };
}

function loadSeedPosts(): Post[] {
  const raw = readFileSync(SEED_PATH, "utf8");
  const match = raw.match(/export const SEED_POSTS: Post\[\] = (\[[\s\S]*\]);/);
  if (!match) throw new Error("Could not parse SEED_POSTS");
  return JSON.parse(match[1]) as Post[];
}

function writeSeedPosts(posts: Post[]): void {
  const slugs = NEWS_ARTICLE_ENRICHMENTS_009_010.map((e) => e.slug).join(", ");
  const header = `import type { Post } from "@/types";

/** Auto-generated — markdown import + merge + news enrich
 * Added news batch 009-010 (${slugs}) at ${new Date().toISOString()}
 * Count: ${posts.length}
 */

export const SEED_POSTS: Post[] = `;
  writeFileSync(SEED_PATH, `${header}${JSON.stringify(posts, null, 2)};\n`, "utf8");
}

function main(): void {
  const posts = loadSeedPosts();
  const newPosts = NEWS_ARTICLE_ENRICHMENTS_009_010.map(enrichmentToPost);

  for (const post of newPosts) {
    const idx = posts.findIndex((p) => p.slug === post.slug);
    if (idx >= 0) {
      posts[idx] = post;
      console.log(`Updated: ${post.slug}`);
    } else {
      posts.unshift(post);
      console.log(`Added: ${post.slug} (id ${post.id})`);
    }
  }

  writeSeedPosts(posts);
  console.log(`Done. Total posts: ${posts.length}`);
}

main();
