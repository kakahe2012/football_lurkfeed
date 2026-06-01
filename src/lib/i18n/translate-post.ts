import type { Post } from "@/types";
import type { Locale } from "@/i18n/routing";
import { chatCompletion } from "@/lib/ai/llm-client";

const memoryCache = new Map<string, Pick<Post, "title" | "intro_hook" | "content" | "seo_title" | "seo_description">>();

function cacheKey(slug: string, locale: Locale) {
  return `${slug}:${locale}`;
}

export async function translatePost(post: Post, locale: Locale): Promise<Post> {
  if (locale === "en") return post;

  const key = cacheKey(post.slug, locale);
  const cached = memoryCache.get(key);
  if (cached) {
    return { ...post, ...cached };
  }

  try {
    const raw = await chatCompletion(
      `You are a professional translator for a football entertainment website. Translate to ${localeName(locale)}. Keep HTML tags. Return JSON only: { "title", "intro_hook", "content", "seo_title", "seo_description" }`,
      JSON.stringify({
        title: post.title,
        intro_hook: post.intro_hook,
        content: post.content,
        seo_title: post.seo_title,
        seo_description: post.seo_description,
      })
    );
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      const translated = JSON.parse(match[0]);
      const patch = {
        title: translated.title || post.title,
        intro_hook: translated.intro_hook || post.intro_hook,
        content: translated.content || post.content,
        seo_title: translated.seo_title || post.seo_title,
        seo_description: translated.seo_description || post.seo_description,
      };
      memoryCache.set(key, patch);
      return { ...post, ...patch };
    }
  } catch {
    // fallback to English
  }

  return post;
}

export async function translatePosts(posts: Post[], locale: Locale): Promise<Post[]> {
  if (locale === "en") return posts;
  return Promise.all(posts.map((p) => translatePost(p, locale)));
}

function localeName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: "English",
    es: "Spanish",
    pt: "Portuguese",
    fr: "French",
    de: "German",
  };
  return names[locale];
}
