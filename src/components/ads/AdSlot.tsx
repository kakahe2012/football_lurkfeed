"use client";

import { useEffect, useRef } from "react";
import {
  DEFAULT_INLINE_SLOT,
  DEFAULT_STICKY_SLOT,
  resolveAdsenseClient,
} from "@/lib/ads/adsense-config";
import { cn } from "@/lib/utils";

type Placement = "inline" | "sticky";

interface AdSlotProps {
  placement: Placement;
  className?: string;
}

export function AdSlot({ placement, className }: AdSlotProps) {
  const client = resolveAdsenseClient();
  const slot =
    placement === "inline"
      ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE || DEFAULT_INLINE_SLOT
      : process.env.NEXT_PUBLIC_ADSENSE_SLOT_STICKY || DEFAULT_STICKY_SLOT;
  const adRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!slot) return;
    try {
      ((window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle =
        (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle || []).push({});
    } catch {
      /* ignore */
    }
  }, [client, slot]);

  if (placement === "sticky") {
    return (
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 border-t border-stone-200/80 bg-[#FAF8F5]/95 p-2 lg:hidden",
          className
        )}
      >
        <ins
          ref={adRef}
          className="adsbygoogle mx-auto block w-full max-w-2xl"
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  if (placement === "inline" && slot) {
    return (
      <div className={cn("rounded-xl border border-stone-200 bg-white p-2", className)}>
        <ins
          ref={adRef}
          className="adsbygoogle block min-h-[120px] w-full"
          style={{ display: "block", textAlign: "center" }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-layout="in-article"
          data-ad-format="fluid"
        />
      </div>
    );
  }

  return (
    <div className={cn("rounded-xl border border-dashed border-stone-200 bg-stone-50 px-4 py-8 text-center text-xs text-stone-400", className)}>
      In-article ad · configure NEXT_PUBLIC_ADSENSE_SLOT_INLINE
    </div>
  );
}
