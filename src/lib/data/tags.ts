import type { Post } from "@/types";
import { getPublishedPosts } from "./posts";
import { CONTENT_TAGS, getTagLabel, getAllTags } from "./tag-definitions";

export { CONTENT_TAGS, getTagLabel, getAllTags };

export async function getPostsByTag(tag: string): Promise<Post[]> {
  const all = await getPublishedPosts(200);
  return all
    .filter((p) => p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()))
    .sort((a, b) => b.view_count - a.view_count);
}

export async function getTagStats(): Promise<{ slug: string; label: string; count: number }[]> {
  const all = await getPublishedPosts(200);
  return CONTENT_TAGS.map((t) => ({
    slug: t.slug,
    label: t.label,
    count: all.filter((p) => p.tags.map((x) => x.toLowerCase()).includes(t.slug)).length,
  })).filter((t) => t.count > 0);
}
