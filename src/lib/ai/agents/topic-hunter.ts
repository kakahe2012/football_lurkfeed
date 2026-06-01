import { chatCompletion } from "../llm-client";
import type { EmotionType } from "@/types";

export interface TrendingTopic {
  title: string;
  summary: string;
  emotion_hint: EmotionType;
  score: number;
}

const SYSTEM = `发现当前足球领域 viral 话题，面向新球迷/休闲观众。
返回 JSON 数组：{ "title": string, "summary": string, "emotion_hint": string, "score": 0-1 }`;

export async function runTopicHunterAgent(sources?: string): Promise<TrendingTopic[]> {
  const prompt = sources || "World Cup 2026, viral football moments, player drama, fan culture, controversies";
  const raw = await chatCompletion(SYSTEM, `热点来源上下文：${prompt}`);
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [];
  } catch {
    return [
      {
        title: "World Cup emotional stories trending",
        summary: raw.slice(0, 200),
        emotion_hint: "hype",
        score: 0.8,
      },
    ];
  }
}
