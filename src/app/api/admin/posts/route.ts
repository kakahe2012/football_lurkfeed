import { NextRequest, NextResponse } from "next/server";
import { SEED_POSTS } from "@/lib/data/seed-posts";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { isAuthorized } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = request.nextUrl.searchParams.get("status");
  const supabase = await createServiceSupabaseClient();

  if (supabase) {
    let query = supabase.from("posts").select("*").order("created_at", { ascending: false });
    if (status) query = query.eq("publish_status", status);
    const { data, error } = await query.limit(50);
    if (!error) return NextResponse.json({ posts: data });
  }

  const posts = status
    ? SEED_POSTS.filter((p) => p.publish_status === status)
    : SEED_POSTS;
  return NextResponse.json({ posts });
}

const VALID_STATUS = new Set(["draft", "pending", "published", "rejected"]);

export async function PATCH(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const publish_status = body.publish_status as string;
  // Accept either a single id or a batch of ids
  const ids: string[] = Array.isArray(body.ids)
    ? body.ids.filter((x: unknown) => typeof x === "string")
    : body.id
      ? [body.id]
      : [];

  if (!ids.length || !VALID_STATUS.has(publish_status)) {
    return NextResponse.json(
      { error: "需要 id/ids 与合法的 publish_status" },
      { status: 400 }
    );
  }

  const supabase = await createServiceSupabaseClient();

  if (supabase) {
    const updates: Record<string, unknown> = {
      publish_status,
      updated_at: new Date().toISOString(),
    };
    if (publish_status === "published") {
      updates.published_at = new Date().toISOString();
    }
    const { data, error } = await supabase
      .from("posts")
      .update(updates)
      .in("id", ids)
      .select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ updated: data?.length ?? 0, posts: data });
  }

  return NextResponse.json({ ok: true, ids, publish_status });
}
