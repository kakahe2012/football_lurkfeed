/**
 * One-shot: parse all KC English HTML under a folder → seed-posts.ts
 * Usage: npx tsx scripts/import-articles-to-seed.ts [articlesDir]
 */
import fs from "node:fs";
import path from "node:path";
import { parseArticleHtml } from "../src/lib/import/parse-html";
import {
  fixContentImageUrls,
  resolveHeroImage,
} from "../src/lib/media/resolve-image";
import type { Post } from "../src/types";

const ARTICLES_DIR =
  process.argv[2] || "/Users/kaka/Downloads/articles";
const OUT_FILE = path.join(
  process.cwd(),
  "src/lib/data/seed-posts.ts"
);

function findEnglishHtmlFiles(dir: string): string[] {
  const out: string[] = [];
  function walk(d: string) {
    if (!fs.existsSync(d)) return;
    for (const name of fs.readdirSync(d)) {
      const full = path.join(d, name);
      const st = fs.statSync(full);
      if (st.isDirectory()) {
        walk(full);
        continue;
      }
      if (!/\.html$/i.test(name)) continue;
      if (/_cn\.html$/i.test(name)) continue;
      if (/_eng\.html$/i.test(name) || /_en\.html$/i.test(name)) {
        out.push(full);
      }
    }
  }
  walk(dir);
  return out.sort();
}

function engagementForIndex(i: number, total: number) {
  // Modest starter metrics — hot-score still works; real analytics will replace.
  const rank = total - i;
  return {
    view_count: 3000 + rank * 1800,
    share_count: 280 + rank * 120,
    ctr_score: Math.round((0.06 + (i % 7) * 0.015) * 100) / 100,
  };
}

function main() {
  const files = findEnglishHtmlFiles(ARTICLES_DIR);
  if (!files.length) {
    console.error(`No English HTML found under ${ARTICLES_DIR}`);
    process.exit(1);
  }

  console.log(`Found ${files.length} English HTML files`);

  const posts: Post[] = [];
  const usedSlugs = new Set<string>();

  for (let i = 0; i < files.length; i++) {
    const filePath = files[i];
    const filename = path.basename(filePath);
    const html = fs.readFileSync(filePath, "utf8");
    const parsed = parseArticleHtml(html, filename, "culture");

    let slug = parsed.slug;
    if (usedSlugs.has(slug)) slug = `${slug}-${i + 1}`;
    usedSlugs.add(slug);

    const publishedAt =
      parsed.published_at ||
      new Date(Date.now() - (files.length - i) * 3600_000).toISOString();
    const eng = engagementForIndex(i, files.length);

    const hero = resolveHeroImage(parsed.hero_image, slug, "hero");
    const content = fixContentImageUrls(parsed.content, slug);

    posts.push({
      id: String(i + 1),
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

    console.log(`  ✓ ${slug} — ${parsed.title.slice(0, 60)}…`);
  }

  // Newest first for seed ordering (hot sort re-applies on read)
  posts.sort(
    (a, b) =>
      new Date(b.published_at || b.created_at).getTime() -
      new Date(a.published_at || a.created_at).getTime()
  );
  posts.forEach((p, idx) => {
    p.id = String(idx + 1);
  });

  const header = `import type { Post } from "@/types";

/** Auto-generated from KC HTML imports — do not hand-edit. Re-run:
 *  npx tsx scripts/import-articles-to-seed.ts /path/to/articles
 * Generated: ${new Date().toISOString()}
 * Source: ${ARTICLES_DIR}
 * Count: ${posts.length}
 */

export const SEED_POSTS: Post[] = `;

  const body = JSON.stringify(posts, null, 2);
  fs.writeFileSync(OUT_FILE, header + body + ";\n", "utf8");
  console.log(`\nWrote ${posts.length} posts → ${OUT_FILE}`);
}

main();
