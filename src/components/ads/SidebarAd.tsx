"use client";

import { useEffect, useRef } from "react";
import {
  resolveAdsenseClient,
  DEFAULT_SIDEBAR_SLOT,
  SIDEBAR_AD_WIDTH,
  SIDEBAR_AD_HEIGHT,
} from "@/lib/ads/adsense-config";

/** Trending 侧栏下方的固定尺寸展示广告（360×800） */
export function SidebarAd() {
  const client = resolveAdsenseClient();
  const slot =
    process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || DEFAULT_SIDEBAR_SLOT;
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

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-stone-200/80 bg-white p-1.5">
      <p className="mb-1 px-1 text-[10px] font-medium uppercase text-stone-400">
        Sponsored
      </p>
      <div
        className="mx-auto"
        style={{ width: SIDEBAR_AD_WIDTH, maxWidth: "100%" }}
      >
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{
            display: "inline-block",
            width: SIDEBAR_AD_WIDTH,
            height: SIDEBAR_AD_HEIGHT,
          }}
          data-ad-client={client}
          data-ad-slot={slot}
        />
      </div>
    </div>
  );
}
