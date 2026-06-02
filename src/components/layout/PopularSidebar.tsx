import { StoryLink } from "@/components/navigation/StoryLink";
import type { Post } from "@/types";
import { SidebarAd } from "@/components/ads/SidebarAd";

interface PopularSidebarProps {
  posts: Post[];
}

export function PopularSidebar({ posts }: PopularSidebarProps) {
  if (!posts.length) return null;

  return (
    <aside className="hidden w-full min-w-0 lg:block">
      <div className="sticky top-20 space-y-0">
        <div className="rounded-xl border border-stone-200/80 bg-white p-3 shadow-sm">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-900">
            Trending
          </h2>
          <p className="mt-0.5 text-[11px] leading-tight text-stone-500">
            Top stories · last 3 days
          </p>
          <ol className="mt-3 space-y-2.5">
            {posts.map((post, i) => (
              <li key={post.id}>
                <StoryLink
                  href={`/story/${post.slug}`}
                  className="group flex gap-2 text-[13px] leading-snug"
                >
                  <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-stone-100 text-[10px] font-semibold text-stone-500 group-hover:bg-teal-50 group-hover:text-teal-700">
                    {i + 1}
                  </span>
                  <span className="line-clamp-2 text-stone-700 group-hover:text-teal-800">
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
