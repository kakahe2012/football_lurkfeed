import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatReadTime(minutes: number): string {
  return `${minutes} min read`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .trim()
    .slice(0, 80);
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 3) + "...";
}

/** Production canonical: https://football.lurkfeed.com */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  const withoutTrailingSlash = raw.replace(/\/+$/, "");
  if (/^https?:\/\//i.test(withoutTrailingSlash)) {
    return withoutTrailingSlash;
  }
  return `https://${withoutTrailingSlash}`;
}

/** Absolute URL for a story detail page (feed share, copy link, OG, etc.). */
export function buildStoryUrl(slug: string, origin?: string): string {
  const base = (origin || getSiteUrl()).replace(/\/+$/, "");
  return `${base}/story/${slug}`;
}

/** Ensure a path or partial URL becomes an absolute URL for clipboard sharing. */
export function toAbsoluteUrl(url: string, origin?: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  const base = (
    origin ||
    (typeof window !== "undefined" ? window.location.origin : getSiteUrl())
  ).replace(/\/+$/, "");
  return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
}
