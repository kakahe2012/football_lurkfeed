import { NextRequest, NextResponse } from "next/server";
import { getPostsPaginated, type FeedSort } from "@/lib/data/posts";

export async function GET(request: NextRequest) {
  const page = parseInt(request.nextUrl.searchParams.get("page") || "0", 10);
  const pageSize = parseInt(request.nextUrl.searchParams.get("limit") || "8", 10);
  const sortParam = request.nextUrl.searchParams.get("sort") as FeedSort | null;
  const sort: FeedSort = sortParam === "newest" ? "newest" : "hot";
  const discover = request.nextUrl.searchParams.get("discover") === "1";
  const seenRaw = request.nextUrl.searchParams.get("seen") || "";
  const viewedIds = seenRaw
    ? seenRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const { posts, hasMore } = await getPostsPaginated(page, pageSize, sort, {
    discover,
    viewedIds,
  });
  return NextResponse.json({ posts, hasMore });
}
