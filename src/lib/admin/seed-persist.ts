import fs from "node:fs";
import path from "node:path";
import type { Post } from "@/types";

const SEED_FILE = path.join(process.cwd(), "src/lib/data/seed-posts.ts");

export type SeedPostPatch = Partial<
  Pick<Post, "hero_image" | "og_image" | "content" | "publish_status">
>;

export function canWriteSeedFile(): boolean {
  try {
    fs.accessSync(SEED_FILE, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

export async function loadSeedPosts(): Promise<Post[]> {
  const mod = await import("@/lib/data/seed-posts");
  return [...mod.SEED_POSTS];
}

export function writeSeedPostsFile(posts: Post[]): { ok: boolean; error?: string } {
  try {
    const header = `import type { Post } from "@/types";

/** Updated via admin — ${new Date().toISOString()}
 * Count: ${posts.length}
 */

export const SEED_POSTS: Post[] = `;
    fs.writeFileSync(
      SEED_FILE,
      header + JSON.stringify(posts, null, 2) + ";\n",
      "utf8"
    );
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "write failed";
    return { ok: false, error: msg };
  }
}

export async function updateSeedPost(
  id: string,
  patch: SeedPostPatch
): Promise<{ post: Post | null; write: { ok: boolean; error?: string } }> {
  const posts = await loadSeedPosts();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx < 0) return { post: null, write: { ok: false, error: "not found" } };

  const next = { ...posts[idx], ...patch };
  if (patch.hero_image && !patch.og_image) {
    next.og_image = patch.hero_image;
  }
  posts[idx] = next;

  const write = writeSeedPostsFile(posts);
  return { post: next, write };
}
