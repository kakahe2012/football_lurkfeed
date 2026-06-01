import { slugify } from "@/lib/utils";
import type { EmotionType } from "@/types";
import { runTopicStrategistAgent } from "./topic-strategist";
import { runTopicHunterAgent } from "./topic-hunter";
import { runTopicSelectorAgent } from "./topic-selector";
import { runHeadlineAgent } from "./headline";
import { runStoryWriterAgent } from "./writer";
import { runRewriteAgent } from "./rewrite";
import { runSeoAgent } from "./seo";
import { runThumbnailAgent } from "./thumbnail";
import { runPublisherAgent } from "./publisher";
import type { PipelineOutput, PipelineStepResult } from "./types";

async function runStep<T>(
  id: PipelineStepResult["id"],
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; step: PipelineStepResult }> {
  const start = Date.now();
  try {
    const result = await fn();
    return {
      result,
      step: { id, name, status: "success", output: result, duration_ms: Date.now() - start },
    };
  } catch (e) {
    const error = e instanceof Error ? e.message : "未知错误";
    throw Object.assign(new Error(error), {
      step: { id, name, status: "failed" as const, output: null, duration_ms: Date.now() - start, error },
    });
  }
}

export async function runFullPipeline(options: {
  topic?: string;
  emotion?: EmotionType;
  sources?: string;
  context?: string;
}): Promise<PipelineOutput> {
  const steps: PipelineStepResult[] = [];
  let plans: Awaited<ReturnType<typeof runTopicStrategistAgent>> = [];
  let trends: Awaited<ReturnType<typeof runTopicHunterAgent>> = [];
  let selected = { title: options.topic || "", emotion: options.emotion || ("hype" as EmotionType), brief: "", source: "manual" };

  const s1 = await runStep("strategize", "选题策划", () =>
    runTopicStrategistAgent(options.context)
  );
  plans = s1.result;
  steps.push(s1.step);

  const s2 = await runStep("hunt", "热点扫描", () =>
    runTopicHunterAgent(options.sources)
  );
  trends = s2.result;
  steps.push(s2.step);

  const s3 = await runStep("select", "选题确认", () =>
    runTopicSelectorAgent(plans, trends, options.topic)
  );
  selected = s3.result;
  steps.push(s3.step);

  const emotion = (options.emotion || selected.emotion) as EmotionType;

  const s4 = await runStep("headline", "标题生成", () =>
    runHeadlineAgent(selected.title, emotion)
  );
  const headlines = s4.result;
  const bestTitle = headlines[0]?.title || selected.title;
  steps.push(s4.step);

  const s5 = await runStep("write", "内容撰写", () =>
    runStoryWriterAgent(bestTitle, emotion, selected.brief)
  );
  let { content } = s5.result;
  const { intro_hook } = s5.result;
  steps.push(s5.step);

  const s6 = await runStep("rewrite", "内容润色", () => runRewriteAgent(content));
  content = s6.result.content;
  steps.push(s6.step);

  const s7 = await runStep("seo", "SEO 优化", () => runSeoAgent(bestTitle, intro_hook));
  const seo = s7.result;
  steps.push(s7.step);

  const slug = slugify(bestTitle);
  const s8 = await runStep("thumbnail", "封面处理", () =>
    runThumbnailAgent(bestTitle, emotion, slug)
  );
  const { hero_image, og_image, thumbnail_prompt } = s8.result;
  steps.push(s8.step);

  const draft = {
    title: bestTitle,
    slug,
    content,
    intro_hook,
    emotion_type: emotion,
    hero_image,
    seo_title: seo.seo_title,
    seo_description: seo.seo_description,
    tags: seo.tags,
    og_image,
    thumbnail_prompt,
    headlines,
  };

  const s9 = await runStep("publish", "发布入库", async () => runPublisherAgent(draft));
  steps.push(s9.step);

  return { ...draft, publish_status: "pending", steps };
}

export { runTopicStrategistAgent } from "./topic-strategist";
export { runTopicHunterAgent } from "./topic-hunter";
