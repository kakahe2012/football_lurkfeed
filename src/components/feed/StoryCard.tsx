"use client";

import { StoryLink } from "@/components/navigation/StoryLink";
import { FallbackImage } from "@/components/media/FallbackImage";
import { motion } from "framer-motion";
import type { Post } from "@/types";
import { EMOTION_LABELS } from "@/types";
import { cn, formatReadTime } from "@/lib/utils";

interface StoryCardProps {
  post: Post;
  variant?: "hero" | "standard" | "compact" | "horizontal";
  index?: number;
}

export function StoryCard({ post, variant = "standard", index = 0 }: StoryCardProps) {
  const emotion = EMOTION_LABELS[post.emotion_type];

  if (variant === "hero") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="col-span-2 row-span-2"
      >
        <StoryLink href={`/story/${post.slug}`} className="group block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-[3/4]">
            <FallbackImage
              src={post.hero_image}
              fallbackSeed={post.slug}
              aspect="hero"
              alt={post.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index < 2}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="text-sm">
                {emotion.emoji} {emotion.label}
              </span>
              <h2 className="mt-2 text-2xl font-black leading-tight text-white md:text-3xl">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-white/70">
                {post.intro_hook}
              </p>
            </div>
          </div>
        </StoryLink>
      </motion.article>
    );
  }

  if (variant === "compact") {
    return (
      <motion.article
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.04 }}
      >
        <StoryLink href={`/story/${post.slug}`} className="group block">
          <div className="relative aspect-square overflow-hidden rounded-xl">
            <FallbackImage
              src={post.hero_image}
              fallbackSeed={post.slug}
              aspect="card"
              alt={post.title}
              fill
              className="object-cover transition group-hover:scale-105"
              sizes="50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 p-3">
              <span className="text-xs">{emotion.emoji}</span>
              <h3 className="mt-1 line-clamp-3 text-sm font-bold leading-snug text-white">
                {post.title}
              </h3>
            </div>
          </div>
        </StoryLink>
      </motion.article>
    );
  }

  if (variant === "horizontal") {
    return (
      <motion.article
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="min-w-[280px] flex-shrink-0"
      >
        <StoryLink
          href={`/story/${post.slug}`}
          className="flex gap-3 rounded-xl bg-white/5 p-3 transition hover:bg-white/10"
        >
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
            <FallbackImage
              src={post.hero_image}
              fallbackSeed={post.slug}
              aspect="card"
              alt=""
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-xs text-white/50">
              {emotion.emoji} {formatReadTime(post.read_time_minutes)}
            </span>
            <h3 className="line-clamp-2 text-sm font-bold text-white">{post.title}</h3>
          </div>
        </StoryLink>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={cn(post.feed_type === "quick_bite" && "col-span-1")}
    >
      <StoryLink href={`/story/${post.slug}`} className="group block">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <FallbackImage
            src={post.hero_image}
            fallbackSeed={post.slug}
            aspect="card"
            alt={post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
          {post.feed_type === "quick_bite" && (
            <span className="absolute left-3 top-3 rounded-full bg-violet-500/90 px-2 py-0.5 text-xs font-bold">
              Quick Bite
            </span>
          )}
          <div className="absolute bottom-0 p-4">
            <span className="text-xs text-white/60">
              {emotion.emoji} {emotion.label}
            </span>
            <h3 className="mt-1 line-clamp-3 text-base font-bold leading-snug text-white">
              {post.title}
            </h3>
          </div>
        </div>
      </StoryLink>
    </motion.article>
  );
}
