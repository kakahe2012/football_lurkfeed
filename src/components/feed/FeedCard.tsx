"use client";

import { StoryLink } from "@/components/navigation/StoryLink";
import { Heart, Play } from "lucide-react";
import type { Post } from "@/types";
import { EMOTION_LABELS } from "@/types";
import { formatReadTime, buildStoryUrl } from "@/lib/utils";
import { calculateWeightedLikes, formatLikeCount } from "@/lib/engagement";
import { isVideoPost } from "@/lib/video";
import { ShareButton } from "@/components/ui/ShareButton";
import { TagChips } from "@/components/tags/TagChips";
import { FallbackImage } from "@/components/media/FallbackImage";

export type FeedCardVariant = "featured" | "card" | "snippet";

interface FeedCardProps {
  post: Post;
  variant: FeedCardVariant;
  siteUrl?: string;
  /** Homepage feed hides likes; article related cards may still show them. */
  showLikeButton?: boolean;
}

function PlayOverlay({ large = false }: { large?: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <span
        className={`flex items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition group-hover:bg-black/70 ${
          large ? "h-16 w-16" : "h-11 w-11"
        }`}
      >
        <Play size={large ? 26 : 18} className="ml-0.5 fill-white" />
      </span>
    </div>
  );
}

function VideoBadge() {
  return (
    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/65 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm">
      <Play size={11} className="fill-white" /> Video
    </span>
  );
}

export function FeedCard({
  post,
  variant,
  siteUrl = "",
  showLikeButton = true,
}: FeedCardProps) {
  const emotion = EMOTION_LABELS[post.emotion_type];
  const shareUrl = buildStoryUrl(
    post.slug,
    siteUrl ||
      (typeof window !== "undefined" ? window.location.origin : undefined)
  );
  const likeCount = formatLikeCount(calculateWeightedLikes(post));
  const isVideo = isVideoPost(post);

  const likeButton = showLikeButton ? (
    <button
      type="button"
      className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white px-2.5 py-1.5 text-xs font-medium text-rose-600 shadow-sm"
      aria-label={`${likeCount} likes`}
    >
      <Heart size={14} className="fill-rose-100" />
      {likeCount}
    </button>
  ) : null;

  if (variant === "featured") {
    return (
      <article className="masonry-item overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/80">
        <StoryLink href={`/story/${post.slug}`} className="group block">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-stone-100">
            <FallbackImage
              src={post.hero_image}
              fallbackSeed={post.slug}
              aspect="card"
              alt={post.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {isVideo && (
              <>
                <VideoBadge />
                <PlayOverlay large />
              </>
            )}
          </div>
          <div className="p-4">
            <span className="text-xs font-medium text-stone-500">
              {emotion.emoji} {emotion.label}
            </span>
            <h2 className="mt-2 text-lg font-semibold leading-snug text-stone-900 group-hover:text-teal-800">
              {post.title}
            </h2>
            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-600">
              {post.intro_hook}
            </p>
            <TagChips tags={post.tags} className="mt-3" max={3} />
          </div>
        </StoryLink>
        <div className="flex items-center justify-between border-t border-stone-100 px-4 py-3">
          <span className="text-xs text-stone-400">{formatReadTime(post.read_time_minutes)}</span>
          <div className="flex items-center gap-2">
            {likeButton}
            <ShareButton url={shareUrl} title={post.title} label="Copy link" copiedLabel="Copied" size="sm" />
          </div>
        </div>
      </article>
    );
  }

  if (variant === "snippet") {
    return (
      <article className="masonry-item rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/80">
        <StoryLink href={`/story/${post.slug}`} className="group block">
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
            {isVideo ? (
              <>
                <Play size={11} className="fill-stone-500 text-stone-500" /> Watch · {formatReadTime(post.read_time_minutes)}
              </>
            ) : (
              <>
                {emotion.emoji} Quick read · {formatReadTime(post.read_time_minutes)}
              </>
            )}
          </span>
          <h3 className="mt-3 text-base font-semibold leading-snug text-stone-900 group-hover:text-teal-800">
            {post.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{post.intro_hook}</p>
          <TagChips tags={post.tags} className="mt-3" max={2} />
        </StoryLink>
        <div className="mt-3 flex items-center justify-between">
          <StoryLink href={`/story/${post.slug}`} className="text-xs font-medium text-teal-700 hover:underline">
            Read →
          </StoryLink>
          <div className="flex items-center gap-2">
            {likeButton}
            <ShareButton url={shareUrl} title={post.title} label="Copy link" copiedLabel="Copied" size="sm" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="masonry-item overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/80">
      <StoryLink href={`/story/${post.slug}`} className="group block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
          <FallbackImage src={post.hero_image} fallbackSeed={post.slug} aspect="card" alt={post.title} fill className="object-cover transition duration-300 group-hover:scale-[1.02]" sizes="(max-width: 768px) 50vw, 33vw" />
          {isVideo && (
            <>
              <VideoBadge />
              <PlayOverlay />
            </>
          )}
        </div>
        <div className="p-3.5">
          <span className="text-xs text-stone-500">{emotion.emoji} {emotion.label}</span>
          <h3 className="mt-1.5 line-clamp-3 text-sm font-semibold leading-snug text-stone-900 group-hover:text-teal-800">
            {post.title}
          </h3>
          <TagChips tags={post.tags} className="mt-2" max={2} />
        </div>
      </StoryLink>
      <div className="flex justify-end gap-2 border-t border-stone-50 px-3 py-2">
        {likeButton}
        <ShareButton url={shareUrl} title={post.title} label="Copy link" copiedLabel="Copied" size="sm" />
      </div>
    </article>
  );
}
