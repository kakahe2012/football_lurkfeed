import type { EmotionType, Post, PublishStatus } from "@/types";
import { SEED_POSTS } from "./seed-posts";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { resolveHeroImage } from "@/lib/media/resolve-image";
import { stripLeadingContentImage } from "@/lib/sanitize";
import { rankPostsForHomeFeed } from "@/lib/feed/rank-feed";
import { calculateHotScore, sortPostsByHot } from "@/lib/feed/hot-score";

function normalizePost(row: Post): Post {
  const seed = row.slug || row.id;
  return {
    ...row,
    content: stripLeadingContentImage(row.content),
    hero_image: resolveHeroImage(row.hero_image, seed, "card"),
    og_image: row.og_image
      ? resolveHeroImage(row.og_image, `${seed}-og`, "hero")
      : undefined,
  };
}

function mapRow(row: Record<string, unknown>): Post {
  const post: Post = {
    id: row.id as string,
    title: row.title as string,
    slug: row.slug as string,
    content: row.content as string,
    intro_hook: (row.intro_hook as string) || "",
    hero_image: (row.hero_image as string) || "",
    emotion_type: row.emotion_type as EmotionType,
    feed_type: row.feed_type as Post["feed_type"],
    media_type: (row.media_type as Post["media_type"]) || "article",
    video_url: (row.video_url as string | undefined) || undefined,
    tags: (row.tags as string[]) || [],
    seo_title: (row.seo_title as string) || "",
    seo_description: (row.seo_description as string) || "",
    og_image: row.og_image as string | undefined,
    publish_status: row.publish_status as PublishStatus,
    read_time_minutes: (row.read_time_minutes as number) || 3,
    view_count: (row.view_count as number) || 0,
    share_count: (row.share_count as number) || 0,
    ctr_score: (row.ctr_score as number) || 0,
    created_at: row.created_at as string,
    published_at: row.published_at as string | undefined,
  };
  return normalizePost(post);
}

/**
 * Time-decayed hot score for ranking the homepage feed.
 * Implementation lives in @/lib/feed/hot-score (shared client + server).
 */
export { calculateHotScore } from "@/lib/feed/hot-score";

function sortByHot(posts: Post[]): Post[] {
  return sortPostsByHot(posts);
}

export type FeedSort = "hot" | "newest";

/**
 * Default homepage feed. `sort = "hot"` blends recency with engagement so
 * fresh popular stories rise; `sort = "newest"` is pure publish time.
 */
export async function getPublishedPosts(
  limit = 50,
  sort: FeedSort = "hot"
): Promise<Post[]> {
  const supabase = await createServerSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("publish_status", "published")
      .order("published_at", { ascending: false })
      .limit(Math.max(limit, 200));

    if (!error && data?.length) {
      const all = data.map(mapRow);
      const ranked = sort === "hot" ? sortByHot(all) : all;
      return ranked.slice(0, limit);
    }
  }

  const seed = SEED_POSTS.filter((p) => p.publish_status === "published").map(
    normalizePost
  );
  const ranked = sort === "hot" ? sortByHot(seed) : seed;
  return ranked.slice(0, limit);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = await createServerSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("publish_status", "published")
      .single();

    if (!error && data) return mapRow(data);
  }

  const found = SEED_POSTS.find((p) => p.slug === slug);
  return found ? normalizePost(found) : null;
}

export async function getPostsPaginated(
  page: number,
  pageSize = 8,
  sort: FeedSort = "hot",
  options?: { discover?: boolean; viewedIds?: string[] }
): Promise<{ posts: Post[]; hasMore: boolean }> {
  const all = await getPublishedPosts(200, sort);
  const ranked =
    options?.discover
      ? rankPostsForHomeFeed(all, options.viewedIds ?? [], "discover")
      : all;
  const start = page * pageSize;
  const posts = ranked.slice(start, start + pageSize);
  return { posts, hasMore: start + pageSize < ranked.length };
}

export async function getRelatedPosts(
  current: Post,
  limit = 4
): Promise<Post[]> {
  const all = await getPublishedPosts(100);
  return all
    .filter((p) => p.id !== current.id)
    .sort((a, b) => {
      const aMatch = a.emotion_type === current.emotion_type ? 2 : 0;
      const bMatch = b.emotion_type === current.emotion_type ? 2 : 0;
      const aTag = a.tags.some((t) => current.tags.includes(t)) ? 1 : 0;
      const bTag = b.tags.some((t) => current.tags.includes(t)) ? 1 : 0;
      return bMatch + bTag - (aMatch + aTag);
    })
    .slice(0, limit);
}

export async function getAllSlugs(): Promise<string[]> {
  const posts = await getPublishedPosts(500);
  return posts.map((p) => p.slug);
}

/** Lightweight rows used by sitemap.xml — slug + last-mod timestamp + hot score. */
export async function getSitemapEntries(): Promise<
  { slug: string; lastModified: Date; hotScore: number }[]
> {
  const posts = await getPublishedPosts(500);
  return posts.map((p) => ({
    slug: p.slug,
    lastModified: new Date(p.published_at || p.created_at),
    hotScore: calculateHotScore(p),
  }));
}

/** Top posts from the last N days by view_count (falls back to all-time if too few) */
export async function getTrendingPostsRecent(
  days = 3,
  limit = 10
): Promise<Post[]> {
  const all = await getPublishedPosts(200);
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  const recent = all.filter((p) => {
    const t = new Date(p.published_at || p.created_at).getTime();
    return t >= cutoff;
  });

  const pool = recent.length >= 3 ? recent : all;

  return [...pool]
    .sort((a, b) => b.view_count - a.view_count)
    .slice(0, limit);
}
