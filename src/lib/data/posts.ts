import type { EmotionType, Post, PublishStatus } from "@/types";
import { SEED_POSTS } from "./seed-posts";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { resolveHeroImage } from "@/lib/media/resolve-image";

function normalizePost(row: Post): Post {
  const seed = row.slug || row.id;
  return {
    ...row,
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
 *
 * Inspired by the Hacker News / Reddit "hot" formula:
 *
 *   score = (engagement_signal) / (age_hours + GRAVITY_OFFSET) ^ GRAVITY
 *
 * Engagement weights shares > likes > views (shares are the strongest "this is
 * worth your friend's attention" signal). Gravity controls how fast old stories
 * fall off the feed: with gravity 1.5 and offset 4, a 24h-old post with the
 * same engagement as a 1h-old post ranks ~1/8 as high — old stories survive
 * but fresh ones get the spotlight.
 */
const HOT_GRAVITY = 1.5;
const HOT_OFFSET_HOURS = 4;

export function calculateHotScore(post: Post): number {
  const ts = new Date(post.published_at || post.created_at).getTime();
  const ageHours = Math.max(0, (Date.now() - ts) / 3_600_000);
  const engagement =
    post.share_count * 8 + post.view_count * 1 + (post.ctr_score || 0) * 200;
  return (engagement + 1) / Math.pow(ageHours + HOT_OFFSET_HOURS, HOT_GRAVITY);
}

function sortByHot(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => calculateHotScore(b) - calculateHotScore(a));
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
  sort: FeedSort = "hot"
): Promise<{ posts: Post[]; hasMore: boolean }> {
  const all = await getPublishedPosts(200, sort);
  const start = page * pageSize;
  const posts = all.slice(start, start + pageSize);
  return { posts, hasMore: start + pageSize < all.length };
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
