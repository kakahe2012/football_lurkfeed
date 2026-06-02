import type { Post } from "@/types";

/** Time-decayed hot score — safe for client + server (no DB imports). */
const HOT_GRAVITY = 1.5;
const HOT_OFFSET_HOURS = 4;

export function calculateHotScore(post: Post): number {
  const ts = new Date(post.published_at || post.created_at).getTime();
  const ageHours = Math.max(0, (Date.now() - ts) / 3_600_000);
  const engagement =
    post.share_count * 8 + post.view_count * 1 + (post.ctr_score || 0) * 200;
  return (engagement + 1) / Math.pow(ageHours + HOT_OFFSET_HOURS, HOT_GRAVITY);
}

export function sortPostsByHot(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => calculateHotScore(b) - calculateHotScore(a)
  );
}
