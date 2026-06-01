import type { Post } from "@/types";
import { PopularSidebar } from "./PopularSidebar";

interface ContentLayoutProps {
  children: React.ReactNode;
  trending: Post[];
}

/** Desktop: main feed + right trending sidebar. Mobile: feed only. */
export function ContentLayout({ children, trending }: ContentLayoutProps) {
  return (
    <div className="mx-auto flex w-full max-w-6xl gap-8 px-3 pt-4 md:px-6">
      <div className="min-w-0 flex-1 max-w-3xl">{children}</div>
      <PopularSidebar posts={trending} />
    </div>
  );
}
