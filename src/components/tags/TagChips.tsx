"use client";

import Link from "next/link";
import { getTagLabel } from "@/lib/data/tag-definitions";
import { cn } from "@/lib/utils";

interface TagChipsProps {
  tags: string[];
  className?: string;
  max?: number;
}

export function TagChips({ tags, className, max = 4 }: TagChipsProps) {
  if (!tags?.length) return null;
  const visible = tags.slice(0, max);

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map((tag) => (
        <Link
          key={tag}
          href={`/tag/${tag}`}
          onClick={(e) => e.stopPropagation()}
          className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-medium text-stone-600 hover:bg-teal-50 hover:text-teal-800"
        >
          {getTagLabel(tag)}
        </Link>
      ))}
    </div>
  );
}
