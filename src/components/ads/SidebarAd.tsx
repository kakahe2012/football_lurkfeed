"use client";

import { useEffect, useRef } from "react";

/** Trending 侧栏下方的矩形广告 */
export function SidebarAd() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR;
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

  if (!client || !slot) {
    return (
      <div className="mt-4 rounded-xl border border-dashed border-stone-200 bg-stone-50 px-3 py-10 text-center text-xs text-stone-400">
        Ad · set NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-stone-200/80 bg-white p-2">
      <p className="mb-1 px-1 text-[10px] font-medium uppercase text-stone-400">Sponsored</p>
      <ins
        ref={adRef}
        className="adsbygoogle block w-full"
        style={{ display: "block", minHeight: 250 }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="rectangle"
        data-full-width-responsive="true"
      />
    </div>
  );
}
