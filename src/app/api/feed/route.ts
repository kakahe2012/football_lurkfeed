import { NextRequest, NextResponse } from "next/server";
import {
  getPostsPaginated,
  getSeedCatalog,
  type FeedSort,
} from "@/lib/data/posts";
import { rankPostsForHomeFeed } from "@/lib/feed/rank-feed";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const pageSize = parseInt(
    request.nextUrl.searchParams.get("limit") || "8",
    10
  );
  const offsetParam = request.nextUrl.searchParams.get("offset");
  const pageParam = request.nextUrl.searchParams.get("page");
  const offset =
    offsetParam != null
      ? parseInt(offsetParam, 10)
      : pageParam != null
        ? parseInt(pageParam, 10) * pageSize
        : 0;
  const sortParam = request.nextUrl.searchParams.get("sort") as FeedSort | null;
  const sort: FeedSort = sortParam === "newest" ? "newest" : "hot";
  const discover = request.nextUrl.searchParams.get("discover") === "1";
  const seenRaw = request.nextUrl.searchParams.get("seen") || "";
  const viewedIds = seenRaw
    ? seenRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const safeOffset = Number.isFinite(offset) ? offset : 0;
  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 8;

  try {
    const { posts, hasMore, nextOffset, total } = await getPostsPaginated(
      safeOffset,
      safePageSize,
      sort,
      { discover, viewedIds }
    );
    return NextResponse.json(
      { posts, hasMore, nextOffset, total },
      { headers: { "cache-control": "no-store" } }
    );
  } catch (err) {
    // Fail-open: never let the feed API 500 — the homepage relies on it
    // for infinite scroll. If anything in the data layer breaks, we still
    // serve a paginated slice from the bundled seed catalog so users can
    // keep scrolling.
    console.error("[/api/feed] fatal, falling back to seed:", err);
    const all = discover
      ? rankPostsForHomeFeed(getSeedCatalog(sort), viewedIds, "discover")
      : getSeedCatalog(sort);
    const start = Math.max(0, safeOffset);
    const slice = all.slice(start, start + safePageSize);
    const nextOffset = start + slice.length;
    return NextResponse.json(
      {
        posts: slice,
        hasMore: nextOffset < all.length,
        nextOffset,
        total: all.length,
      },
      { headers: { "cache-control": "no-store" } }
    );
  }
}
