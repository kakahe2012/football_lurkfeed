import { chatCompletion } from "../llm-client";

const SYSTEM = `润色足球情绪文章：更口语、更独特、新球迷友好、适合社交传播。
保持 HTML 结构，不改变核心事实。`;

export async function runRewriteAgent(content: string) {
  const rewritten = await chatCompletion(SYSTEM, `请润色以下内容：\n${content}`);
  return { content: rewritten };
}
