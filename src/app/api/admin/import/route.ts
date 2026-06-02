import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { isAuthorized } from "@/lib/admin/auth";
import { parseArticleHtml } from "@/lib/import/parse-html";
import { mirrorArticleAssets, type AssetMap } from "@/lib/import/article-assets";
import {
  fixContentImageUrls,
  resolveHeroImage,
} from "@/lib/media/resolve-image";
import type { EmotionType, PublishStatus } from "@/types";

const MAX_ITEMS = 100;
const MAX_HTML_BYTES = 600_000; // ~600KB per file
const VALID_EMOTIONS = new Set<EmotionType>([
  "hype",
  "heartbreak",
  "icons",
  "secrets",
  "culture",
  "easy_football",
]);
const VALID_STATUS = new Set<PublishStatus>([
  "draft",
  "pending",
  "published",
  "rejected",
]);


interface ImportItem {
  filename: string;
  html: string;
}

interface ResultRow {
  filename: string;
  ok: boolean;
  slug?: string;
  title?: string;
  emotion?: EmotionType;
  tags?: string[];
  error?: string;
}

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 6);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    items?: ImportItem[];
    status?: PublishStatus;
    emotion?: EmotionType;
    force_emotion?: boolean;
    assets?: AssetMap;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }

  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length) {
    return NextResponse.json({ error: "没有可导入的文件" }, { status: 400 });
  }
  if (items.length > MAX_ITEMS) {
    return NextResponse.json(
      { error: `单次最多导入 ${MAX_ITEMS} 篇` },
      { status: 400 }
    );
  }

  const status: PublishStatus = VALID_STATUS.has(body.status as PublishStatus)
    ? (body.status as PublishStatus)
    : "published";
  const fallbackEmotion: EmotionType = VALID_EMOTIONS.has(body.emotion as EmotionType)
    ? (body.emotion as EmotionType)
    : "culture";
  const forceEmotion = Boolean(body.force_emotion);
  const assets: AssetMap = body.assets && typeof body.assets === "object" ? body.assets : {};

  const supabase = await createServiceSupabaseClient();
  const results: ResultRow[] = [];
  const usedSlugs = new Set<string>();

  for (const item of items) {
    const filename = item?.filename || "untitled.html";
    try {
      if (typeof item?.html !== "string" || !item.html.trim()) {
        results.push({ filename, ok: false, error: "文件内容为空" });
        continue;
      }
      if (Buffer.byteLength(item.html, "utf8") > MAX_HTML_BYTES) {
        results.push({ filename, ok: false, error: "文件过大（>600KB）" });
        continue;
      }

      const parsed = parseArticleHtml(item.html, filename, fallbackEmotion);
      const finalEmotion: EmotionType = forceEmotion
        ? fallbackEmotion
        : parsed.emotion_type;

      let slug = parsed.slug;
      if (usedSlugs.has(slug)) slug = `${slug}-${randomSuffix()}`;

      let content = parsed.content;
      if (Object.keys(assets).length) {
        content = await mirrorArticleAssets(
          content,
          slug,
          filename,
          assets
        );
      }

      const publishedAt =
        status === "published"
          ? parsed.published_at || new Date().toISOString()
          : null;

      const record = {
        title: parsed.title,
        slug,
        content: fixContentImageUrls(content, slug),
        intro_hook: parsed.intro_hook,
        hero_image: resolveHeroImage(parsed.hero_image, slug, "hero"),
        emotion_type: finalEmotion,
        feed_type: "story" as const,
        media_type: "article" as const,
        tags: parsed.tags,
        seo_title: parsed.seo_title,
        seo_description: parsed.seo_description,
        read_time_minutes: parsed.read_time_minutes,
        publish_status: status,
        published_at: publishedAt,
      };

      if (supabase) {
        // ensure slug uniqueness against the DB
        const { data: existing } = await supabase
          .from("posts")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();
        if (existing) {
          slug = `${slug}-${randomSuffix()}`;
          record.slug = slug;
        }

        const { error } = await supabase.from("posts").insert(record);
        if (error) {
          results.push({ filename, ok: false, error: error.message });
          continue;
        }
      }

      usedSlugs.add(slug);
      results.push({
        filename,
        ok: true,
        slug,
        title: parsed.title,
        emotion: finalEmotion,
        tags: parsed.tags,
      });
    } catch (e) {
      results.push({
        filename,
        ok: false,
        error: (e as Error).message || "解析失败",
      });
    }
  }

  const imported = results.filter((r) => r.ok).length;
  return NextResponse.json({
    imported,
    failed: results.length - imported,
    persisted: Boolean(supabase),
    status,
    results,
  });
}
