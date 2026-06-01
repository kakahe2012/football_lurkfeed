import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils";

/**
 * Robots policy.
 *
 * Two big shifts vs a vanilla policy:
 *
 *  1. We EXPLICITLY name the AI/LLM crawlers (GPTBot, ClaudeBot,
 *     PerplexityBot, Google-Extended, CCBot, Applebot-Extended, etc.).
 *     Without an explicit allow rule, defensive AI crawlers will skip the
 *     site to avoid copyright trouble. We *want* citation, so we opt in.
 *
 *  2. We firewall /admin, /api, and admin endpoints from EVERY agent — the
 *     last thing we need is GPTBot indexing our admin login page.
 *
 * Note: Next 15 supports `MetadataRoute.Robots["rules"]` as an array of
 * per-user-agent objects.
 */
export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  const allowAll = {
    allow: ["/"],
    disallow: ["/admin/", "/api/", "/admin", "/_next/static/private/"],
  };

  return {
    rules: [
      // Default: classic search engines (Googlebot, Bingbot, DuckDuckBot, ...)
      { userAgent: "*", ...allowAll },

      // Explicit opt-in for major AI / LLM crawlers. Listing each one
      // separately means we can later flip a single line to opt-out without
      // breaking the rest.
      { userAgent: "GPTBot", ...allowAll }, // OpenAI ChatGPT
      { userAgent: "OAI-SearchBot", ...allowAll }, // ChatGPT search
      { userAgent: "ChatGPT-User", ...allowAll }, // ChatGPT browse mode
      { userAgent: "ClaudeBot", ...allowAll }, // Anthropic
      { userAgent: "Claude-Web", ...allowAll },
      { userAgent: "anthropic-ai", ...allowAll },
      { userAgent: "PerplexityBot", ...allowAll }, // Perplexity
      { userAgent: "Perplexity-User", ...allowAll },
      { userAgent: "Google-Extended", ...allowAll }, // Google Gemini training
      { userAgent: "Googlebot-News", ...allowAll },
      { userAgent: "Bingbot", ...allowAll },
      { userAgent: "msnbot", ...allowAll },
      { userAgent: "Applebot", ...allowAll },
      { userAgent: "Applebot-Extended", ...allowAll }, // Apple Intelligence
      { userAgent: "Bytespider", ...allowAll }, // ByteDance / Doubao
      { userAgent: "DuckAssistBot", ...allowAll },
      { userAgent: "YouBot", ...allowAll },
      { userAgent: "Amazonbot", ...allowAll },
      { userAgent: "Meta-ExternalAgent", ...allowAll }, // Meta AI
      { userAgent: "Meta-ExternalFetcher", ...allowAll },
      { userAgent: "CCBot", ...allowAll }, // Common Crawl (training data feed)
      { userAgent: "Diffbot", ...allowAll },
      { userAgent: "FacebookBot", ...allowAll },
      { userAgent: "ImagesiftBot", ...allowAll },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
