import type { EmotionType } from "@/types";

export type PipelineStepId =
  | "strategize"
  | "hunt"
  | "select"
  | "headline"
  | "write"
  | "rewrite"
  | "seo"
  | "thumbnail"
  | "publish";

export interface PipelineStepResult {
  id: PipelineStepId;
  name: string;
  status: "success" | "skipped" | "failed";
  output: unknown;
  duration_ms: number;
  error?: string;
}

export interface TopicPlan {
  title: string;
  emotion: EmotionType;
  angle: string;
  target_audience: string;
  priority: number;
}

export interface SelectedTopic {
  title: string;
  emotion: EmotionType;
  brief: string;
  source: string;
}

export interface PipelineOutput {
  title: string;
  slug: string;
  content: string;
  intro_hook: string;
  emotion_type: EmotionType;
  hero_image: string;
  seo_title: string;
  seo_description: string;
  tags: string[];
  og_image?: string;
  thumbnail_prompt?: string;
  headlines?: unknown[];
  publish_status: "pending";
  steps: PipelineStepResult[];
}

export const PIPELINE_STEPS: { id: PipelineStepId; name: string }[] = [
  { id: "strategize", name: "选题策划" },
  { id: "hunt", name: "热点扫描" },
  { id: "select", name: "选题确认" },
  { id: "headline", name: "标题生成" },
  { id: "write", name: "内容撰写" },
  { id: "rewrite", name: "内容润色" },
  { id: "seo", name: "SEO 优化" },
  { id: "thumbnail", name: "封面处理" },
  { id: "publish", name: "发布入库" },
];
