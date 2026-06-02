const VIEWED_KEY = "ff_viewed_posts";
const HOME_VISITS_KEY = "ff_home_visits";
const MAX_VIEWED = 300;

type ViewedEntry = { id: string; at: number };

function readViewedEntries(): ViewedEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(VIEWED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ViewedEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/** Post IDs the user has opened (article detail), most recent first. */
export function getViewedPostIds(): string[] {
  return readViewedEntries().map((e) => e.id);
}

export function markPostViewed(postId: string): void {
  if (typeof window === "undefined" || !postId) return;
  try {
    let items = readViewedEntries().filter((e) => e.id !== postId);
    items.unshift({ id: postId, at: Date.now() });
    if (items.length > MAX_VIEWED) items = items.slice(0, MAX_VIEWED);
    localStorage.setItem(VIEWED_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota / private mode */
  }
}

export function getHomeVisitCount(): number {
  if (typeof window === "undefined") return 0;
  const n = parseInt(localStorage.getItem(HOME_VISITS_KEY) || "0", 10);
  return Number.isFinite(n) ? n : 0;
}

/** Call once per homepage mount (before incrementing if checking discover). */
export function markHomeVisit(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(HOME_VISITS_KEY, String(getHomeVisitCount() + 1));
}

/** Second+ homepage visit → prioritize unseen stories. */
export function shouldUseDiscoverFeed(): boolean {
  return getHomeVisitCount() >= 1;
}
