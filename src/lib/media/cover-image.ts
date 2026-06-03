import { resolveHeroImage } from "@/lib/media/resolve-image";

/**
 * Feed + article hero block both use `hero_image` only (never body HTML).
 */
export function resolvePostCoverForFeed(post: {
  hero_image: string;
  slug: string;
}): string {
  return resolveHeroImage(post.hero_image, post.slug, "card");
}
