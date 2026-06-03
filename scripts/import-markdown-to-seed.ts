/**
 * Import Markdown articles → seed-posts.ts (merge mode).
 * Usage: npx tsx scripts/import-markdown-to-seed.ts [dir] [--merge]
 */
import fs from "node:fs";
import path from "node:path";
import { parseMarkdownFile } from "../src/lib/import/parse-markdown";
import {
  fixContentImageUrls,
  resolveHeroImage,
} from "../src/lib/media/resolve-image";
import type { Post } from "../src/types";

const args = process.argv.slice(2);
const MERGE = args.includes("--merge");
const ARTICLES_DIR =
  args.find((a) => !a.startsWith("--")) ||
  "/Users/kaka/Documents/news-articles";

function findMdFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((n) => n.endsWith(".md"))
    .sort()
    .map((n) => path.join(dir, n));
}

function normalizeTitle(title: string): string {
  return title.trim().toLowerCase();
}

function engagementForIndex(i: number, total: number) {
  const rank = total - i;
  return {
    view_count: 2500 + rank * 1500,
    share_count: 220 + rank * 90,
    ctr_score: Math.round((0.055 + (i % 6) * 0.012) * 100) / 100,
  };
}

async function main() {
  const files = findMdFiles(ARTICLES_DIR);
  if (!files.length) {
    console.error(`No .md files in ${ARTICLES_DIR}`);
    process.exit(1);
  }

  console.log(`Found ${files.length} markdown files in ${ARTICLES_DIR}`);

  let posts: Post[] = [];
  const usedTitles = new Set<string>();
  const usedSlugs = new Set<string>();

  if (MERGE) {
    const { SEED_POSTS } = await import("../src/lib/data/seed-posts");
    posts = [...SEED_POSTS];
    for (const p of posts) {
      usedTitles.add(normalizeTitle(p.title));
      usedSlugs.add(p.slug);
    }
    console.log(`Merge mode: ${posts.length} existing posts`);
  }

  let skipped = 0;
  const added: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const parsed = parseMarkdownFile(filePath, "culture");
    const titleKey = normalizeTitle(parsed.title);

    if (usedTitles.has(titleKey)) {
      console.log(`  ⊘ skip duplicate title: ${parsed.title.slice(0, 50)}…`);
      skipped++;
      continue;
    }

    let slug = parsed.slug;
    if (usedSlugs.has(slug)) slug = `${slug}-news`;
    let n = 2;
    while (usedSlugs.has(slug)) slug = `${parsed.slug}-news-${n++}`;

    usedTitles.add(titleKey);
    usedSlugs.add(slug);

    const publishedAt =
      parsed.published_at ||
      new Date(Date.now() - (files.length - i) * 7200_000).toISOString();
    const eng = engagementForIndex(i, files.length);
    const hero = resolveHeroImage(parsed.hero_image, slug, "hero");
    const content = fixContentImageUrls(parsed.content, slug);

    posts.push({
      id: "0",
      title: parsed.title,
      slug,
      content,
      intro_hook: parsed.intro_hook,
      hero_image: hero,
      emotion_type: parsed.emotion_type,
      feed_type: "story",
      media_type: "article",
      tags: parsed.tags.length ? parsed.tags : ["worldcup2026"],
      seo_title: parsed.seo_title,
      seo_description: parsed.seo_description,
      og_image: hero,
      publish_status: "published",
      read_time_minutes: parsed.read_time_minutes,
      view_count: eng.view_count,
      share_count: eng.share_count,
      ctr_score: eng.ctr_score,
      created_at: publishedAt,
      published_at: publishedAt,
    });

    added.push(slug);
    console.log(`  ✓ ${slug}`);
  }

  posts.sort(
    (a, b) =>
      new Date(b.published_at || b.created_at).getTime() -
      new Date(a.published_at || a.created_at).getTime()
  );
  posts.forEach((p, idx) => {
    p.id = String(idx + 1);
  });

  const OUT_FILE = path.join(process.cwd(), "src/lib/data/seed-posts.ts");
  const header = `import type { Post } from "@/types";

/** Auto-generated — markdown import + merge
 * Generated: ${new Date().toISOString()}
 * Source: ${ARTICLES_DIR}
 * Count: ${posts.length}
 */

export const SEED_POSTS: Post[] = `;

  fs.writeFileSync(OUT_FILE, header + JSON.stringify(posts, null, 2) + ";\n", "utf8");

  if (skipped) console.log(`Skipped ${skipped} duplicate(s)`);
  console.log(`\nAdded ${added.length} posts. Total ${posts.length} → ${OUT_FILE}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
