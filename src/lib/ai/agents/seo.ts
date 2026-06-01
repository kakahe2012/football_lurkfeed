import { chatCompletion } from "../llm-client";

export async function runSeoAgent(title: string, intro: string) {
  const raw = await chatCompletion(
    `生成 SEO 元数据，仅返回 JSON：{ "seo_title": string, "seo_description": string, "tags": string[] }`,
    `标题：${title}\n摘要：${intro}`
  );
  try {
    const match = raw.match(/\{[\s\S]*\}/);
    return match
      ? JSON.parse(match[0])
      : { seo_title: title, seo_description: intro, tags: ["football", "world-cup"] };
  } catch {
    return { seo_title: title, seo_description: intro, tags: ["football"] };
  }
}
