import type { EmotionType, Post, RecommendationContext } from "@/types";
import { getPublishedPosts } from "@/lib/data/posts";

const EMOTION_WEIGHT = 3;
const RECENCY_WEIGHT = 1;
const CTR_WEIGHT = 2;

export function createSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function updateEmotionScores(
  ctx: RecommendationContext,
  emotion: EmotionType,
  delta = 1
): RecommendationContext {
  const scores = { ...ctx.emotion_scores };
  scores[emotion] = (scores[emotion] || 0) + delta;
  return { ...ctx, emotion_scores: scores };
}

export async function getRecommendedFeed(
  ctx: RecommendationContext,
  excludeIds: string[] = [],
  limit = 12
): Promise<Post[]> {
  const all = await getPublishedPosts(100);
  const available = all.filter((p) => !excludeIds.includes(p.id));

  if (!Object.keys(ctx.emotion_scores).length) {
    return available
      .sort((a, b) => b.ctr_score - a.ctr_score)
      .slice(0, limit);
  }

  const scored = available.map((post) => {
    const emotionScore =
      (ctx.emotion_scores[post.emotion_type] || 0) * EMOTION_WEIGHT;
    const ctrScore = post.ctr_score * CTR_WEIGHT;
    const recencyScore =
      new Date(post.published_at || post.created_at).getTime() /
      1e12 *
      RECENCY_WEIGHT;
    const seenPenalty = ctx.recent_post_ids.includes(post.id) ? -10 : 0;
    return {
      post,
      score: emotionScore + ctrScore + recencyScore + seenPenalty,
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
}
