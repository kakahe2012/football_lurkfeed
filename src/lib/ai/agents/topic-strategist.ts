import { chatCompletion } from "../llm-client";
import type { EmotionType } from "@/types";
import type { TopicPlan } from "./types";

const SYSTEM = `你是 Feel Football 首席内容策划。平台定位：
- 面向世界杯新球迷、休闲观众、年轻用户、女性观众
- 情绪优先：故事/文化/戏剧，不要战术分析
- 六大情绪类型：hype(热血)、heartbreak(心碎)、icons(球星)、secrets(秘闻)、culture(文化)、easy_football(入门)

请根据当前世界杯热点，输出 JSON 数组，每项：
{ "title": "选题方向", "emotion": "情绪类型", "angle": "创作角度", "target_audience": "目标读者", "priority": 1-10 }

建议每周配比：heartbreak 25%, hype 20%, icons 15%, secrets 15%, culture 15%, easy_football 10%`;

export async function runTopicStrategistAgent(context?: string): Promise<TopicPlan[]> {
  const raw = await chatCompletion(
    SYSTEM,
    `当前背景：${context || "2026 FIFA World Cup 前夕，全球新球迷涌入"}\n请输出 5 个高潜力选题方向。`
  );
  try {
    const match = raw.match(/\[[\s\S]*\]/);
    const parsed = match ? JSON.parse(match[0]) : [];
    return parsed.map((p: Record<string, unknown>) => ({
      title: String(p.title || ""),
      emotion: (p.emotion as EmotionType) || "hype",
      angle: String(p.angle || ""),
      target_audience: String(p.target_audience || "新球迷"),
      priority: Number(p.priority) || 5,
    }));
  } catch {
    return [
      {
        title: "Why new fans cry at their first World Cup match",
        emotion: "heartbreak",
        angle: "情感共鸣入门",
        target_audience: "首次看世界杯的新球迷",
        priority: 9,
      },
      {
        title: "Offside explained without making you feel stupid",
        emotion: "easy_football",
        angle: "规则科普",
        target_audience: "完全零基础观众",
        priority: 8,
      },
    ];
  }
}
