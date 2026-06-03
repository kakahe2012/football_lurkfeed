/**
 * Apply KC-format enrichments (tags, FAQ, takeaways, SEO, hero) to imported news posts.
 *
 * Usage: npx tsx scripts/enrich-news-articles.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  NEWS_ARTICLE_ENRICHMENTS,
  buildEnrichedContent,
} from "../src/lib/import/news-article-enrichments";
import type { Post } from "../src/types";

const SEED_PATH = join(process.cwd(), "src/lib/data/seed-posts.ts");

function loadSeedPosts(): Post[] {
  const raw = readFileSync(SEED_PATH, "utf8");
  const match = raw.match(/export const SEED_POSTS: Post\[\] = (\[[\s\S]*\]);/);
  if (!match) throw new Error("Could not parse SEED_POSTS from seed-posts.ts");
  return JSON.parse(match[1]) as Post[];
}

function writeSeedPosts(posts: Post[], note: string): void {
  const header = `import type { Post } from "@/types";

/** Auto-generated — markdown import + merge + news enrich
 * ${note}
 * Count: ${posts.length}
 */

export const SEED_POSTS: Post[] = `;
  const body = JSON.stringify(posts, null, 2);
  writeFileSync(SEED_PATH, `${header}${body};\n`, "utf8");
}

function main(): void {
  const slugs = new Set(NEWS_ARTICLE_ENRICHMENTS.map((e) => e.slug));
  const posts = loadSeedPosts();
  let updated = 0;

  for (const e of NEWS_ARTICLE_ENRICHMENTS) {
    const idx = posts.findIndex((p) => p.slug === e.slug);
    if (idx < 0) {
      console.warn(`Skip (not found): ${e.slug}`);
      continue;
    }
    const post = posts[idx];
    posts[idx] = {
      ...post,
      content: buildEnrichedContent(e),
      intro_hook: e.lead.slice(0, 200) + (e.lead.length > 200 ? "…" : ""),
      tags: e.tags,
      seo_title: e.seo_title.slice(0, 70),
      seo_description:
        e.seo_description.length > 160
          ? `${e.seo_description.slice(0, 157).trim()}…`
          : e.seo_description,
      emotion_type: e.emotion_type,
      hero_image: e.hero_image,
      og_image: e.og_image,
      read_time_minutes: e.read_time_minutes,
    };
    updated++;
    console.log(`Enriched: ${e.slug}`);
  }

  const stamp = new Date().toISOString();
  writeSeedPosts(
    posts,
    `Enriched ${updated} news slugs at ${stamp}`
  );
  console.log(`Done. Updated ${updated}/${slugs.size} posts.`);
}

main();
