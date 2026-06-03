/**
 * Copy local news images into public/uploads/articles/{slug}/
 *
 * Looks in:
 *   /Users/kaka/Documents/news-articles/images
 *   /Users/kaka/Documents/news-articles/image  (alternate folder name)
 *
 * Usage: npx tsx scripts/sync-news-images.ts
 */
import fs from "node:fs";
import path from "node:path";
import { slugFromNewsImageFilename } from "../src/lib/import/news-images";

const HOME = "/Users/kaka/Documents/news-articles";
const SOURCE_DIRS = [
  path.join(HOME, "images"),
  path.join(HOME, "image"),
];
const OUT_ROOT = path.join(process.cwd(), "public", "uploads", "articles");

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

function main(): void {
  const files: { src: string; name: string }[] = [];

  for (const dir of SOURCE_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!IMAGE_EXT.test(name)) continue;
      files.push({ src: path.join(dir, name), name });
    }
  }

  if (files.length === 0) {
    console.error(
      "No images found. Expected files under news-articles/images or news-articles/image"
    );
    process.exit(1);
  }

  let copied = 0;
  const bySlug = new Map<string, string[]>();

  for (const { src, name } of files) {
    const slug = slugFromNewsImageFilename(name);
    if (!slug) {
      console.warn(`Skip (unknown prefix): ${name}`);
      continue;
    }
    const destDir = path.join(OUT_ROOT, slug);
    fs.mkdirSync(destDir, { recursive: true });
    const dest = path.join(destDir, name);
    fs.copyFileSync(src, dest);
    copied++;
    const list = bySlug.get(slug) ?? [];
    list.push(name);
    bySlug.set(slug, list);
    console.log(`Copied: ${name} → ${slug}/`);
  }

  console.log(`\nDone. ${copied} file(s) → public/uploads/articles/`);
  for (const [slug, names] of [...bySlug.entries()].sort()) {
    console.log(`  ${slug}: ${names.sort().join(", ")}`);
  }
}

main();
