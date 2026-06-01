-- Enhanced analytics: referrer, UTM, page path, click tracking

ALTER TABLE analytics_events
  ADD COLUMN IF NOT EXISTS referrer TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS page_path TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT;

CREATE INDEX IF NOT EXISTS idx_analytics_referrer ON analytics_events(referrer);
CREATE INDEX IF NOT EXISTS idx_analytics_utm ON analytics_events(utm_source);
CREATE INDEX IF NOT EXISTS idx_analytics_page_path ON analytics_events(page_path);
CREATE INDEX IF NOT EXISTS idx_analytics_created_post ON analytics_events(post_id, created_at DESC);

-- Daily post stats view (for admin dashboard)
CREATE OR REPLACE VIEW post_stats_daily AS
SELECT
  post_id,
  DATE(created_at) AS stat_date,
  COUNT(*) FILTER (WHERE event_type = 'page_view') AS page_views,
  COUNT(*) FILTER (WHERE event_type = 'share') AS shares,
  COUNT(*) FILTER (WHERE event_type = 'read_complete') AS read_completes,
  COUNT(DISTINCT session_id) AS unique_sessions,
  ROUND(AVG((metadata->>'scroll_depth')::numeric) FILTER (WHERE event_type = 'scroll_depth'), 1) AS avg_scroll_depth
FROM analytics_events
WHERE post_id IS NOT NULL
GROUP BY post_id, DATE(created_at);

-- Traffic sources per post
CREATE OR REPLACE VIEW post_traffic_sources AS
SELECT
  post_id,
  COALESCE(utm_source, referrer, 'direct') AS source,
  COUNT(*) AS visits
FROM analytics_events
WHERE event_type = 'page_view' AND post_id IS NOT NULL
GROUP BY post_id, COALESCE(utm_source, referrer, 'direct');

-- Increment view_count trigger helper function
CREATE OR REPLACE FUNCTION increment_post_view_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.event_type = 'page_view' AND NEW.post_id IS NOT NULL THEN
    UPDATE posts SET view_count = view_count + 1 WHERE id = NEW.post_id;
  END IF;
  IF NEW.event_type = 'share' AND NEW.post_id IS NOT NULL THEN
    UPDATE posts SET share_count = share_count + 1 WHERE id = NEW.post_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_increment_post_views ON analytics_events;
CREATE TRIGGER trg_increment_post_views
  AFTER INSERT ON analytics_events
  FOR EACH ROW
  EXECUTE FUNCTION increment_post_view_count();
