"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FeedAdCardProps {
  slotId?: string;
  className?: string;
}

/** 瀑布流中的原生广告卡片 */
export function FeedAdCard({ slotId, className }: FeedAdCardProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const adRef = useRef<HTMLModElement>(null);
  const resolvedSlot = slotId || process.env.NEXT_PUBLIC_ADSENSE_SLOT_FEED;

  useEffect(() => {
    if (!client || !resolvedSlot || !adRef.current) return;
    try {
      ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
    } catch {
      /* script not ready */
    }
  }, [client, resolvedSlot]);

  if (client && resolvedSlot) {
    return (
      <article
        className={cn(
          "masonry-item overflow-hidden rounded-2xl border border-stone-200/80 bg-white p-2 shadow-sm",
          className
        )}
      >
        <p className="mb-1 px-2 pt-1 text-[10px] font-medium uppercase tracking-wide text-stone-400">
          Sponsored
        </p>
        <ins
          ref={adRef}
          className="adsbygoogle block min-h-[200px] w-full"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={resolvedSlot}
          data-ad-format="fluid"
          data-ad-layout-key="-fb+5w+4e-db+86"
          data-full-width-responsive="true"
        />
      </article>
    );
  }

  return (
    <article
      className={cn(
        "masonry-item rounded-2xl border border-dashed border-stone-200 bg-stone-50 px-4 py-8 text-center",
        className
      )}
    >
      <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">Sponsored</p>
      <p className="mt-2 text-sm text-stone-500">Ad placement · configure AdSense in .env</p>
    </article>
  );
}
