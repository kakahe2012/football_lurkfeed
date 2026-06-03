import {
  CULTURE_IMAGES,
  cultureImageUrl,
  type CultureAspect,
} from "./culture-images";

/** FNV-1a hash → stable index for a string seed (slug, post id, etc.) */
export function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

/**
 * Detect URLs that will never render in production:
 * empty, local filesystem paths, non-http(s), broken import paths.
 */
export function isBrokenOrMissingImageUrl(url: string | null | undefined): boolean {
  if (!url || !url.trim()) return true;
  const u = url.trim();
  if (u.startsWith("file://")) return true;
  if (/^\/Users\//i.test(u)) return true;
  if (/^\/home\//i.test(u)) return true;
  if (/^[A-Za-z]:\\/.test(u)) return true;
  // Site-relative assets only (/culture/, /uploads/ from admin)
  if (u.startsWith("/") && !u.startsWith("//")) {
    return !(
      u.startsWith("/culture/") || u.startsWith("/uploads/")
    );
  }
  // Obviously placeholder / invalid
  if (u === "undefined" || u === "null") return true;
  return false;
}

/** Pick a culture image URL deterministically from seed + aspect ratio. */
export function getCultureImageUrl(seed: string, aspect: CultureAspect = "card"): string {
  const idx = hashSeed(seed || "default") % CULTURE_IMAGES.length;
  return cultureImageUrl(CULTURE_IMAGES[idx], aspect);
}

/** Second real photo in the pool if the first fallback also fails. */
export function getSecondaryCulturePhoto(seed: string): string {
  const base = hashSeed(seed || "default") % CULTURE_IMAGES.length;
  const idx = (base + 1) % CULTURE_IMAGES.length;
  return cultureImageUrl(CULTURE_IMAGES[idx]);
}

/**
 * Resolve hero/cover URL: keep valid remote URLs; swap broken ones for culture pool.
 */
export function resolveHeroImage(
  url: string | null | undefined,
  seed: string,
  aspect: CultureAspect = "card"
): string {
  if (!isBrokenOrMissingImageUrl(url)) return url!.trim();
  return getCultureImageUrl(seed, aspect);
}

/** Same URL the homepage FeedCard uses for cover (incl. culture fallback). */
export function getFeedCoverImage(
  heroImage: string | null | undefined,
  slug: string
): string {
  return resolveHeroImage(heroImage, slug, "card");
}

/**
 * Fix `<img src="...">` inside article HTML — replace broken local paths up-front
 * so SSR renders valid images (client onError still catches CDN failures).
 */
export function fixContentImageUrls(html: string, slug: string): string {
  if (!html) return html;
  let inlineIdx = 0;
  return html.replace(
    /<img(\s[^>]*?)src=(["'])([^"']*)\2/gi,
    (full, attrs, quote, src) => {
      if (!isBrokenOrMissingImageUrl(src)) return full;
      const fallback = getCultureImageUrl(`${slug}-body-${inlineIdx++}`, "inline");
      return `<img${attrs}src=${quote}${fallback}${quote}`;
    }
  );
}
