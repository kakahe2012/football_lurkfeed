import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { SEED_POSTS } from "@/lib/data/seed-posts";
import { isAuthorized } from "@/lib/admin/auth";
import {
  canWriteSeedFile,
  updateSeedPost,
  type SeedPostPatch,
} from "@/lib/admin/seed-persist";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await createServiceSupabaseClient();

  if (supabase) {
    const { data: post, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { data: events } = await supabase
      .from("analytics_events")
      .select("*")
      .eq("post_id", id)
      .order("created_at", { ascending: false })
      .limit(500);

    const pageViews = (events || []).filter((e) => e.event_type === "page_view");
    const shares = (events || []).filter((e) => e.event_type === "share");
    const readCompletes = (events || []).filter((e) => e.event_type === "read_complete");
    const scrollEvents = (events || []).filter((e) => e.event_type === "scroll_depth");

    const sourceCounts: Record<string, number> = {};
    const dailyCounts: Record<string, number> = {};

    for (const e of pageViews) {
      const src = (e.utm_source as string) || (e.referrer as string) || "direct";
      sourceCounts[src] = (sourceCounts[src] || 0) + 1;
      const day = (e.created_at as string).slice(0, 10);
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    }

    const avgScroll =
      scrollEvents.length > 0
        ? Math.round(
            scrollEvents.reduce(
              (s, e) => s + Number((e.metadata as Record<string, number>)?.scroll_depth || 0),
              0
            ) / scrollEvents.length
          )
        : 0;

    return NextResponse.json({
      post,
      stats: {
        page_views: pageViews.length,
        unique_sessions: new Set(pageViews.map((e) => e.session_id).filter(Boolean)).size,
        shares: shares.length,
        read_completes: readCompletes.length,
        avg_scroll_depth: avgScroll,
        sources: Object.entries(sourceCounts)
          .map(([source, visits]) => ({ source, visits }))
          .sort((a, b) => b.visits - a.visits),
        daily: Object.entries(dailyCounts)
          .map(([date, views]) => ({ date, views }))
          .sort((a, b) => a.date.localeCompare(b.date)),
        recent_events: (events || []).slice(0, 50),
      },
    });
  }

  const post = SEED_POSTS.find((p) => p.id === id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    post,
    stats: {
      page_views: post.view_count,
      unique_sessions: Math.round(post.view_count * 0.7),
      shares: post.share_count,
      read_completes: Math.round(post.view_count * 0.45),
      avg_scroll_depth: 72,
      sources: [
        { source: "google", visits: Math.round(post.view_count * 0.42) },
        { source: "direct", visits: Math.round(post.view_count * 0.28) },
        { source: "twitter.com", visits: Math.round(post.view_count * 0.12) },
        { source: "facebook.com", visits: Math.round(post.view_count * 0.08) },
      ],
      daily: Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toISOString().slice(0, 10),
          views: Math.round(post.view_count / 7 + Math.random() * 500),
        };
      }),
      recent_events: [],
    },
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const supabase = await createServiceSupabaseClient();

  if (supabase) {
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (body.publish_status) {
      updates.publish_status = body.publish_status;
      if (body.publish_status === "published") {
        updates.published_at = new Date().toISOString();
      }
    }
    if (body.title) updates.title = body.title;
    if (body.intro_hook) updates.intro_hook = body.intro_hook;
    if (body.tags) updates.tags = body.tags;
    if (body.hero_image !== undefined) updates.hero_image = body.hero_image;
    if (body.og_image !== undefined) updates.og_image = body.og_image;
    if (body.content !== undefined) updates.content = body.content;

    const { data, error } = await supabase
      .from("posts")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ post: data });
  }

  const patch: SeedPostPatch = {};
  if (body.hero_image !== undefined) patch.hero_image = body.hero_image;
  if (body.og_image !== undefined) patch.og_image = body.og_image;
  if (body.content !== undefined) patch.content = body.content;
  if (body.publish_status) patch.publish_status = body.publish_status;

  if (!Object.keys(patch).length) {
    return NextResponse.json({ ok: true, id, message: "无字段更新" });
  }

  if (!canWriteSeedFile()) {
    return NextResponse.json(
      {
        error:
          "无法写入 seed-posts.ts（生产环境只读）。请在本地 npm run dev 修改后 git push。",
      },
      { status: 503 }
    );
  }

  const { post, write } = await updateSeedPost(id, patch);
  if (!post) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }
  if (!write.ok) {
    return NextResponse.json(
      { error: write.error || "写入失败" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    post,
    persisted: true,
    seedFile: true,
    message: "已写入 src/lib/data/seed-posts.ts，请 git commit 并 push 部署",
  });
}
