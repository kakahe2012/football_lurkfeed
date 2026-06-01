"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Placement = "inline" | "sticky";

interface AdSlotProps {
  placement: Placement;
  className?: string;
}

export function AdSlot({ placement, className }: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slot =
    placement === "inline"
      ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE
      : process.env.NEXT_PUBLIC_ADSENSE_SLOT_STICKY;
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!client || !slot) return;
    try {
      ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
    } catch {
      /* ignore */
    }
  }, [client, slot]);

  if (placement === "sticky") {
    return (
      <div className={cn("fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200 bg-white/95 p-2 lg:hidden", className)}>
        {client && slot ? (
          <ins ref={adRef} className="adsbygoogle block" style={{ display: "block" }} data-ad-client={client} data-ad-slot={slot} data-ad-format="horizontal" data-full-width-responsive="true" />
        ) : (
          <p className="text-center text-xs text-stone-400">Mobile ad slot</p>
        )}
      </div>
    );
  }

  if (client && slot) {
    return (
      <div className={cn("rounded-xl border border-stone-200 bg-white p-2", className)}>
        <ins ref={adRef} className="adsbygoogle block min-h-[120px] w-full" style={{ display: "block" }} data-ad-client={client} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true" />
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-dashed border-stone-200 bg-stone-50 px-4 py-8 text-center text-xs text-stone-400", className)}>
      In-article ad · configure NEXT_PUBLIC_ADSENSE_SLOT_INLINE
    </div>
  );
}
