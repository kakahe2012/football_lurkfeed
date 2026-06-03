/**
 * Restore hero_image / og_image from import baseline (2e11b37), keep current content.
 * npx tsx scripts/restore-hero-from-import.ts
 */
import { execSync } from "node:child_process";
import { SEED_POSTS } from "../src/lib/data/seed-posts";
import { writeSeedPostsFile } from "../src/lib/admin/seed-persist";
import type { Post } from "../src/types";

const oldSrc = execSync("git show 2e11b37:src/lib/data/seed-posts.ts", {
  encoding: "utf8",
});
const jsonMatch = oldSrc.match(/export const SEED_POSTS: Post\[\] = (\[[\s\S]*\]);/);
if (!jsonMatch) {
  console.error("Could not parse old seed-posts.ts");
  process.exit(1);
}
const oldPosts = JSON.parse(jsonMatch[1]) as Post[];
const heroBySlug = new Map(oldPosts.map((p) => [p.slug, p]));

let changed = 0;
const posts = SEED_POSTS.map((p) => {
  const old = heroBySlug.get(p.slug);
  if (!old) return p;
  if (p.hero_image === old.hero_image && p.og_image === old.og_image) return p;
  changed++;
  return {
    ...p,
    hero_image: old.hero_image,
    og_image: old.og_image ?? old.hero_image,
  };
});

const write = writeSeedPostsFile(posts);
if (!write.ok) {
  console.error(write.error);
  process.exit(1);
}
console.log(`Restored hero/og from import on ${changed} posts.`);
