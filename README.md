# LurkFeed Football ⚽

> **Football. The fun parts.**
> Your World Cup gossip, drama & culture corner — built for new fans.

域名：**https://football.lurkfeed.com**
定位：年轻人 / 新球迷的世界杯 **周边 / 八卦 / 文化** 聚集地，
不是传统体育新闻站，而是 TikTok + BuzzFeed 风格的足球故事消费体验。

## 功能概览

- **无限 Feed 流** — Pinterest/TikTok 风格瀑布流，情绪驱动标题
- **沉浸式文章页** — 巨图 Hero、电影感排版、下滑续读下一篇
- **情绪推荐引擎** — 按 heartbreak / hype / drama 推荐，而非球队
- **AI 内容工厂** — Topic Hunter → 标题 → 写作 → SEO → 发布队列
- **极简 Admin** — 审批 AI 内容、调控 Prompt、监控 RPM/CTR
- **广告系统** — Feed 原生广告、文中广告、移动端 Sticky Footer
- **SEO** — SSR、JSON-LD、sitemap、OpenGraph

## 快速开始

```bash
npm install
cp .env.example .env.local
npm run dev
```

访问：

- 前台：http://localhost:3000
- 管理后台：http://localhost:3000/admin
- AI 流水线：http://localhost:3000/admin/pipeline

未配置 Supabase 时自动使用内置种子数据（当前为 **20 篇** KC 批量导入的真实英文文章；重新生成见 `scripts/import-articles-to-seed.ts`）。

## SEO + GEO

每个文章页面会自动生成 8–13 块 JSON-LD（Article / FAQPage / Person+sameAs /
SportsTeam / ItemList / BreadcrumbList / Organization / WebSite+SearchAction
/ Speakable），从 KC v3 文章正文里**实时抽取** FAQ 与 Key Takeaways。`/llms.txt`
+ `/feed.xml` + 显式 AI 爬虫白名单（GPTBot / ClaudeBot / PerplexityBot /
Google-Extended …）协同把站点接入生成式搜索引擎。详见 **[docs/SEO_GEO.md](docs/SEO_GEO.md)**。

## 批量上架（Football Content Factory → 网站）

使用 `football-content-factory` skill 生成的 KC v3 HTML 文章可零配置批量上架：

- 后台 GUI：`/admin/publish` → 选择文件 / 文件夹 → 一键导入 + 批量发布
- 通过对话：直接告诉我 "把 `~/path/to/articles/` 上架"，我会自动调 import API
- 自动从 og 元信息、JSON-LD、`.article-category` 等抽取 title / hero / tags / 情绪 / 发布时间
- 详细映射规则与排错见 **[docs/批量上架指引.md](docs/批量上架指引.md)**

首页瀑布流默认按 **time-decayed hot score** 排序（HN 风格，share×8 + view + 1.5 衰减），
确保新内容能上首页、热内容也不会瞬间被压下去。

## 环境变量

| 变量 | 说明 |
|------|------|
| `DASHSCOPE_API_KEY` | **通义千问**（推荐，见 `docs/AI_PROVIDER.md`） |
| `MOONSHOT_API_KEY` | Kimi 备选（`AI_PROVIDER=kimi`） |
| `NEXT_PUBLIC_SUPABASE_*` | Supabase（见 `docs/SETUP_SUPABASE.md`） |
| `R2_*` | Cloudflare R2 封面图 |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense（见 `docs/SETUP_ADSENSE_GA4.md`） |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 |
| `ADMIN_SECRET` | Admin API 鉴权 |

完整列表见 `.env.example`。

## 运营必读

📋 **[网站管理手册](docs/网站管理手册.md)** — 访问地址、账号、密钥、日常 Checklist（请本地填写后勿提交 Git）

## 配置文档

| 文档 | 内容 |
|------|------|
| [docs/网站管理手册.md](docs/网站管理手册.md) | **地址 / 账号 / 密钥一览** |
| [docs/AI_AGENT流水线.md](docs/AI_AGENT流水线.md) | 九步 Agent 说明 |
| [docs/AI_PROVIDER.md](docs/AI_PROVIDER.md) | **千问 vs Kimi**（推荐千问） |
| [docs/SETUP_SUPABASE.md](docs/SETUP_SUPABASE.md) | Supabase 创建与迁移 |
| [docs/SETUP_ADSENSE_GA4.md](docs/SETUP_ADSENSE_GA4.md) | AdSense 申请 + GA4 |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Vercel + Cloudflare |
| [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md) | 复盘与待完善项 |

## Supabase 初始化

依次执行：`001_initial_schema.sql` → `002_analytics_enhanced.sql` → `seed.sql`

## 后台文章管理

- 列表（PV / 来源）：`/admin/articles`
- 详情统计：`/admin/articles/[id]`

## AI 内容生成（千问）

```bash
curl -X POST http://localhost:3000/api/ai/pipeline \
  -H "Authorization: Bearer dev-admin-secret" \
  -H "Content-Type: application/json" \
  -d '{"topic":"Why England fans suffer every World Cup","emotion":"heartbreak","auto_save":true}'
```

## 项目结构

```
src/
├── app/                 # Next.js App Router
│   ├── page.tsx         # 首页 Feed
│   ├── story/[slug]/    # 文章页
│   ├── admin/           # 管理后台
│   └── api/             # API 路由
├── components/
│   ├── feed/            # StoryCard, InfiniteFeed
│   ├── article/         # ArticleView
│   ├── ads/             # AdSlot
│   └── layout/          # Header
├── lib/
│   ├── ai/agents/       # AI Agent 工作流
│   ├── data/            # 数据层 + 种子
│   ├── recommendations/ # 情绪推荐
│   └── seo/             # Metadata + JSON-LD
└── types/
supabase/migrations/     # 数据库 Schema
docs/ARCHITECTURE.md     # 完整架构文档
```

## 部署（Vercel）

1. Push 到 GitHub
2. Import 到 Vercel
3. 配置环境变量
4. 绑定自定义域名 + Cloudflare CDN

## 技术栈

- Next.js 15 · React · TailwindCSS · Framer Motion
- Supabase (PostgreSQL)
- OpenAI API
- Vercel · Cloudflare CDN/R2

## 许可证

Private — All rights reserved.
