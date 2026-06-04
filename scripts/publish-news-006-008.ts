/**
 * Publish news articles 006–008 to seed-posts (KC format + SEO/GEO).
 * Prerequisite: npx tsx scripts/sync-news-images.ts
 * Usage: npx tsx scripts/publish-news-006-008.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  NEWS_ARTICLE_ENRICHMENTS_006_008,
  buildEnrichedContentBatch2,
} from "../src/lib/import/news-article-enrichments-006-008";
import type { NewsArticleEnrichment } from "../src/lib/import/news-article-enrichments";
import type { Post } from "../src/types";

const SEED_PATH = join(process.cwd(), "src/lib/data/seed-posts.ts");

const META: Record<
  string,
  { id: string; title: string; publishedAt: string; view_count: number }
> = {
  "spain-billion-euro-squad-world-cup": {
    id: "57",
    title:
      "Spain Roll Into the World Cup With a $1.4 Billion Squad — And One Glaring Flaw",
    publishedAt: "2026-06-04T06:21:00.000Z",
    view_count: 12400,
  },
  "england-world-cup-wealth-list": {
    id: "58",
    title:
      "England's 26-Man World Cup Squad Is Worth Over $600 Million — Here's Who's Actually Rich",
    publishedAt: "2026-06-04T08:08:00.000Z",
    view_count: 18700,
  },
  "who-wins-world-cup-predictions": {
    id: "59",
    title:
      "Wall Street, Supercomputers, and a German Economist Walk Into a Bar — Who Actually Wins the 2026 World Cup?",
    publishedAt: "2026-06-03T15:04:00.000Z",
    view_count: 22100,
  },
};

function enrichmentToPost(e: NewsArticleEnrichment): Post {
  const m = META[e.slug];
  if (!m) throw new Error(`Missing META for ${e.slug}`);

  const content = buildEnrichedContentBatch2(e);
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
  const slugs = NEWS_ARTICLE_ENRICHMENTS_006_008.map((e) => e.slug).join(", ");
  const header = `import type { Post } from "@/types";

/** Auto-generated — markdown import + merge + news enrich
 * Added news batch 006-008 (${slugs}) at ${new Date().toISOString()}
 * Count: ${posts.length}
 */

export const SEED_POSTS: Post[] = `;
  writeFileSync(SEED_PATH, `${header}${JSON.stringify(posts, null, 2)};\n`, "utf8");
}

function main(): void {
  const posts = loadSeedPosts();
  const newPosts = NEWS_ARTICLE_ENRICHMENTS_006_008.map(enrichmentToPost);

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
