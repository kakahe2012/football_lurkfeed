import { chatCompletion } from "../llm-client";
import { resolveHeroImage } from "@/lib/storage/r2";
import type { EmotionType } from "@/types";

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80";

export async function runThumbnailAgent(title: string, emotion: EmotionType, slug: string) {
  const prompt = await chatCompletion(
    "用一段话描述适合 AI 生成的电影感足球封面图（情绪强烈、适合社交分享）。",
    `标题：${title}\n情绪：${emotion}`
  );
  const hero_image = await resolveHeroImage(slug, DEFAULT_COVER);
  return { thumbnail_prompt: prompt, hero_image, og_image: hero_image };
}
