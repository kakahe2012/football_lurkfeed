import type { Post } from "@/types";
import { sortPostsByHot } from "@/lib/feed/hot-score";

export type HomeFeedMode = "default" | "discover";

/**
 * First visit: time-decayed hot (newer + engagement rises).
 * Return visits: unseen first (still hot-ranked), then already-read.
 */
export function rankPostsForHomeFeed(
  posts: Post[],
  viewedIds: string[],
  mode: HomeFeedMode
): Post[] {
  const ranked = sortPostsByHot(posts);
  if (mode === "default" || viewedIds.length === 0) return ranked;

  const seen = new Set(viewedIds);
  const unseen = ranked.filter((p) => !seen.has(p.id));
  const seenPosts = ranked.filter((p) => seen.has(p.id));
  return [...unseen, ...seenPosts];
}
