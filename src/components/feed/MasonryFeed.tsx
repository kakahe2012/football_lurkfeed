"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Post } from "@/types";
import { FeedCard, type FeedCardVariant } from "./FeedCard";
import { FeedAdCard } from "@/components/ads/FeedAdCard";
import { getSiteUrl } from "@/lib/utils";
import { rankPostsForHomeFeed } from "@/lib/feed/rank-feed";
import {
  getViewedPostIds,
  markHomeVisit,
  shouldUseDiscoverFeed,
} from "@/lib/feed/viewed-posts";

const AD_EVERY = parseInt(process.env.NEXT_PUBLIC_FEED_AD_EVERY || "6", 10);
const PAGE_SIZE = 8;

interface MasonryFeedProps {
  initialPosts: Post[];
}

type FeedItem =
  | { type: "post"; post: Post; variant: FeedCardVariant }
  | { type: "ad"; key: string };

function getVariant(index: number, post: Post): FeedCardVariant {
  if (index === 0 || index % 8 === 0) return "featured";
  if (post.feed_type === "quick_bite" || index % 5 === 4) return "snippet";
  return "card";
}

function buildItems(posts: Post[]): FeedItem[] {
  const items: FeedItem[] = [];
  let postIndex = 0;

  posts.forEach((post) => {
    items.push({ type: "post", post, variant: getVariant(postIndex, post) });
    postIndex++;
    if (postIndex > 0 && postIndex % AD_EVERY === 0) {
      items.push({ type: "ad", key: `ad-${postIndex}` });
    }
  });

  return items;
}

function buildFeedQuery(
  offset: number,
  discover: boolean,
  viewedIds: string[],
  limit = PAGE_SIZE
): string {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
  });
  if (discover) {
    params.set("discover", "1");
    if (viewedIds.length) params.set("seen", viewedIds.join(","));
  }
  return `/api/feed?${params.toString()}`;
}

export function MasonryFeed({ initialPosts }: MasonryFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [discoverMode, setDiscoverMode] = useState(false);
  const [showDiscoverHint, setShowDiscoverHint] = useState(false);
  const viewedIdsRef = useRef<string[]>([]);
  const postsRef = useRef<Post[]>(initialPosts);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : getSiteUrl();

  postsRef.current = posts;
  hasMoreRef.current = hasMore;

  useEffect(() => {
    const viewed = getViewedPostIds();
    viewedIdsRef.current = viewed;
    const discover = shouldUseDiscoverFeed();
    setDiscoverMode(discover);
    setShowDiscoverHint(discover && viewed.length > 0);
    markHomeVisit();

    if (!discover) {
      setPosts(initialPosts);
      postsRef.current = initialPosts;
      setHasMore(true);
      hasMoreRef.current = true;
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(buildFeedQuery(0, true, viewed, 12));
        const data = await res.json();
        if (cancelled) return;
        if (data.posts?.length) {
          setPosts(data.posts);
          postsRef.current = data.posts;
          setHasMore(data.hasMore ?? false);
          hasMoreRef.current = data.hasMore ?? false;
        } else {
          const ranked = rankPostsForHomeFeed(initialPosts, viewed, "discover");
          setPosts(ranked);
          postsRef.current = ranked;
          setHasMore(ranked.length > PAGE_SIZE);
          hasMoreRef.current = ranked.length > PAGE_SIZE;
        }
      } catch {
        if (!cancelled) {
          const ranked = rankPostsForHomeFeed(initialPosts, viewed, "discover");
          setPosts(ranked);
          postsRef.current = ranked;
          setHasMore(ranked.length > PAGE_SIZE);
          hasMoreRef.current = ranked.length > PAGE_SIZE;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialPosts]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
      const offset = postsRef.current.length;
      const res = await fetch(
        buildFeedQuery(offset, discoverMode, viewedIdsRef.current)
      );
      const data = await res.json();
      const incoming: Post[] = data.posts ?? [];
      const ids = new Set(postsRef.current.map((p) => p.id));
      const fresh = incoming.filter((p) => !ids.has(p.id));

      if (fresh.length > 0) {
        const next = [...postsRef.current, ...fresh];
        postsRef.current = next;
        setPosts(next);
      }

      const more = Boolean(data.hasMore);
      const stuck = more && fresh.length === 0;
      setHasMore(stuck ? false : more);
      hasMoreRef.current = stuck ? false : more;
    } catch {
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [discoverMode]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) loadMore();
      },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore]);

  const items = buildItems(posts);

  return (
    <div className="pb-20">
      {showDiscoverHint && (
        <p className="mb-3 px-0.5 text-xs text-stone-500">
          Showing stories you haven&apos;t read yet
        </p>
      )}
      <div className="masonry-columns">
        {items.map((item) =>
          item.type === "ad" ? (
            <FeedAdCard key={item.key} />
          ) : (
            <FeedCard
              key={item.post.id}
              post={item.post}
              variant={item.variant}
              siteUrl={siteUrl}
            />
          )
        )}
      </div>
      <div ref={sentinelRef} className="flex flex-col items-center gap-2 py-10">
        {loading && (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-stone-300 border-t-teal-600" />
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-sm text-stone-400">You&apos;re all caught up</p>
        )}
      </div>
    </div>
  );
}
