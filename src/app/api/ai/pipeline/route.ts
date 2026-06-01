import { NextRequest, NextResponse } from "next/server";
import {
  runFullPipeline,
  runTopicStrategistAgent,
  runTopicHunterAgent,
} from "@/lib/ai/agents";
import type { EmotionType } from "@/types";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { isAuthorized } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const body = await request.json();
  const action = body.action || "pipeline";

  try {
    if (action === "strategize") {
      const plans = await runTopicStrategistAgent(body.context);
      return NextResponse.json({ plans });
    }

    if (action === "hunt" || action === "topic_hunt") {
      const topics = await runTopicHunterAgent(body.sources);
      const supabase = await createServiceSupabaseClient();
      if (supabase) {
        for (const t of topics) {
          await supabase.from("trending_topics").insert({
            title: t.title,
            source: "ai_topic_hunter",
            emotion_hint: t.emotion_hint,
            score: t.score || 0.5,
            summary: t.summary || "",
          });
        }
      }
      return NextResponse.json({ topics });
    }

    const emotion = (body.emotion || "hype") as EmotionType;
    const result = await runFullPipeline({
      topic: body.topic,
      emotion,
      sources: body.sources,
      context: body.context,
    });

    const supabase = await createServiceSupabaseClient();

    if (supabase && body.auto_save) {
      const { data } = await supabase
        .from("posts")
        .insert({
          title: result.title,
          slug: result.slug,
          content: result.content,
          intro_hook: result.intro_hook,
          hero_image: result.hero_image,
          og_image: result.og_image,
          emotion_type: result.emotion_type,
          feed_type: "story",
          media_type: "article",
          tags: result.tags,
          seo_title: result.seo_title,
          seo_description: result.seo_description,
          publish_status: "pending",
        })
        .select()
        .single();

      await supabase.from("ai_jobs").insert({
        job_type: "write",
        prompt: body.topic || result.title,
        result: { ...result, steps: result.steps },
        status: "completed",
        post_id: data?.id,
      });

      return NextResponse.json({ result, post: data, steps: result.steps });
    }

    return NextResponse.json({ result, steps: result.steps });
  } catch (e) {
    const err = e as Error & { step?: unknown };
    return NextResponse.json(
      { error: err.message || "流水线失败", failed_step: err.step },
      { status: 500 }
    );
  }
}
