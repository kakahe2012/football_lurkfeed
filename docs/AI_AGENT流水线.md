# AI Agent 流水线说明

## 网站定位回顾

- **受众**：世界杯新球迷、休闲观众、年轻用户、女性观众
- **内容**：情绪故事、足球文化、八卦戏剧，非战术分析
- **目标**：高停留、高分享、高广告展示、低人工运营

## 九步 Agent 架构

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ 1.选题策划   │ → │ 2.热点扫描   │ → │ 3.选题确认   │
│ Strategist  │   │ Hunter      │   │ Selector    │
└─────────────┘   └─────────────┘   └──────┬──────┘
                                           ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ 4.标题生成   │ → │ 5.内容撰写   │ → │ 6.内容润色   │
│ Headline    │   │ Writer      │   │ Rewrite     │
└─────────────┘   └─────────────┘   └──────┬──────┘
                                           ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│ 7.SEO优化   │ → │ 8.封面处理   │ → │ 9.发布入库   │
│ SEO         │   │ Thumbnail   │   │ Publisher   │
└─────────────┘   └─────────────┘   └─────────────┘
                                           ▼
                                    待审队列 → 人工发布
```

## 各 Agent 职责

### 1. 选题策划 Agent（Topic Strategist）

**输入**：当前日期、世界杯阶段、近期已发情绪分布  
**输出**：3–5 个选题方向 + 建议情绪类型 + 内容角度  

**策略**（按网站六大情绪配比建议）：
| 情绪 | 建议占比 | 选题示例 |
|------|----------|----------|
| heartbreak | 25% | 点球悲剧、球迷心碎 |
| hype | 20% |  viral 瞬间、争议 |
| icons | 15% | 球星奢华、传奇 |
| secrets | 15% | 更衣室、死敌俱乐部 |
| culture | 15% | 球迷文化、国家认同 |
| easy_football | 10% | 越位入门、规则科普 |

### 2. 热点扫描 Agent（Topic Hunter）

**输入**：外部热点上下文（可手动粘贴 Trends/新闻）  
**输出**：5–10 个 trending 候选 + emotion_hint + score  

### 3. 选题确认 Agent（Topic Selector）

**输入**：策划方向 + 热点候选  
**输出**：1 个最终选题 title + emotion + 创作 brief  

### 4–9. 生成与发布

与代码中 `src/lib/ai/agents/` 各模块一一对应。

## API 调用

```bash
# 完整流水线（含每步日志）
curl -X POST http://localhost:3000/api/ai/pipeline \
  -H "Authorization: Bearer 你的ADMIN_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"action":"pipeline","topic":"","emotion":"hype","auto_save":true}'

# 仅选题策划
-d '{"action":"strategize"}'

# 仅热点扫描
-d '{"action":"hunt"}'
```

## 人工节点

| 环节 | 操作 |
|------|------|
| 审批 | `/admin/queue` 通过/拒绝 |
| 发布 | 通过后 `publish_status=published` |
| 调优 | `/admin/prompts` 调整情绪强度 |
