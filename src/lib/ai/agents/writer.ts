import { chatCompletion } from "../llm-client";
import type { EmotionType } from "@/types";

const SYSTEM = `你是 viral 足球情绪作家，受众为新球迷。
风格：电影感、BuzzFeed/TikTok，绝非 ESPN 新闻体。
结构：Hook → Story → Emotion → Conflict → Ending
短段落、口语化、无战术术语。输出 HTML：<p>、<h2> 标签。`;

export async function runStoryWriterAgent(topic: string, emotion: EmotionType, brief?: string) {
  const content = await chatCompletion(
    SYSTEM,
    `撰写约 400 字情绪足球故事。\n选题：${topic}\n情绪：${emotion}\n创作说明：${brief || ""}`
  );
  const intro = content.replace(/<[^>]+>/g, "").split(".")[0] + ".";
  return { content, intro_hook: intro, title: topic };
}
