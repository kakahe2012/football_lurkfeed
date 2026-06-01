import type { Post } from "@/types";

export type VideoProvider = "youtube" | "vimeo" | "file";

export interface VideoEmbedInfo {
  provider: VideoProvider;
  /** Safe URL to put in an <iframe src> (youtube/vimeo) */
  embedUrl?: string;
  /** Direct media URL for <video src> (file) */
  fileUrl?: string;
  /** Best-effort thumbnail */
  thumbnail?: string;
}

const YT_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

const VIMEO_HOSTS = new Set(["vimeo.com", "www.vimeo.com", "player.vimeo.com"]);

/** Only allow ids made of safe characters to avoid injection into the iframe URL. */
function isSafeId(id: string): boolean {
  return /^[A-Za-z0-9_-]{1,64}$/.test(id);
}

/**
 * Parse an external video URL into a safe, embeddable form.
 * Returns null for anything that is not on the trusted provider whitelist —
 * this is the core defense against iframe-based XSS / clickjacking.
 */
export function parseVideoUrl(rawUrl: string | undefined | null): VideoEmbedInfo | null {
  if (!rawUrl) return null;

  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return null;
  }

  if (url.protocol !== "https:") return null;

  const host = url.hostname.toLowerCase();

  // YouTube
  if (YT_HOSTS.has(host)) {
    let id = "";
    if (host === "youtu.be" || host === "www.youtu.be") {
      id = url.pathname.slice(1);
    } else if (url.pathname.startsWith("/shorts/")) {
      id = url.pathname.split("/")[2] || "";
    } else if (url.pathname.startsWith("/embed/")) {
      id = url.pathname.split("/")[2] || "";
    } else {
      id = url.searchParams.get("v") || "";
    }
    if (!isSafeId(id)) return null;
    return {
      provider: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    };
  }

  // Vimeo
  if (VIMEO_HOSTS.has(host)) {
    const parts = url.pathname.split("/").filter(Boolean);
    const id = parts[parts.length - 1] || "";
    if (!/^\d{1,15}$/.test(id)) return null;
    return {
      provider: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${id}`,
    };
  }

  // Direct video file (mp4/webm) on https
  if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
    return { provider: "file", fileUrl: url.toString() };
  }

  return null;
}

/** A post is treated as a video only when it declares the type AND has a valid embed. */
export function isVideoPost(post: Pick<Post, "media_type" | "video_url">): boolean {
  return post.media_type === "video" && parseVideoUrl(post.video_url) !== null;
}
