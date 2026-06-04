import Script from "next/script";
import { resolveAdsenseClient } from "@/lib/ads/adsense-config";

export function AdSenseScript() {
  const clientId = resolveAdsenseClient();

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
