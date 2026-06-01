"use client";

import { useEffect, useState } from "react";
import type { EmotionType } from "@/types";
import { PIPELINE_STEPS } from "@/lib/ai/agents/types";
import {
  adminStyles,
  getAdminToken,
  EMOTION_LABELS_ZH,
} from "@/components/admin/admin-styles";

const EMOTIONS: EmotionType[] = [
  "hype",
  "heartbreak",
  "icons",
  "secrets",
  "culture",
  "easy_football",
];

interface StepLog {
  id: string;
  name: string;
  status: string;
  duration_ms: number;
  error?: string;
}

export default function AdminPipelinePage() {
  const [topic, setTopic] = useState("");
  const [emotion, setEmotion] = useState<EmotionType>("hype");
  const [loading, setLoading] = useState(false);
  const [steps, setSteps] = useState<StepLog[]>([]);
  const [plans, setPlans] = useState<{ title: string; emotion: string; angle?: string }[]>([]);
  const [trends, setTrends] = useState<{ title: string; summary?: string }[]>([]);
  const [config, setConfig] = useState<{ ai?: { label: string; configured: boolean } } | null>(null);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const token = getAdminToken();

  useEffect(() => {
    fetch("/api/admin/config", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setConfig);
  }, [token]);

  const api = async (body: Record<string, unknown>) => {
    const res = await fetch("/api/ai/pipeline", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  };

  const runStrategize = async () => {
    setLoading(true);
    setActiveStep("strategize");
    const data = await api({ action: "strategize" });
    setPlans(data.plans || []);
    setLoading(false);
    setActiveStep(null);
  };

  const runHunt = async () => {
    setLoading(true);
    setActiveStep("hunt");
    const data = await api({ action: "hunt" });
    setTrends(data.topics || []);
    setLoading(false);
    setActiveStep(null);
  };

  const runPipeline = async (autoSave: boolean) => {
    setLoading(true);
    setSteps([]);
    const data = await api({ action: "pipeline", topic, emotion, auto_save: autoSave });
    if (data.steps) setSteps(data.steps);
    if (data.error) alert(data.error);
    setLoading(false);
  };

  return (
    <div>
      <h1 className={adminStyles.pageTitle}>AI 内容流水线</h1>
      <p className={adminStyles.pageDesc}>
        九步 Agent：选题策划 → 热点扫描 → 选题确认 → 标题 → 撰写 → 润色 → SEO → 封面 → 入库
      </p>
      {config?.ai && (
        <p
          className={`mt-2 text-xs ${config.ai.configured ? "text-emerald-600" : "text-amber-600"}`}
        >
          模型：{config.ai.label}
          {config.ai.configured ? " · 已连接" : " · 请配置 DASHSCOPE_API_KEY"}
        </p>
      )}

      {/* 步骤说明 */}
      <div className={`mt-6 grid gap-2 sm:grid-cols-3 lg:grid-cols-5`}>
        {PIPELINE_STEPS.map((s, i) => (
          <div
            key={s.id}
            className="rounded-md border border-gray-200 bg-white px-3 py-2 text-center"
          >
            <span className="text-[10px] text-gray-400">{i + 1}</span>
            <p className="text-xs font-medium text-gray-700">{s.name}</p>
          </div>
        ))}
      </div>

      {/* 选题阶段 */}
      <section className={`mt-6 ${adminStyles.card}`}>
        <h2 className="text-sm font-medium text-gray-900">第一阶段：选题</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={runStrategize}
            disabled={loading}
            className={adminStyles.btnSecondary}
          >
            {activeStep === "strategize" ? "策划中…" : "① 选题策划"}
          </button>
          <button
            type="button"
            onClick={runHunt}
            disabled={loading}
            className={adminStyles.btnSecondary}
          >
            {activeStep === "hunt" ? "扫描中…" : "② 热点扫描"}
          </button>
        </div>

        {plans.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500">策划方向</p>
            <ul className="mt-2 space-y-1">
              {plans.map((p, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className="text-left text-sm text-emerald-700 hover:underline"
                    onClick={() => {
                      setTopic(p.title);
                      if (p.emotion) setEmotion(p.emotion as EmotionType);
                    }}
                  >
                    [{EMOTION_LABELS_ZH[p.emotion] || p.emotion}] {p.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {trends.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500">热点候选</p>
            <ul className="mt-2 space-y-1">
              {trends.map((t, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className="text-left text-sm text-gray-700 hover:underline"
                    onClick={() => setTopic(t.title)}
                  >
                    {t.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 生成阶段 */}
      <section className={`mt-6 ${adminStyles.card}`}>
        <h2 className="text-sm font-medium text-gray-900">第二阶段：生成与发布</h2>
        <div className="mt-4 max-w-lg space-y-4">
          <div>
            <label className="text-xs text-gray-500">选题（可留空由 AI 自动确认）</label>
            <input
              className={adminStyles.input}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="例如：为何英格兰球迷每届世界杯都心碎"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500">情绪类型</label>
            <select
              className={adminStyles.select}
              value={emotion}
              onChange={(e) => setEmotion(e.target.value as EmotionType)}
            >
              {EMOTIONS.map((e) => (
                <option key={e} value={e}>
                  {EMOTION_LABELS_ZH[e]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => runPipeline(false)}
              disabled={loading}
              className={adminStyles.btnSecondary}
            >
              预览生成（不入库）
            </button>
            <button
              type="button"
              onClick={() => runPipeline(true)}
              disabled={loading}
              className={adminStyles.btnPrimary}
            >
              完整生成并入库
            </button>
          </div>
        </div>
      </section>

      {/* 执行日志 */}
      {loading && (
        <p className="mt-6 text-sm text-gray-500">Agent 执行中，请稍候（约 30–90 秒）…</p>
      )}

      {steps.length > 0 && (
        <section className={`mt-6 ${adminStyles.card}`}>
          <h2 className="text-sm font-medium text-gray-900">执行日志</h2>
          <ul className="mt-4 space-y-2">
            {steps.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between rounded-md border border-gray-100 px-3 py-2 text-sm"
              >
                <span className="text-gray-700">
                  {s.status === "success" ? "✓" : "✗"} {s.name}
                </span>
                <span className="text-xs text-gray-400">{s.duration_ms}ms</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            入库后请前往 <a href="/admin/queue" className="text-emerald-600 underline">待审队列</a> 审批发布
          </p>
        </section>
      )}
    </div>
  );
}
