/** Defaults from AdSense ad units (override via NEXT_PUBLIC_* in Vercel). */

export const DEFAULT_ADSENSE_CLIENT = "ca-pub-8307718514196180";

/** Fluid in-feed — homepage masonry */
export const DEFAULT_FEED_SLOT = "8946548739";
export const DEFAULT_FEED_LAYOUT_KEY = "-6t+ed+2i-1n-4w";

/** In-article fluid — story body ~50% */
export const DEFAULT_INLINE_SLOT = "1877057591";

/** Mobile bottom banner (dibu) — auto responsive */
export const DEFAULT_STICKY_SLOT = "5394316539";

/** Desktop sidebar — fixed 360×800 display unit */
export const DEFAULT_SIDEBAR_SLOT = "8862788253";
export const SIDEBAR_AD_WIDTH = 360;
export const SIDEBAR_AD_HEIGHT = 800;

export function resolveAdsenseClient(): string {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT || DEFAULT_ADSENSE_CLIENT;
}
