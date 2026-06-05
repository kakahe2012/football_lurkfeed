"use client";

import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_FEED_LAYOUT_KEY,
  DEFAULT_FEED_SLOT,
  resolveAdsenseClient,
} from "@/lib/ads/adsense-config";
import {
  isAdsenseTestMode,
  pushAdsenseSlotWhenVisible,
} from "@/lib/ads/load-adsense-slot";
import { cn } from "@/lib/utils";

interface FeedAdCardProps {
  slotId?: string;
  className?: string;
}

/** 瀑布流中的原生广告卡片 */
export function FeedAdCard({ slotId, className }: FeedAdCardProps) {
  const client = resolveAdsenseClient();
  const adRef = useRef<HTMLModElement>(null);
  const resolvedSlot =
    slotId ||
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_FEED ||
    DEFAULT_FEED_SLOT;
  const layoutKey =
    process.env.NEXT_PUBLIC_ADSENSE_LAYOUT_KEY_FEED || DEFAULT_FEED_LAYOUT_KEY;
  const testMode = isAdsenseTestMode();
  const [status, setStatus] = useState<"loading" | "filled" | "unfilled">(
    "loading"
  );

  useEffect(() => {
    if (!client || !resolvedSlot) return;
    const el = adRef.current;
    if (!el) return;

    const cleanupVisible = pushAdsenseSlotWhenVisible(el, { rootMargin: "320px" });

    const poll = window.setInterval(() => {
      const slotStatus = el.getAttribute("data-adsbygoogle-status");
      if (slotStatus === "done") {
        setStatus("filled");
        window.clearInterval(poll);
      } else if (slotStatus === "unfilled") {
        setStatus("unfilled");
        window.clearInterval(poll);
      }
    }, 500);

    const timeout = window.setTimeout(() => {
      const slotStatus = el.getAttribute("data-adsbygoogle-status");
      if (!slotStatus) setStatus("unfilled");
      window.clearInterval(poll);
    }, 12000);

    return () => {
      cleanupVisible();
      window.clearInterval(poll);
      window.clearTimeout(timeout);
    };
  }, [client, resolvedSlot]);

  if (client && resolvedSlot) {
    return (
      <article
        className={cn(
          "masonry-item rounded-2xl border border-stone-200/80 bg-white p-2 shadow-sm",
          className
        )}
      >
        <p className="mb-1 px-2 pt-1 text-[10px] font-medium uppercase tracking-wide text-stone-400">
          Sponsored
        </p>
        <ins
          ref={adRef}
          className={cn(
            "adsbygoogle block w-full",
            status === "loading" && "min-h-[200px]",
            status === "unfilled" && "min-h-0"
          )}
          style={{ display: "block" }}
          data-ad-client={client}
          data-ad-slot={resolvedSlot}
          data-ad-format="fluid"
          data-ad-layout-key={layoutKey}
          data-full-width-responsive="true"
          {...(testMode ? { "data-adtest": "on" } : {})}
        />
        {status === "unfilled" && !testMode && (
          <p className="px-2 pb-2 text-center text-[11px] text-stone-400">
            Ad slot open — fill may improve as traffic grows
          </p>
        )}
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
      <p className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
        Sponsored
      </p>
      <p className="mt-2 text-sm text-stone-500">
        Ad placement · configure AdSense in .env
      </p>
    </article>
  );
}
