"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Post } from "@/types";
import { FeedCard, type FeedCardVariant } from "./FeedCard";
import { FeedAdCard } from "@/components/ads/FeedAdCard";
import { getSiteUrl } from "@/lib/utils";
import {
  getViewedPostIds,
  markHomeVisit,
  shouldUseDiscoverFeed,
} from "@/lib/feed/viewed-posts";

const AD_EVERY = parseInt(process.env.NEXT_PUBLIC_FEED_AD_EVERY || "6", 10);
const PAGE_SIZE = 8;
const INITIAL_SSR_COUNT = 12;

interface MasonryFeedProps {
  initialPosts: Post[];
}

type FeedItem =
  | { type: "post"; post: Post; variant: FeedCardVariant }
  | { type: "ad"; key: string };

type FeedApiResponse = {
  posts?: Post[];
  hasMore?: boolean;
  nextOffset?: number;
  total?: number;
};

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

function applyHasMore(
  data: FeedApiResponse,
  loadedCount: number
): boolean {
  if (typeof data.hasMore === "boolean") return data.hasMore;
  if (typeof data.total === "number") return loadedCount < data.total;
  return true;
}

export function MasonryFeed({ initialPosts }: MasonryFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showDiscoverHint, setShowDiscoverHint] = useState(false);
  const viewedIdsRef = useRef<string[]>([]);
  const postsRef = useRef<Post[]>(initialPosts);
  const feedOffsetRef = useRef(initialPosts.length);
  const discoverModeRef = useRef(false);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : getSiteUrl();

  postsRef.current = posts;
  hasMoreRef.current = hasMore;

  const mergePosts = useCallback((incoming: Post[]) => {
    if (!incoming.length) return postsRef.current;
    const ids = new Set(postsRef.current.map((p) => p.id));
    const fresh = incoming.filter((p) => !ids.has(p.id));
    if (!fresh.length) return postsRef.current;
    const next = [...postsRef.current, ...fresh];
    postsRef.current = next;
    setPosts(next);
    return next;
  }, []);

  const applyFeedPage = useCallback(
    (data: FeedApiResponse, offsetUsed: number) => {
      const incoming = data.posts ?? [];
      const next = mergePosts(incoming);
      const nextOffset =
        typeof data.nextOffset === "number"
          ? data.nextOffset
          : offsetUsed + incoming.length;
      feedOffsetRef.current = nextOffset;
      const more = applyHasMore(data, next.length);
      setHasMore(more);
      hasMoreRef.current = more;
    },
    [mergePosts]
  );

  useEffect(() => {
    const viewed = getViewedPostIds();
    viewedIdsRef.current = viewed;
    const discover = shouldUseDiscoverFeed();
    discoverModeRef.current = discover;
    setShowDiscoverHint(discover && viewed.length > 0);
    markHomeVisit();

    if (!discover) {
      setPosts(initialPosts);
      postsRef.current = initialPosts;
      feedOffsetRef.current = initialPosts.length;
      setHasMore(true);
      hasMoreRef.current = true;
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(buildFeedQuery(0, true, viewed, INITIAL_SSR_COUNT));
        const data: FeedApiResponse = await res.json();
        if (cancelled) return;
        if (data.posts?.length) {
          postsRef.current = data.posts;
          setPosts(data.posts);
          feedOffsetRef.current =
            typeof data.nextOffset === "number"
              ? data.nextOffset
              : data.posts.length;
          const more = applyHasMore(data, data.posts.length);
          setHasMore(more);
          hasMoreRef.current = more;
        } else {
          setPosts(initialPosts);
          postsRef.current = initialPosts;
          feedOffsetRef.current = initialPosts.length;
          setHasMore(true);
          hasMoreRef.current = true;
        }
      } catch {
        if (!cancelled) {
          setPosts(initialPosts);
          postsRef.current = initialPosts;
          feedOffsetRef.current = initialPosts.length;
          setHasMore(true);
          hasMoreRef.current = true;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialPosts]);

  const consecutiveErrorsRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    const offset = feedOffsetRef.current;
    try {
      const res = await fetch(
        buildFeedQuery(offset, discoverModeRef.current, viewedIdsRef.current),
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error(`feed ${res.status}`);
      const data: FeedApiResponse = await res.json();
      applyFeedPage(data, offset);
      consecutiveErrorsRef.current = 0;
    } catch {
      // Transient errors should not end the feed. Keep hasMore=true and
      // schedule a retry — the IntersectionObserver only fires on state
      // change so we cannot rely on it to re-trigger while the sentinel
      // is still in view.
      consecutiveErrorsRef.current += 1;
      if (consecutiveErrorsRef.current >= 5) {
        setHasMore(false);
        hasMoreRef.current = false;
      } else {
        const delay = Math.min(
          800 * Math.pow(2, consecutiveErrorsRef.current - 1),
          8000
        );
        if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
        retryTimerRef.current = setTimeout(() => {
          retryTimerRef.current = null;
          loadMore();
        }, delay);
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [applyFeedPage]);

  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

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
              showLikeButton={false}
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
