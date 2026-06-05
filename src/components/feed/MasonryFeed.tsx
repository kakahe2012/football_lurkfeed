"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Post } from "@/types";
import { FeedCard, type FeedCardVariant } from "./FeedCard";
import { FeedAdCard } from "@/components/ads/FeedAdCard";
import { getSiteUrl } from "@/lib/utils";

const AD_EVERY = 9;
const PAGE_SIZE = 8;

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

export function MasonryFeed({ initialPosts }: MasonryFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const postsRef = useRef<Post[]>(initialPosts);
  const feedOffsetRef = useRef(initialPosts.length);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : getSiteUrl();

  postsRef.current = posts;
  hasMoreRef.current = hasMore;

  useEffect(() => {
    setPosts(initialPosts);
    postsRef.current = initialPosts;
    feedOffsetRef.current = initialPosts.length;
    setHasMore(true);
    hasMoreRef.current = true;
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
        `/api/feed?offset=${offset}&limit=${PAGE_SIZE}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error(`feed ${res.status}`);
      const data: FeedApiResponse = await res.json();
      const incoming = data.posts ?? [];

      if (incoming.length) {
        const ids = new Set(postsRef.current.map((p) => p.id));
        const fresh = incoming.filter((p) => !ids.has(p.id));
        if (fresh.length) {
          const next = [...postsRef.current, ...fresh];
          postsRef.current = next;
          setPosts(next);
        }
      }

      const nextOffset =
        typeof data.nextOffset === "number"
          ? data.nextOffset
          : offset + incoming.length;
      feedOffsetRef.current = nextOffset;

      const more =
        typeof data.hasMore === "boolean"
          ? data.hasMore
          : typeof data.total === "number"
            ? nextOffset < data.total
            : incoming.length >= PAGE_SIZE;
      setHasMore(more);
      hasMoreRef.current = more;
      consecutiveErrorsRef.current = 0;
    } catch {
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
  }, []);

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
