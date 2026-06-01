import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "scroll_depth",
  "read_complete",
  "share",
  "ad_impression",
]);

const ALLOWED_EMOTIONS = new Set([
  "hype",
  "heartbreak",
  "icons",
  "secrets",
  "culture",
  "easy_football",
]);

/** Trim untrusted strings to keep this public endpoint from being abused for storage. */
function clip(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const v = value.trim();
  return v ? v.slice(0, max) : null;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const eventType = clip(body.event_type, 32);
  if (!eventType || !ALLOWED_EVENTS.has(eventType)) {
    // Silently accept-but-drop unknown events to avoid leaking validation details
    return NextResponse.json({ ok: true });
  }

  const emotion = clip(body.emotion_type, 20);
  let metadata: Record<string, unknown> = {};
  if (body.metadata && typeof body.metadata === "object") {
    const json = JSON.stringify(body.metadata);
    if (json.length <= 2000) metadata = body.metadata as Record<string, unknown>;
  }

  const row = {
    event_type: eventType,
    post_id: clip(body.post_id, 64),
    session_id: clip(body.session_id, 64),
    emotion_type: emotion && ALLOWED_EMOTIONS.has(emotion) ? emotion : null,
    metadata,
    referrer: clip(body.referrer, 300),
    utm_source: clip(body.utm_source, 100),
    utm_medium: clip(body.utm_medium, 100),
    utm_campaign: clip(body.utm_campaign, 100),
    page_path: clip(body.page_path, 300),
  };

  const supabase = await createServiceSupabaseClient();
  if (supabase) {
    await supabase.from("analytics_events").insert(row);
  }

  return NextResponse.json({ ok: true });
}
