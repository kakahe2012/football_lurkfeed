import type { Post } from "@/types";
import { PopularSidebar } from "./PopularSidebar";

interface ContentLayoutProps {
  children: React.ReactNode;
  trending: Post[];
}

/** Desktop: main feed + fixed-width trending sidebar. Mobile: feed only. */
export function ContentLayout({ children, trending }: ContentLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-7xl px-3 pt-4 md:px-6 lg:grid lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:items-start lg:gap-6 xl:grid-cols-[minmax(0,1fr)_15.5rem] xl:gap-7">
      <div className="content-main min-w-0">{children}</div>
      <PopularSidebar posts={trending} />
    </div>
  );
}
