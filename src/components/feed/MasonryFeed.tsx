"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Post } from "@/types";
import { FeedCard, type FeedCardVariant } from "./FeedCard";
import { FeedAdCard } from "@/components/ads/FeedAdCard";
import { getSiteUrl } from "@/lib/utils";

const AD_EVERY = parseInt(process.env.NEXT_PUBLIC_FEED_AD_EVERY || "6", 10);

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

export function MasonryFeed({ initialPosts }: MasonryFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : getSiteUrl();

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/feed?page=${page}`);
      const data = await res.json();
      if (data.posts?.length) {
        setPosts((prev) => {
          const ids = new Set(prev.map((p) => p.id));
          const fresh = data.posts.filter((p: Post) => !ids.has(p.id));
          return [...prev, ...fresh];
        });
        setPage((p) => p + 1);
      }
      setHasMore(data.hasMore ?? false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    setPosts(initialPosts);
    setPage(1);
    setHasMore(true);
  }, [initialPosts]);

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
