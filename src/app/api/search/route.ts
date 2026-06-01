import { NextRequest, NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/data/posts";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.toLowerCase() || "";
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

  return NextResponse.json({ results });
}
