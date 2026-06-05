/**
 * Publish news articles 014–018 to seed-posts (KC format + SEO/GEO).
 * Prerequisite: npx tsx scripts/sync-news-images.ts
 * Usage: npx tsx scripts/publish-news-014-018.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  NEWS_ARTICLE_ENRICHMENTS_014_018,
  buildEnrichedContentBatch014018,
} from "../src/lib/import/news-article-enrichments-014-018";
import type { NewsArticleEnrichment } from "../src/lib/import/news-article-enrichments";
import type { Post } from "../src/types";

const SEED_PATH = join(process.cwd(), "src/lib/data/seed-posts.ts");

const META: Record<
  string,
  { id: string; title: string; publishedAt: string; view_count: number }
> = {
  "bbc-top-10-world-cup-jerseys": {
    id: "68",
    title:
      "BBC Just Ranked the 10 Greatest World Cup Jerseys — #1 Is Pure Perfection",
    publishedAt: "2026-06-05T11:52:00.000Z",
    view_count: 16500,
  },
  "messi-ronaldo-world-cup-scoreboard": {
    id: "69",
    title: "Messi vs Ronaldo at the World Cup — The Final Score",
    publishedAt: "2026-06-05T05:42:00.000Z",
    view_count: 18800,
  },
  "mbappe-girlfriend-drama-petition-world-cup": {
    id: "70",
    title:
      "Mbappé's $200M Girlfriend Drama, 40M People Want Him Out, and He's On a Yacht",
    publishedAt: "2026-06-05T10:42:00.000Z",
    view_count: 20100,
  },
  "france-16-billion-squad-world-cup-preview": {
    id: "71",
    title: "France's $16 Billion Squad Has One Fatal Flaw — Themselves",
    publishedAt: "2026-06-05T12:29:00.000Z",
    view_count: 17200,
  },
  "neymar-calf-injury-last-world-cup": {
    id: "72",
    title:
      "Neymar Is a Legend. He's Also Injured Again — And This Might Be It.",
    publishedAt: "2026-06-04T12:56:00.000Z",
    view_count: 15900,
  },
};

function enrichmentToPost(e: NewsArticleEnrichment): Post {
  const m = META[e.slug];
  if (!m) throw new Error(`Missing META for ${e.slug}`);

  const content = buildEnrichedContentBatch014018(e);
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
  const slugs = NEWS_ARTICLE_ENRICHMENTS_014_018.map((e) => e.slug).join(", ");
  const header = `import type { Post } from "@/types";

/** Auto-generated — markdown import + merge + news enrich
 * Added news batch 014-018 (${slugs}) at ${new Date().toISOString()}
 * Count: ${posts.length}
 */

export const SEED_POSTS: Post[] = `;
  writeFileSync(SEED_PATH, `${header}${JSON.stringify(posts, null, 2)};\n`, "utf8");
}

function main(): void {
  const posts = loadSeedPosts();
  const newPosts = NEWS_ARTICLE_ENRICHMENTS_014_018.map(enrichmentToPost);

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
