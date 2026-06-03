/** Maps `001-*.jpg` filenames to article slugs and public upload URLs. */

export const NEWS_ARTICLE_PREFIX_TO_SLUG: Record<string, string> = {
  "001": "final-rosters-locked-world-cup",
  "002": "world-cup-stats-records",
  "003": "most-valuable-world-cup-players",
  "004": "world-cup-winning-probability",
  "005": "fox-top-100-world-cup-players",
};

export function newsImageUrl(slug: string, filename: string): string {
  return `/uploads/articles/${slug}/${filename}`;
}

export function slugFromNewsImageFilename(filename: string): string | null {
  const m = filename.match(/^(\d{3})-/);
  if (!m) return null;
  return NEWS_ARTICLE_PREFIX_TO_SLUG[m[1]] ?? null;
}
