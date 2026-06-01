import { chatCompletion } from "../llm-client";
import type { EmotionType } from "@/types";
import type { TopicPlan } from "./types";
import type { TrendingTopic } from "./topic-hunter";
import type { SelectedTopic } from "./types";

const SYSTEM = `从「策划选题」和「热点候选」中选定 1 个最佳选题用于创作。
标准：情绪共鸣强、适合新球迷、有传播性、非战术向。
返回 JSON：{ "title": string, "emotion": string, "brief": "50字创作说明", "source": "strategist|hunter|merged" }`;

export async function runTopicSelectorAgent(
  plans: TopicPlan[],
  trends: TrendingTopic[],
  userTopic?: string
): Promise<SelectedTopic> {
  if (userTopic?.trim()) {
    return {
      title: userTopic.trim(),
      emotion: "hype",
      brief: "用户指定选题",
      source: "manual",
    };
  }

  const raw = await chatCompletion(
    SYSTEM,
    `策划方向：${JSON.stringify(plans.slice(0, 5))}\n热点候选：${JSON.stringify(trends.slice(0, 5))}`
  );
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    const p = match ? JSON.parse(match[0]) : {};
    return {
      title: p.title || plans[0]?.title || trends[0]?.title || "Football story",
      emotion: (p.emotion as EmotionType) || plans[0]?.emotion || trends[0]?.emotion_hint || "hype",
      brief: p.brief || "",
      source: p.source || "merged",
    };
  } catch {
    return {
      title: plans[0]?.title || trends[0]?.title || "Football emotional story",
      emotion: plans[0]?.emotion || trends[0]?.emotion_hint || "hype",
      brief: "自动选定",
      source: "fallback",
    };
  }
}
