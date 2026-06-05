import Script from "next/script";
import { resolveAdsenseClient } from "@/lib/ads/adsense-config";
import { markAdsenseScriptReady } from "@/lib/ads/load-adsense-slot";

export function AdSenseScript() {
  const clientId = resolveAdsenseClient();

  if (!clientId) return null;

  return (
    <Script
      id="adsense-library"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onLoad={markAdsenseScriptReady}
    />
  );
}
