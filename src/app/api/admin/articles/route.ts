import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { SEED_POSTS } from "@/lib/data/seed-posts";
import { isAuthorized } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");
  const supabase = await createServiceSupabaseClient();

  if (supabase) {
    let query = supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("publish_status", status);
    }

    const { data: posts, error } = await query.limit(100);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const ids = (posts || []).map((p) => p.id);
    const statsMap: Record<string, { page_views: number; unique_sessions: number; sources: { source: string; visits: number }[] }> = {};

    if (ids.length) {
      const { data: events } = await supabase
        .from("analytics_events")
        .select("post_id, event_type, session_id, referrer, utm_source")
        .in("post_id", ids);

      for (const id of ids) {
        const postEvents = (events || []).filter((e) => e.post_id === id);
        const pageViews = postEvents.filter((e) => e.event_type === "page_view");
        const sessions = new Set(pageViews.map((e) => e.session_id).filter(Boolean));
        const sourceCounts: Record<string, number> = {};
        for (const e of pageViews) {
          const src = (e.utm_source as string) || (e.referrer as string) || "direct";
          sourceCounts[src] = (sourceCounts[src] || 0) + 1;
        }
        statsMap[id] = {
          page_views: pageViews.length,
          unique_sessions: sessions.size,
          sources: Object.entries(sourceCounts)
            .map(([source, visits]) => ({ source, visits }))
            .sort((a, b) => b.visits - a.visits)
            .slice(0, 5),
        };
      }
    }

    return NextResponse.json({
      posts: (posts || []).map((p) => ({
        ...p,
        analytics: statsMap[p.id] || { page_views: p.view_count || 0, unique_sessions: 0, sources: [] },
      })),
      persisted: true,
    });
  }

  const posts = status && status !== "all"
    ? SEED_POSTS.filter((p) => p.publish_status === status)
    : SEED_POSTS;

  return NextResponse.json({
    posts: posts.map((p) => ({
      ...p,
      analytics: {
        page_views: p.view_count,
        unique_sessions: Math.round(p.view_count * 0.7),
        sources: [
          { source: "google", visits: Math.round(p.view_count * 0.4) },
          { source: "direct", visits: Math.round(p.view_count * 0.3) },
        ],
      },
    })),
    persisted: false,
  });
}
