-- Seed posts for Feel Football (run after 001 + 002 migrations)
-- Safe to re-run: uses ON CONFLICT

INSERT INTO posts (
  title, slug, content, intro_hook, hero_image,
  emotion_type, feed_type, tags,
  seo_title, seo_description,
  publish_status, read_time_minutes, view_count, share_count, ctr_score,
  published_at
) VALUES
(
  'The penalty miss that haunted a country for 30 years',
  'penalty-miss-haunted-country',
  '<p>It was supposed to be the night everything changed.</p><p>Instead, football became a ghost story — one that replays every four years.</p><h2>The moment everyone remembers</h2><p>The stadium went silent in a way that felt almost violent.</p>',
  'One kick. One moment. And an entire nation still wakes up thinking about it.',
  'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80',
  'heartbreak', 'story', '["penalty","world-cup","drama"]'::jsonb,
  'The Penalty Miss That Haunted a Nation for 30 Years',
  'One kick changed everything. The emotional football story that still breaks hearts.',
  'published', 4, 48200, 3200, 0.12, NOW() - INTERVAL '10 days'
),
(
  'Why football makes grown men cry',
  'why-football-makes-grown-men-cry',
  '<p>If you have never cried at football, you might think it is dramatic.</p><p>If you have, you already know: it is never just football.</p>',
  'It is not weakness. It is the only place some people are allowed to feel everything at once.',
  'https://images.unsplash.com/photo-1522778119026-d789f791e45e?w=1200&q=80',
  'culture', 'story', '["fans","emotion","culture"]'::jsonb,
  'Why Football Makes Grown Men Cry',
  'The emotional truth behind football tears.',
  'published', 3, 91000, 8900, 0.15, NOW() - INTERVAL '9 days'
),
(
  'Stop pretending you understand offside',
  'offside-explained-simply',
  '<p>Here is offside in plain English: if you are too close to the goal without the ball, you are offside.</p>',
  'Offside is not complicated. Football just loves making beginners feel stupid.',
  'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&q=80',
  'easy_football', 'easy_football', '["offside","beginner"]'::jsonb,
  'Offside Explained Simply for New Football Fans',
  'Finally understand offside without feeling dumb.',
  'published', 2, 125000, 15000, 0.18, NOW() - INTERVAL '8 days'
),
(
  'Inside the insane luxury life of football superstars',
  'football-superstar-luxury-life',
  '<p>Some players do not just play football — they live inside a different universe.</p>',
  'Private jets. Custom boots. Watches that cost more than your house.',
  'https://images.unsplash.com/photo-1517466787929-bc90951f0981?w=1200&q=80',
  'icons', 'drama', '["luxury","players"]'::jsonb,
  'Inside Football Superstars Insane Luxury Lifestyle',
  'Private jets and lifestyles most people cannot imagine.',
  'published', 5, 203000, 22000, 0.14, NOW() - INTERVAL '7 days'
),
(
  'Why Brazil treats football like religion',
  'brazil-football-religion',
  '<p>Walk through any Brazilian neighborhood during a match and you will feel it immediately.</p>',
  'In Brazil, football is not entertainment. It is faith, family, and identity.',
  'https://images.unsplash.com/photo-1489944440615-453e1f0e6d0b?w=1200&q=80',
  'culture', 'story', '["brazil","culture"]'::jsonb,
  'Why Brazil Treats Football Like Religion',
  'Why football in Brazil is more than a sport.',
  'published', 4, 67000, 5400, 0.11, NOW() - INTERVAL '6 days'
),
(
  'The world''s most hated football club',
  'most-hated-football-club',
  '<p>Love them or hate them — this club knows how to stay in the conversation.</p>',
  'Everyone has a villain. This club became the villain for entire continents.',
  'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1200&q=80',
  'secrets', 'drama', '["rivalry","controversy"]'::jsonb,
  'The World''s Most Hated Football Club',
  'Why this club became the villain everyone loves to hate.',
  'published', 4, 156000, 18000, 0.16, NOW() - INTERVAL '5 days'
),
(
  'Did you know? Brazil once lost 7-1 at home',
  'brazil-7-1-quick-bite',
  '<p>July 8, 2014. Brazil vs Germany. 7-1. At home.</p>',
  'The scoreline that broke the internet — and an entire nation''s heart.',
  'https://images.unsplash.com/photo-1579952363873-27f3f1d92f17?w=1200&q=80',
  'heartbreak', 'quick_bite', '["brazil","world-cup"]'::jsonb,
  'Brazil''s 7-1 Defeat: The Match That Shocked the World',
  'The unbelievable scoreline that changed football history.',
  'published', 1, 89000, 12000, 0.13, NOW() - INTERVAL '4 days'
),
(
  'Why England fans suffer every World Cup',
  'england-fans-world-cup-suffering',
  '<p>Hope is England''s cruelest tradition. Every four years, the same movie plays.</p>',
  'England fans thought this was finally the year. Then everything collapsed again.',
  'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=80',
  'heartbreak', 'story', '["england","fans","world-cup"]'::jsonb,
  'Why England Fans Suffer Every World Cup',
  'The emotional cycle of hope and heartbreak.',
  'published', 3, 112000, 14000, 0.17, NOW() - INTERVAL '3 days'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  view_count = EXCLUDED.view_count,
  updated_at = NOW();
