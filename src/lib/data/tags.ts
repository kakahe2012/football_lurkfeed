import type { Post } from "@/types";
import { getPublishedPosts } from "./posts";
import { CONTENT_TAGS, getTagLabel, getAllTags } from "./tag-definitions";

export { CONTENT_TAGS, getTagLabel, getAllTags };

const TAG_CHANNEL_KEYWORDS: Record<string, string[]> = {
  "world-cup": ["world cup", "world-cup", "fifa", "golden boot", "ticket", "2026"],
  fans: ["fans", "meme", "wag", "culture", "lisa", "viral", "jersey", "lifestyle"],
  heartbreak: ["heartbreak", "upset", "loss", "elimination", "controversial"],
  legends: ["legends", "icon", "messi", "ronaldo", "mbappe", "neymar", "dybala"],
  drama: ["drama", "scandal", "controversy", "snubbed", "furious", "transfer", "divorce"],
  beginner: ["beginner", "new fan", "guide", "explained", "easy football", "rules"],
  rivalry: ["rivalry", "derby", "vs", "argentina", "england", "brazil", "spain", "france"],
  luxury: ["luxury", "lifestyle", "wag", "fashion", "rich", "expensive"],
};

function postMatchesChannelTag(post: Post, channelTag: string): boolean {
  const keywords = TAG_CHANNEL_KEYWORDS[channelTag];
  if (!keywords?.length) return false;
  const haystack = [
    post.slug,
    post.title,
    post.intro_hook,
    ...(post.tags || []),
    post.emotion_type,
    post.feed_type,
  ]
    .join(" ")
    .toLowerCase();

  return keywords.some((kw) => haystack.includes(kw.toLowerCase()));
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const all = await getPublishedPosts(200);
  const normalizedTag = tag.toLowerCase();

  // 1) Strict tag match for detail tags (existing behavior).
  const exact = all.filter((p) =>
    p.tags.map((t) => t.toLowerCase()).includes(normalizedTag)
  );
  if (exact.length) {
    return exact.sort((a, b) => b.view_count - a.view_count);
  }

  // 2) Channel-style fuzzy match for top nav tags.
  const channel = all.filter((p) => postMatchesChannelTag(p, normalizedTag));
  if (channel.length) {
    return channel.sort((a, b) => b.view_count - a.view_count);
  }

  return [];
}

export async function getTagStats(): Promise<{ slug: string; label: string; count: number }[]> {
  const all = await getPublishedPosts(200);
  return CONTENT_TAGS.map((t) => ({
    slug: t.slug,
    label: t.label,
    count: all.filter((p) => {
      const tags = p.tags.map((x) => x.toLowerCase());
      return tags.includes(t.slug) || postMatchesChannelTag(p, t.slug);
    }).length,
  })).filter((t) => t.count > 0);
}
