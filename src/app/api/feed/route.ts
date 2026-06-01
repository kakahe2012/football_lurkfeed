import { NextRequest, NextResponse } from "next/server";
import { getPostsPaginated, type FeedSort } from "@/lib/data/posts";

export async function GET(request: NextRequest) {
  const page = parseInt(request.nextUrl.searchParams.get("page") || "0", 10);
  const sortParam = request.nextUrl.searchParams.get("sort") as FeedSort | null;
  const sort: FeedSort = sortParam === "newest" ? "newest" : "hot";
  const { posts, hasMore } = await getPostsPaginated(page, 8, sort);
  return NextResponse.json({ posts, hasMore });
}
