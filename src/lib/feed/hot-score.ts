import type { Post } from "@/types";

/** Time-decayed hot score — safe for client + server (no DB imports). */
const HOT_GRAVITY = 1.65;
const HOT_OFFSET_HOURS = 2;
/** Newer posts get up to this multiplier (linear decay over FRESH_BOOST_HOURS). */
const FRESH_BOOST_HOURS = 72;
const FRESH_BOOST_MAX = 2.25;

export function calculateHotScore(post: Post): number {
  const ts = new Date(post.published_at || post.created_at).getTime();
  const ageHours = Math.max(0, (Date.now() - ts) / 3_600_000);
  const engagement =
    post.share_count * 8 + post.view_count * 1 + (post.ctr_score || 0) * 200;
  const base =
    (engagement + 1) /
    Math.pow(ageHours + HOT_OFFSET_HOURS, HOT_GRAVITY);
  const freshRatio = Math.max(0, 1 - ageHours / FRESH_BOOST_HOURS);
  const freshnessMultiplier = 1 + (FRESH_BOOST_MAX - 1) * freshRatio;
  return base * freshnessMultiplier;
}

export function sortPostsByHot(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) => calculateHotScore(b) - calculateHotScore(a)
  );
}
