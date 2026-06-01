-- Football Entertainment Platform - Initial Schema
-- Run via Supabase CLI or SQL editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Emotion types enum
CREATE TYPE emotion_type AS ENUM (
  'hype', 'heartbreak', 'icons', 'secrets', 'culture', 'easy_football'
);

CREATE TYPE feed_type AS ENUM (
  'story', 'quick_bite', 'drama', 'easy_football'
);

CREATE TYPE publish_status AS ENUM (
  'draft', 'pending', 'published', 'rejected'
);

CREATE TYPE ai_job_type AS ENUM (
  'topic_hunt', 'headline', 'write', 'rewrite', 'seo', 'thumbnail', 'publish'
);

CREATE TYPE ai_job_status AS ENUM (
  'queued', 'running', 'completed', 'failed'
);

-- Posts (main content)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  intro_hook TEXT NOT NULL DEFAULT '',
  hero_image TEXT NOT NULL DEFAULT '',
  emotion_type emotion_type NOT NULL DEFAULT 'hype',
  feed_type feed_type NOT NULL DEFAULT 'story',
  tags JSONB DEFAULT '[]'::jsonb,
  seo_title TEXT NOT NULL DEFAULT '',
  seo_description TEXT NOT NULL DEFAULT '',
  og_image TEXT,
  publish_status publish_status NOT NULL DEFAULT 'draft',
  read_time_minutes INT NOT NULL DEFAULT 3,
  view_count INT NOT NULL DEFAULT 0,
  share_count INT NOT NULL DEFAULT 0,
  ctr_score FLOAT NOT NULL DEFAULT 0,
  schema_json JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_emotion ON posts(emotion_type);
CREATE INDEX idx_posts_status ON posts(publish_status);
CREATE INDEX idx_posts_published ON posts(published_at DESC);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  post_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trending topics (AI topic pool)
CREATE TABLE trending_topics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  emotion_hint emotion_type,
  score FLOAT NOT NULL DEFAULT 0,
  summary TEXT NOT NULL DEFAULT '',
  raw_data JSONB DEFAULT '{}'::jsonb,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trending_score ON trending_topics(score DESC);

-- AI jobs queue
CREATE TABLE ai_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type ai_job_type NOT NULL,
  prompt TEXT NOT NULL DEFAULT '',
  result JSONB DEFAULT '{}'::jsonb,
  status ai_job_status NOT NULL DEFAULT 'queued',
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_ai_jobs_status ON ai_jobs(status);
CREATE INDEX idx_ai_jobs_type ON ai_jobs(job_type);

-- Recommendations / user emotion profiles
CREATE TABLE recommendation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  emotion_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  recent_post_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Analytics events
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  session_id TEXT,
  emotion_type emotion_type,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_post ON analytics_events(post_id);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);

-- Ad placements
CREATE TABLE ad_placements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  placement TEXT NOT NULL,
  html_snippet TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  rpm FLOAT DEFAULT 0,
  impressions INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI prompt templates (admin control)
CREATE TABLE ai_prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_name TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  emotion_intensity INT NOT NULL DEFAULT 5,
  topic_priorities JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS policies (public read for published posts)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  USING (publish_status = 'published');

CREATE POLICY "Service role full access posts"
  ON posts FOR ALL
  USING (auth.role() = 'service_role');

-- Seed default ad placements
INSERT INTO ad_placements (name, placement, html_snippet, active) VALUES
  ('Feed Native Ad', 'feed', '<div class="ad-native">Sponsored · World Cup Jerseys</div>', true),
  ('Article Inline', 'inline', '<div class="ad-inline">Advertisement</div>', true),
  ('Mobile Sticky Footer', 'sticky', '<div class="ad-sticky">Ad</div>', true),
  ('Sponsored Card', 'sponsored_card', '<div class="ad-sponsored">Sponsored Story</div>', true);

-- Seed AI prompts
INSERT INTO ai_prompts (agent_name, prompt_template, emotion_intensity) VALUES
  ('topic_hunter', 'Find trending football topics for new/casual fans. Focus on emotion, drama, culture. Sources: {{sources}}', 7),
  ('headline_generator', 'Generate 20 high-CTR emotional headlines. Style: BuzzFeed/TikTok. Topic: {{topic}}. Emotion: {{emotion}}', 8),
  ('story_writer', 'Write cinematic emotional football story. NOT journalism. Hook→Story→Emotion→Conflict→Ending. Topic: {{topic}}', 9),
  ('rewrite', 'Rewrite into unique emotional beginner-friendly content. Original: {{content}}', 7),
  ('seo', 'Generate SEO title, meta description, tags, schema for: {{title}}', 5),
  ('thumbnail', 'Describe emotional cover image for: {{title}}. Style: cinematic, bold, social-native', 6);
