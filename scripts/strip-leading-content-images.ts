/**
 * One-shot: remove leading <img> from every seed post body (hero shown separately).
 * Usage: npx tsx scripts/strip-leading-content-images.ts
 */
import { SEED_POSTS } from "../src/lib/data/seed-posts";
import { writeSeedPostsFile } from "../src/lib/admin/seed-persist";
import { stripLeadingContentImage } from "../src/lib/sanitize";

let changed = 0;
const posts = SEED_POSTS.map((p) => {
  const next = stripLeadingContentImage(p.content);
  if (next !== p.content) {
    changed++;
    return { ...p, content: next };
  }
  return p;
});

const write = writeSeedPostsFile(posts);
if (!write.ok) {
  console.error("Write failed:", write.error);
  process.exit(1);
}

console.log(`Stripped leading image from ${changed} / ${posts.length} posts.`);
