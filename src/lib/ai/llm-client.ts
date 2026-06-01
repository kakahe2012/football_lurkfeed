/**
 * 统一 LLM 客户端 — 支持阿里通义千问 (推荐) 与 Kimi (Moonshot)
 *
 * 环境变量:
 *   AI_PROVIDER=qwen|kimi  (默认 qwen)
 *   DASHSCOPE_API_KEY      — 千问 (阿里云百炼)
 *   MOONSHOT_API_KEY       — Kimi
 */
import OpenAI from "openai";

export type AIProvider = "qwen" | "kimi";

export function getAIProvider(): AIProvider {
  const p = process.env.AI_PROVIDER?.toLowerCase();
  if (p === "kimi" || p === "moonshot") return "kimi";
  return "qwen";
}

export function isLLMConfigured(): boolean {
  const provider = getAIProvider();
  if (provider === "kimi") return Boolean(process.env.MOONSHOT_API_KEY);
  return Boolean(process.env.DASHSCOPE_API_KEY);
}

function getDefaultModel(provider: AIProvider): string {
  if (provider === "kimi") {
    return process.env.MOONSHOT_MODEL || "moonshot-v1-8k";
  }
  return process.env.QWEN_MODEL || "qwen-plus";
}

export function getLLMClient(): OpenAI | null {
  const provider = getAIProvider();

  if (provider === "kimi") {
    const key = process.env.MOONSHOT_API_KEY;
    if (!key) return null;
    return new OpenAI({
      apiKey: key,
      baseURL: "https://api.moonshot.cn/v1",
    });
  }

  const key = process.env.DASHSCOPE_API_KEY;
  if (!key) return null;
  return new OpenAI({
    apiKey: key,
    baseURL:
      process.env.DASHSCOPE_BASE_URL ||
      "https://dashscope.aliyuncs.com/compatible-mode/v1",
  });
}

export async function chatCompletion(
  system: string,
  user: string,
  model?: string
): Promise<string> {
  const client = getLLMClient();
  const provider = getAIProvider();
  const resolvedModel = model || getDefaultModel(provider);

  if (!client) {
    return `[AI Mock · 请配置 ${provider === "kimi" ? "MOONSHOT_API_KEY" : "DASHSCOPE_API_KEY"}] ${user.slice(0, 180)}...`;
  }

  const res = await client.chat.completions.create({
    model: resolvedModel,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    temperature: 0.85,
    max_tokens: 4096,
  });

  return res.choices[0]?.message?.content || "";
}

export function getProviderInfo() {
  const provider = getAIProvider();
  return {
    provider,
    model: getDefaultModel(provider),
    configured: isLLMConfigured(),
    label: provider === "kimi" ? "Kimi (Moonshot)" : "通义千问 (DashScope)",
  };
}
