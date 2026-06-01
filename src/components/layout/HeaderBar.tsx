"use client";

import Link from "next/link";
import { Search, Home } from "lucide-react";
import { ShareButton } from "@/components/ui/ShareButton";

export function HeaderBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-[#FAF8F5]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-stone-800 transition hover:opacity-80">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-700/10 text-sm">
            ⚽
          </span>
          <span className="text-base font-semibold tracking-tight">LurkFeed Football</span>
        </Link>
        <div className="flex items-center gap-2">
          <ShareButton label="Share" copiedLabel="Link copied" size="sm" />
          <Link
            href="/search"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm hover:bg-stone-50"
            aria-label="Search"
          >
            <Search size={18} />
          </Link>
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm hover:bg-stone-50"
            aria-label="Home"
          >
            <Home size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
