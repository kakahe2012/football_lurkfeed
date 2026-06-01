"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

type StoryLinkProps = ComponentProps<typeof Link>;

/** Article links: instant jump to top — no smooth scroll when opening another story. */
export function StoryLink({ href, onClick, ...props }: StoryLinkProps) {
  return (
    <Link
      href={href}
      scroll
      onClick={(e) => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        onClick?.(e);
      }}
      {...props}
    />
  );
}
