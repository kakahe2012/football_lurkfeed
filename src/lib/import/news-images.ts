/** Maps `001-*.jpg` filenames to article slugs and public upload URLs. */

export const NEWS_ARTICLE_PREFIX_TO_SLUG: Record<string, string> = {
  "001": "final-rosters-locked-world-cup",
  "002": "world-cup-stats-records",
  "003": "most-valuable-world-cup-players",
  "004": "world-cup-winning-probability",
  "005": "fox-top-100-world-cup-players",
  "006": "spain-billion-euro-squad-world-cup",
  "007": "england-world-cup-wealth-list",
  "008": "who-wins-world-cup-predictions",
  "009": "england-baked-beans-secret-weapon",
  "010": "england-100m-luxury-world-cup-hotel",
  "011": "top-10-most-valuable-world-cup-players",
  "012": "seven-rising-stars-world-cup",
  "013": "goldman-sachs-opta-spain-wins-prediction",
  "014": "bbc-top-10-world-cup-jerseys",
  "015": "messi-ronaldo-world-cup-scoreboard",
  "016": "mbappe-girlfriend-drama-petition-world-cup",
  "017": "france-16-billion-squad-world-cup-preview",
  "018": "neymar-calf-injury-last-world-cup",
};

export function newsImageUrl(slug: string, filename: string): string {
  return `/uploads/articles/${slug}/${filename}`;
}

export function slugFromNewsImageFilename(filename: string): string | null {
  const m = filename.match(/^(\d{3})-/);
  if (!m) return null;
  return NEWS_ARTICLE_PREFIX_TO_SLUG[m[1]] ?? null;
}
