"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { Post } from "@/types";
import { FeedCard, type FeedCardVariant } from "./FeedCard";
import { FeedAdCard } from "@/components/ads/FeedAdCard";
import { getSiteUrl } from "@/lib/utils";

const AD_EVERY = 9;
const PAGE_SIZE = 8;
const SSR_COLUMN_COUNT = 2;

interface MasonryFeedProps {
  initialPosts: Post[];
}

type FeedItem =
  | { type: "post"; key: string; post: Post; variant: FeedCardVariant }
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

/** Build a flat list with one ad after every AD_EVERY posts.
 * Item indices are stable across pagination so column assignment never shifts. */
function buildItems(posts: Post[]): FeedItem[] {
  const items: FeedItem[] = [];
  let postIndex = 0;
  let adIndex = 0;

  for (const post of posts) {
    items.push({
      type: "post",
      key: `post-${post.id}`,
      post,
      variant: getVariant(postIndex, post),
    });
    postIndex++;
    if (postIndex % AD_EVERY === 0) {
      items.push({ type: "ad", key: `ad-${adIndex}` });
      adIndex++;
    }
  }

  return items;
}

/** Detect column count via matchMedia. Returns SSR_COLUMN_COUNT during SSR
 * and updates on the client without causing re-distribution during scroll. */
function readColumnCount(): number {
  if (typeof window === "undefined" || !window.matchMedia) {
    return SSR_COLUMN_COUNT;
  }
  // Desktop with sidebar: xl 1280+ → 3, lg 1024-1279 → 2
  // Tablet (no sidebar): md 768-1023 → 3
  // Mobile / small: < 768 → 2
  if (window.matchMedia("(min-width: 1280px)").matches) return 3;
  if (window.matchMedia("(min-width: 1024px)").matches) return 2;
  if (window.matchMedia("(min-width: 768px)").matches) return 3;
  return 2;
}

function subscribeColumnCount(notify: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const queries = [
    window.matchMedia("(min-width: 1280px)"),
    window.matchMedia("(min-width: 1024px)"),
    window.matchMedia("(min-width: 768px)"),
  ];
  queries.forEach((q) => q.addEventListener("change", notify));
  return () => {
    queries.forEach((q) => q.removeEventListener("change", notify));
  };
}

function useColumnCount(): number {
  return useSyncExternalStore(
    subscribeColumnCount,
    readColumnCount,
    () => SSR_COLUMN_COUNT
  );
}

/** Distribute items round-robin to columns. Stable: a given item index always
 * lands in the same column for a given columnCount, so appending more items
 * never reflows existing cards. */
function distributeIntoColumns(
  items: FeedItem[],
  columnCount: number
): FeedItem[][] {
  const cols: FeedItem[][] = Array.from({ length: columnCount }, () => []);
  items.forEach((item, i) => {
    cols[i % columnCount].push(item);
  });
  return cols;
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
  const consecutiveErrorsRef = useRef(0);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadMoreRef = useRef<() => Promise<void>>(() => Promise.resolve());
  const columnCount = useColumnCount();
  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : getSiteUrl();

  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

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
          void loadMoreRef.current();
        }, delay);
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMoreRef.current = loadMore;
  }, [loadMore]);

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

  const items = useMemo(() => buildItems(posts), [posts]);
  const columns = useMemo(
    () => distributeIntoColumns(items, columnCount),
    [items, columnCount]
  );

  return (
    <div className="pb-20">
      <div
        className="feed-grid"
        style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}
      >
        {columns.map((col, ci) => (
          <div key={`col-${ci}`} className="feed-column">
            {col.map((item) =>
              item.type === "ad" ? (
                <FeedAdCard key={item.key} />
              ) : (
                <FeedCard
                  key={item.key}
                  post={item.post}
                  variant={item.variant}
                  siteUrl={siteUrl}
                  showLikeButton={false}
                />
              )
            )}
          </div>
        ))}
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
