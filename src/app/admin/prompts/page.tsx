"use client";

import { useState } from "react";
import { adminStyles } from "@/components/admin/admin-styles";

const DEFAULT_PROMPTS = [
  {
    agent: "选题策划",
    template: "根据世界杯新球迷定位，按情绪配比输出选题方向。",
    intensity: 7,
  },
  {
    agent: "标题生成",
    template: "生成 20 条高 CTR 情绪化标题，BuzzFeed/TikTok 风格。",
    intensity: 8,
  },
  {
    agent: "内容撰写",
    template: "电影感情绪故事：Hook→Story→Emotion→Conflict→Ending，非新闻体。",
    intensity: 9,
  },
  {
    agent: "内容润色",
    template: "改写为独特、口语化、新球迷友好的社交传播风格。",
    intensity: 7,
  },
  {
    agent: "SEO 优化",
    template: "生成 SEO 标题、描述、标签，面向 Google Discover。",
    intensity: 5,
  },
];

export default function AdminPromptsPage() {
  const [prompts, setPrompts] = useState(DEFAULT_PROMPTS);

  return (
    <div>
      <h1 className={adminStyles.pageTitle}>Prompt 配置</h1>
      <p className={adminStyles.pageDesc}>调整 AI 写作风格与情绪强度（本地预览，生产可接 Supabase ai_prompts 表）</p>

      <div className="mt-6 space-y-4">
        {prompts.map((p, i) => (
          <div key={p.agent} className={adminStyles.card}>
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{p.agent}</h3>
              <label className="flex items-center gap-2 text-xs text-gray-500">
                情绪强度
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={p.intensity}
                  onChange={(e) => {
                    const next = [...prompts];
                    next[i] = { ...p, intensity: parseInt(e.target.value) };
                    setPrompts(next);
                  }}
                  className="w-20"
                />
                <span>{p.intensity}</span>
              </label>
            </div>
            <textarea
              className={`${adminStyles.input} mt-3 font-mono text-xs`}
              rows={3}
              value={p.template}
              onChange={(e) => {
                const next = [...prompts];
                next[i] = { ...p, template: e.target.value };
                setPrompts(next);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
