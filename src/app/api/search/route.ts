import { NextRequest, NextResponse } from "next/server";
import { getPublishedPosts, getSeedCatalog } from "@/lib/data/posts";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase() || "";

  try {
    const posts = await getPublishedPosts(100);
    const results = posts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.intro_hook.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 20)
      .map((p) => ({
        title: p.title,
        slug: p.slug,
        intro_hook: p.intro_hook,
      }));
    return NextResponse.json(
      { results },
      { headers: { "cache-control": "no-store" } }
    );
  } catch (err) {
    console.error("[/api/search] falling back to seed:", err);
    const fallback = getSeedCatalog("hot")
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.intro_hook.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 20)
      .map((p) => ({
        title: p.title,
        slug: p.slug,
        intro_hook: p.intro_hook,
      }));
    return NextResponse.json({ results: fallback }, { status: 200 });
  }
}
