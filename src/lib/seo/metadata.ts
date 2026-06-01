import type { Metadata } from "next";
import type { Post } from "@/types";
import { getSiteUrl } from "@/lib/utils";

const SITE_NAME = "LurkFeed Football";

/**
 * Build a Metadata object for an article page.
 *
 * What's special vs a vanilla Next metadata helper:
 *   - Adds `keywords` (legacy SEO + Bing) AND `news_keywords` (Google News).
 *   - Pre-computes `article:author`, `article:section`, `article:tag` for
 *     Facebook / OpenGraph parsers.
 *   - Sets `robots.max-snippet/max-image-preview` so AI Overviews + LinkedIn
 *     can lift larger excerpts (the default 160-char limit hurts citation).
 */
export function buildPostMetadata(post: Post): Metadata {
  const url = `${getSiteUrl()}/story/${post.slug}`;
  const title = post.seo_title || post.title;
  const description = post.seo_description || post.intro_hook;

  return {
    title,
    description,
    keywords: post.tags,
    authors: [{ name: SITE_NAME }],
    category: post.tags[0] || undefined,
    openGraph: {
      title,
      description,
      type: "article",
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: post.og_image || post.hero_image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      publishedTime: post.published_at,
      modifiedTime: post.published_at,
      authors: [SITE_NAME],
      section: post.tags[0],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.og_image || post.hero_image],
    },
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    other: {
      // Google News uses this comma-separated list for surfacing.
      news_keywords: post.tags.join(", "),
    },
  };
}
