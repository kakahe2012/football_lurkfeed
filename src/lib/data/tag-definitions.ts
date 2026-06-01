/** 标签定义（客户端/服务端均可安全导入） */
export const CONTENT_TAGS = [
  { slug: "world-cup", label: "World Cup", group: "event" },
  { slug: "fans", label: "Fans & Culture", group: "culture" },
  { slug: "heartbreak", label: "Heartbreak", group: "emotion" },
  { slug: "legends", label: "Legends", group: "players" },
  { slug: "drama", label: "Drama", group: "emotion" },
  { slug: "beginner", label: "New Fan Guide", group: "easy" },
  { slug: "rivalry", label: "Rivalry", group: "teams" },
  { slug: "luxury", label: "Star Lifestyle", group: "players" },
  { slug: "penalty", label: "Penalties", group: "moments" },
  { slug: "brazil", label: "Brazil", group: "countries" },
  { slug: "england", label: "England", group: "countries" },
  { slug: "offside", label: "Rules Explained", group: "easy" },
] as const;

export type ContentTagSlug = (typeof CONTENT_TAGS)[number]["slug"];

export function getTagLabel(slug: string): string {
  return CONTENT_TAGS.find((t) => t.slug === slug)?.label || slug.replace(/-/g, " ");
}

export function getAllTags() {
  return CONTENT_TAGS;
}
