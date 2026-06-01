export type EmotionType =
  | "hype"
  | "heartbreak"
  | "icons"
  | "secrets"
  | "culture"
  | "easy_football";

export type FeedType = "story" | "quick_bite" | "drama" | "easy_football";

export type MediaType = "article" | "video";

export type PublishStatus = "draft" | "pending" | "published" | "rejected";

export type AiJobType =
  | "topic_hunt"
  | "headline"
  | "write"
  | "rewrite"
  | "seo"
  | "thumbnail"
  | "publish";

export type AiJobStatus = "queued" | "running" | "completed" | "failed";

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  intro_hook: string;
  hero_image: string;
  emotion_type: EmotionType;
  feed_type: FeedType;
  media_type: MediaType;
  /** YouTube / Vimeo / direct .mp4 URL — only set when media_type === "video" */
  video_url?: string;
  tags: string[];
  seo_title: string;
  seo_description: string;
  og_image?: string;
  publish_status: PublishStatus;
  read_time_minutes: number;
  view_count: number;
  share_count: number;
  ctr_score: number;
  created_at: string;
  published_at?: string;
}

export interface TrendingTopic {
  id: string;
  title: string;
  source: string;
  emotion_hint: EmotionType;
  score: number;
  summary: string;
  created_at: string;
}

export interface AiJob {
  id: string;
  job_type: AiJobType;
  prompt: string;
  result: Record<string, unknown>;
  status: AiJobStatus;
  post_id?: string;
  created_at: string;
  completed_at?: string;
}

export interface AdPlacement {
  id: string;
  name: string;
  placement: "feed" | "inline" | "sticky" | "sponsored_card";
  html_snippet: string;
  active: boolean;
  rpm?: number;
}

export interface AnalyticsEvent {
  id: string;
  event_type: "page_view" | "scroll_depth" | "read_complete" | "share" | "ad_impression";
  post_id?: string;
  emotion_type?: EmotionType;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface RecommendationContext {
  session_id: string;
  emotion_scores: Partial<Record<EmotionType, number>>;
  recent_post_ids: string[];
}

export const EMOTION_LABELS: Record<EmotionType, { emoji: string; label: string }> = {
  hype: { emoji: "🔥", label: "Hype" },
  heartbreak: { emoji: "💔", label: "Heartbreak" },
  icons: { emoji: "👑", label: "Icons" },
  secrets: { emoji: "🤫", label: "Secrets" },
  culture: { emoji: "🌍", label: "Culture" },
  easy_football: { emoji: "⚽", label: "Easy Football" },
};
