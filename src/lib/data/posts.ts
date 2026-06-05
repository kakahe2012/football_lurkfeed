import type { EmotionType, Post, PublishStatus } from "@/types";
import { SEED_POSTS } from "./seed-posts";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { resolvePostCoverForFeed } from "@/lib/media/cover-image";
import { resolveHeroImage } from "@/lib/media/resolve-image";
import { stripLeadingContentImage } from "@/lib/sanitize";
import { calculateHotScore, sortPostsByHot } from "@/lib/feed/hot-score";

function normalizePost(row: Post): Post {
  const seed = row.slug || row.id;
  const cover = resolvePostCoverForFeed({
    hero_image: row.hero_image,
    slug: seed,
  });
  return {
    ...row,
    hero_image: cover,
    content: stripLeadingContentImage(row.content),
    og_image: row.og_image
      ? resolveHeroImage(row.og_image, `${seed}-og`, "hero")
      : cover,
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

const FEED_CATALOG_LIMIT = 500;

function sortByNewest(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    const tb = new Date(b.published_at || b.created_at).getTime();
    const ta = new Date(a.published_at || a.created_at).getTime();
    if (tb !== ta) return tb - ta;
    const ib = parseInt(b.id, 10);
    const ia = parseInt(a.id, 10);
    if (Number.isFinite(ib) && Number.isFinite(ia) && ib !== ia) return ib - ia;
    return b.id.localeCompare(a.id);
  });
}

/**
 * Sync catalog from bundled seed-posts. Safe to call from any context
 * (route handlers, edge, build) without touching cookies/Supabase.
 */
export function getSeedCatalog(sort: FeedSort = "hot"): Post[] {
  const seedPublished = SEED_POSTS.filter(
    (p) => p.publish_status === "published"
  ).map(normalizePost);
  return sort === "hot" ? sortByHot(seedPublished) : sortByNewest(seedPublished);
}

/**
 * Full published catalog for feeds. Merges seed-posts (site source of truth)
 * with Supabase rows so pagination is not capped by a partial DB import.
 *
 * Always falls back to the seed catalog if anything in the Supabase path
 * throws — Route Handlers must never 500 because of the database client.
 */
export async function getPublishedCatalog(
  sort: FeedSort = "hot"
): Promise<Post[]> {
  const seedRanked = getSeedCatalog(sort);

  try {
    const supabase = await createServerSupabaseClient();
    if (!supabase) return seedRanked;

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("publish_status", "published")
      .order("published_at", { ascending: false })
      .limit(FEED_CATALOG_LIMIT);

    if (error || !data?.length) return seedRanked;

    const bySlug = new Map(
      SEED_POSTS.filter((p) => p.publish_status === "published")
        .map(normalizePost)
        .map((p) => [p.slug, p] as const)
    );
    for (const row of data) {
      bySlug.set(row.slug as string, mapRow(row as Record<string, unknown>));
    }
    const merged = [...bySlug.values()];
    return sort === "hot" ? sortByHot(merged) : sortByNewest(merged);
  } catch (err) {
    console.error("[getPublishedCatalog] falling back to seed:", err);
    return seedRanked;
  }
}

/**
 * Default homepage feed — sorted by published_at descending (newest first).
 */
export async function getPublishedPosts(
  limit = 50,
  sort: FeedSort = "newest"
): Promise<Post[]> {
  const ranked = await getPublishedCatalog(sort);
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
  offset: number,
  pageSize = 8,
  sort: FeedSort = "newest"
): Promise<{
  posts: Post[];
  hasMore: boolean;
  nextOffset: number;
  total: number;
}> {
  let all: Post[];
  try {
    all = await getPublishedCatalog(sort);
  } catch (err) {
    console.error("[getPostsPaginated] catalog failed, using seed:", err);
    all = getSeedCatalog(sort);
  }
  const start = Math.max(0, offset);
  const posts = all.slice(start, start + pageSize);
  const nextOffset = start + posts.length;
  return {
    posts,
    hasMore: nextOffset < all.length,
    nextOffset,
    total: all.length,
  };
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
