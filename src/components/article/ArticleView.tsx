"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { StoryLink } from "@/components/navigation/StoryLink";
import { ArrowLeft, ChevronRight } from "lucide-react";
import type { Post } from "@/types";
import { EMOTION_LABELS } from "@/types";
import { formatReadTime, slugify } from "@/lib/utils";
import { ShareButton } from "@/components/ui/ShareButton";
import { FeedCard } from "@/components/feed/FeedCard";
import { TagChips } from "@/components/tags/TagChips";
import { AdSlot } from "@/components/ads/AdSlot";
import { VideoEmbed } from "@/components/media/VideoEmbed";
import { FallbackImage } from "@/components/media/FallbackImage";
import { isVideoPost } from "@/lib/video";
import {
  getCultureImageUrl,
  getSecondaryCulturePhoto,
  isBrokenOrMissingImageUrl,
} from "@/lib/media/resolve-image";
import { trackEvent } from "@/lib/analytics/track";

/**
 * Add stable `id` attributes to every <h2>/<h3> in the body.
 *
 * Why: AI engines (and Google's "jump to" feature) deep-link straight to a
 * heading via `#slug` or `#:~:text=`. Without IDs, the link lands on the
 * page but doesn't anchor — the citation looks broken to the user. With
 * IDs, ChatGPT / Perplexity / Bing can produce "according to LurkFeed
 * Football, [section title]…" with a working anchor.
 *
 * Done in JS rather than during HTML import so legacy posts that were
 * imported before this change automatically benefit.
 */
function addHeadingAnchors(html: string): string {
  return html.replace(
    /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (full, tag, attrs, inner) => {
      if (/\bid\s*=/.test(attrs)) return full; // already has an id
      const text = inner.replace(/<[^>]+>/g, " ").trim();
      const id = slugify(text).slice(0, 60);
      if (!id) return full;
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    }
  );
}

interface ArticleViewProps {
  post: Post;
  related: Post[];
  nextPost?: Post | null;
}

export function ArticleView({ post, related, nextPost }: ArticleViewProps) {
  const emotion = EMOTION_LABELS[post.emotion_type];
  const contentRef = useRef<HTMLDivElement>(null);
  const trackedMilestones = useRef<Set<number>>(new Set());
  const [siteUrl, setSiteUrl] = useState("");
  const [showInlineAd, setShowInlineAd] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [post.slug]);

  useEffect(() => {
    setSiteUrl(window.location.origin);
    trackEvent("page_view", {
      postId: post.id,
      emotionType: post.emotion_type,
      pagePath: `/story/${post.slug}`,
    });
  }, [post.id, post.emotion_type, post.slug]);

  useEffect(() => {
    const onScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight;
      const viewed = Math.min(total, Math.max(0, window.innerHeight - rect.top));
      const depth = Math.round((viewed / total) * 100);
      if (depth >= 50 && !showInlineAd) setShowInlineAd(true);
      for (const milestone of [50, 90]) {
        if (depth >= milestone && !trackedMilestones.current.has(milestone)) {
          trackedMilestones.current.add(milestone);
          trackEvent("scroll_depth", {
            postId: post.id,
            emotionType: post.emotion_type,
            metadata: { scroll_depth: milestone },
          });
          if (milestone === 90) {
            trackEvent("read_complete", { postId: post.id, emotionType: post.emotion_type });
          }
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [post.id, post.emotion_type, showInlineAd]);

  const articleUrl = siteUrl ? `${siteUrl}/story/${post.slug}` : `/story/${post.slug}`;
  const isVideo = isVideoPost(post);
  const contentWithAnchors = useMemo(
    () => addHeadingAnchors(post.content),
    [post.content]
  );

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const imgs = root.querySelectorAll<HTMLImageElement>("img");
    imgs.forEach((img, i) => {
      const seed = `${post.slug}-inline-${i}`;
      const src = img.getAttribute("src") || "";
      if (isBrokenOrMissingImageUrl(src)) {
        img.src = getCultureImageUrl(seed, "inline");
      }
      const onErr = () => {
        if (img.dataset.lfTier === "2") return;
        if (img.dataset.lfTier !== "1") {
          img.dataset.lfTier = "1";
          img.src = getCultureImageUrl(seed, "inline");
          return;
        }
        img.dataset.lfTier = "2";
        img.src = getSecondaryCulturePhoto(seed);
      };
      img.addEventListener("error", onErr);
    });
  }, [post.slug, contentWithAnchors]);

  return (
    <article className="min-h-screen pb-28">
      {/*
        Sticky article toolbar.
        - Lives inline with the article (scrolls with content as the user reads).
        - Sticks at top-14 (56px) — i.e. directly below the always-pinned
          HeaderBar. The TagBar in SiteHeader is intentionally NOT sticky, so it
          scrolls away naturally and this toolbar takes its place flush against
          the header. The previous top-[6.5rem] left a 48px gap once TagBar
          scrolled out of view.
        - z-30 so it sits below HeaderBar (z-50) but above article body.
      */}
      <div className="sticky top-14 z-30 border-b border-stone-200/80 bg-[#FAF8F5]/95 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2 py-2">
          <Link href="/" className="inline-flex items-center gap-1 rounded-full px-2 py-1.5 text-sm text-stone-600 hover:bg-stone-100">
            <ArrowLeft size={16} /> Back
          </Link>
          <div className="flex items-center gap-2">
            <ShareButton url={articleUrl} title={post.title} label="Copy link" copiedLabel="Copied" size="sm" onShared={() => trackEvent("share", { postId: post.id })} />
            {nextPost && (
              <StoryLink href={`/story/${nextPost.slug}`} className="inline-flex items-center gap-0.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-50">
                Next <ChevronRight size={16} />
              </StoryLink>
            )}
          </div>
        </div>
      </div>

      <div className="relative pt-4">
        {isVideo ? (
          <VideoEmbed url={post.video_url} title={post.title} />
        ) : (
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-stone-100 shadow-sm ring-1 ring-stone-200/80">
            <FallbackImage
              src={post.hero_image}
              fallbackSeed={post.slug}
              aspect="hero"
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        )}
      </div>

      <div className="pt-6">
        <span className="text-sm text-stone-500">{emotion.emoji} {emotion.label} · {formatReadTime(post.read_time_minutes)}</span>
        <h1 className="mt-3 text-2xl font-semibold leading-tight text-stone-900 md:text-3xl">{post.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">{post.intro_hook}</p>
        <TagChips tags={post.tags} className="mt-4" max={6} />

        <div ref={contentRef} className="prose-article mt-8" dangerouslySetInnerHTML={{ __html: contentWithAnchors }} />
        {showInlineAd && <AdSlot placement="inline" className="my-8" />}

        <div className="mt-10 flex flex-wrap gap-3 rounded-2xl bg-white p-4 ring-1 ring-stone-200/80">
          <ShareButton url={articleUrl} title={post.title} label="Copy article link" copiedLabel="Copied" onShared={() => trackEvent("share", { postId: post.id })} />
          <Link href="/" className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100">
            More stories
          </Link>
        </div>

        {related.length > 0 && (
          <section className="mt-12 lg:hidden">
            <h2 className="text-base font-semibold text-stone-800">You may also like</h2>
            <div className="masonry-columns mt-4">
              {related.slice(0, 4).map((r, i) => (
                <FeedCard key={r.id} post={r} variant={i === 0 ? "featured" : "card"} siteUrl={siteUrl} />
              ))}
            </div>
          </section>
        )}

        {nextPost && (
          <StoryLink href={`/story/${nextPost.slug}`} className="mt-8 flex items-center gap-4 overflow-hidden rounded-2xl bg-white p-3 ring-1 ring-stone-200/80 hover:ring-teal-200">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-stone-100">
              <FallbackImage
                src={nextPost.hero_image}
                fallbackSeed={nextPost.slug}
                aspect="card"
                alt=""
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-teal-700">Next story</p>
              <p className="line-clamp-2 font-medium text-stone-900">{nextPost.title}</p>
            </div>
            <ChevronRight className="shrink-0 text-stone-400" size={20} />
          </StoryLink>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-2">
          <ShareButton url={articleUrl} title={post.title} label="Copy link" copiedLabel="Copied" size="sm" className="flex-1 justify-center" />
          {nextPost ? (
            <StoryLink href={`/story/${nextPost.slug}`} className="flex flex-1 items-center justify-center gap-1 rounded-full bg-teal-700 px-4 py-2 text-sm font-medium text-white">
              Next <ChevronRight size={16} />
            </StoryLink>
          ) : (
            <Link href="/" className="flex flex-1 items-center justify-center rounded-full bg-stone-800 px-4 py-2 text-sm font-medium text-white">
              Home
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
