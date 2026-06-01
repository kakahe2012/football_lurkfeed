import { chatCompletion } from "../llm-client";
import type { EmotionType } from "@/types";

export async function runHeadlineAgent(topic: string, emotion: EmotionType) {
  const raw = await chatCompletion(
    `为休闲足球迷生成高 CTR 情绪化标题。返回 JSON 数组，10 条：{ "title": string, "emoji": string, "emotion": string }`,
    `选题：${topic}\n情绪：${emotion}`
  );
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [{ title: topic, emoji: "🔥", emotion }];
  } catch {
    return [{ title: topic, emoji: "🔥", emotion }];
  }
}
