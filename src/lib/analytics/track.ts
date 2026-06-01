import type { EmotionType } from "@/types";
import { getOrCreateSessionId, getReferrer, getUtmParams } from "./session";

export async function trackEvent(
  eventType: string,
  data: {
    postId?: string;
    sessionId?: string;
    emotionType?: EmotionType;
    metadata?: Record<string, unknown>;
    pagePath?: string;
  }
) {
  const sessionId = data.sessionId || getOrCreateSessionId();
  const utm = getUtmParams();

  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_type: eventType,
        post_id: data.postId,
        session_id: sessionId,
        emotion_type: data.emotionType,
        metadata: data.metadata || {},
        referrer: getReferrer(),
        page_path: data.pagePath || (typeof window !== "undefined" ? window.location.pathname : ""),
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      }),
    });
  } catch {
    // Silent fail
  }
}
