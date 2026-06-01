import { StoryLink } from "@/components/navigation/StoryLink";
import type { Post } from "@/types";
import { SidebarAd } from "@/components/ads/SidebarAd";

interface PopularSidebarProps {
  posts: Post[];
}

export function PopularSidebar({ posts }: PopularSidebarProps) {
  if (!posts.length) return null;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 space-y-0">
        <div className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-stone-900">Trending</h2>
          <p className="mt-0.5 text-xs text-stone-500">Top stories · last 3 days</p>
          <ol className="mt-4 space-y-3">
            {posts.map((post, i) => (
              <li key={post.id}>
                <StoryLink
                  href={`/story/${post.slug}`}
                  className="group flex gap-2.5 text-sm leading-snug"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-100 text-xs font-medium text-stone-500 group-hover:bg-teal-50 group-hover:text-teal-700">
                    {i + 1}
                  </span>
                  <span className="line-clamp-3 text-stone-700 group-hover:text-teal-800">
                    {post.title}
                  </span>
                </StoryLink>
              </li>
            ))}
          </ol>
        </div>
        <SidebarAd />
      </div>
    </aside>
  );
}
