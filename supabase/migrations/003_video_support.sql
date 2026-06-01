-- Video support + media type for posts
-- Run after 001_initial_schema.sql and 002_analytics_enhanced.sql

CREATE TYPE media_type AS ENUM ('article', 'video');

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS media_type media_type NOT NULL DEFAULT 'article',
  ADD COLUMN IF NOT EXISTS video_url TEXT;

CREATE INDEX IF NOT EXISTS idx_posts_media_type ON posts(media_type);
