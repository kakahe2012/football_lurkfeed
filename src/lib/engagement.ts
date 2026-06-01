import type { Post } from "@/types";

const MIN_LIKES = 99;
const MAX_LIKES = 99_900;

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Weighted like count:
 * - Base likes: 99 ~ 99.9k (deterministic by slug/id)
 * - Real signal: from share_count + view_count
 * - Time weight: recent posts get slightly higher lift
 */
export function calculateWeightedLikes(post: Post): number {
  const range = MAX_LIKES - MIN_LIKES + 1;
  const seed = hashString(`${post.slug}-${post.id}`);
  const baseLikes = MIN_LIKES + (seed % range);

  const publishTs = new Date(post.published_at || post.created_at).getTime();
  const daysSincePublish = Math.max(
    0,
    (Date.now() - publishTs) / (1000 * 60 * 60 * 24)
  );
  const freshnessWeight = Math.max(0.55, 1.25 - daysSincePublish / 30);

  const realLikeSignal = post.share_count * 10 + post.view_count * 0.06;

  const weighted =
    baseLikes * 0.6 + realLikeSignal * 0.3 + baseLikes * 0.1 * freshnessWeight;

  return Math.min(MAX_LIKES, Math.max(MIN_LIKES, Math.round(weighted)));
}

export function formatLikeCount(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }
  return `${value}`;
}
