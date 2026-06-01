# Feel Football — System Architecture

## Product Positioning

AI-powered football **emotion** media platform for new/casual fans during World Cup 2026.

- **NOT** ESPN / traditional sports journalism
- **IS** TikTok + BuzzFeed + Netflix storytelling for football culture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Users (Mobile H5)                        │
│              Infinite Feed · Immersive Articles              │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│              Next.js 15 (Vercel + Edge SSR)                  │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │ Feed UI     │  │ Article UX   │  │ SEO (sitemap/OG/    │ │
│  │ Masonry     │  │ Next-story   │  │ JSON-LD)            │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────────┐
│ Supabase PG   │  │ Cloudflare R2 │  │ OpenAI Agents     │
│ posts, jobs,  │  │ hero images   │  │ topic→write→seo   │
│ analytics     │  │ OG images     │  │ →publish queue    │
└───────────────┘  └───────────────┘  └───────────────────┘
```

## Core Modules

### 1. Frontend (Mobile-First H5)

| Route | Purpose |
|-------|---------|
| `/` | Infinite emotion feed (Pinterest/TikTok style) |
| `/story/[slug]` | Immersive article + related + next story |
| `/search` | Emotional story search |
| `/admin/*` | Minimal AI CMS |

### 2. Emotion Taxonomy

| Type | Use |
|------|-----|
| hype | Viral, trending |
| heartbreak | Tragic moments |
| icons | Luxury, legends |
| secrets | Drama, rivalries |
| culture | Fan identity |
| easy_football | Beginner explainers |

### 3. AI Agent Pipeline

```
Topic Hunter → Headline Generator → Story Writer → Rewrite → SEO → Thumbnail → Publisher
```

API: `POST /api/ai/pipeline` with `Authorization: Bearer {ADMIN_SECRET}`

### 4. Recommendation Engine

Emotion-based scoring (not team-based):

- `emotion_scores` per session
- Weight: emotion match × 3 + CTR × 2 + recency
- Feed native ads every 8 cards

### 5. Ad Monetization

| Placement | Trigger |
|-----------|---------|
| feed | Every 8 stories |
| inline | 50% scroll depth |
| sticky | Mobile footer |
| sponsored_card | Related section |

### 6. Database (PostgreSQL / Supabase)

See `supabase/migrations/001_initial_schema.sql`

Tables: `posts`, `tags`, `trending_topics`, `ai_jobs`, `recommendation_sessions`, `analytics_events`, `ad_placements`, `ai_prompts`

## Deployment

1. **Vercel** — Next.js app
2. **Supabase** — DB + auth (service role for admin)
3. **Cloudflare** — CDN + R2 images
4. **OpenAI** — Content agents

## Content Moderation

1. AI generates → `publish_status: pending`
2. Human approves in `/admin/queue`
3. Published → SSR + sitemap + Discover

## Media Flywheel

```
热点 → AI生成 → Feed分发 → 广告收益 → 更多内容 → SEO流量 → 更强推荐
```
