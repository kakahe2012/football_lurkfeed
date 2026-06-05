declare global {
  interface Window {
    adsbygoogle?: unknown[];
    __adsenseScriptReady?: boolean;
  }
}

const ADSENSE_READY_EVENT = "adsense-ready";
const MAX_ATTEMPTS = 60;
const RETRY_MS = 100;

/** Called from AdSenseScript when the library finishes loading. */
export function markAdsenseScriptReady(): void {
  if (typeof window === "undefined") return;
  window.__adsenseScriptReady = true;
  window.dispatchEvent(new Event(ADSENSE_READY_EVENT));
}

function isSlotInitialized(ins: HTMLElement): boolean {
  return Boolean(ins.getAttribute("data-adsbygoogle-status"));
}

/** Push a single <ins class="adsbygoogle"> after the library is ready. Safe to
 * call multiple times — skips if already initialized. */
export function pushAdsenseSlot(ins: HTMLElement | null): void {
  if (!ins || isSlotInitialized(ins)) return;

  let attempts = 0;
  let cancelled = false;
  let readyListener: (() => void) | null = null;

  const cleanup = () => {
    cancelled = true;
    if (readyListener) {
      window.removeEventListener(ADSENSE_READY_EVENT, readyListener);
      readyListener = null;
    }
  };

  const tryPush = () => {
    if (cancelled || isSlotInitialized(ins)) {
      cleanup();
      return;
    }

    if (typeof window === "undefined" || !window.adsbygoogle) {
      attempts += 1;
      if (attempts < MAX_ATTEMPTS) {
        setTimeout(tryPush, RETRY_MS);
      }
      return;
    }

    cleanup();
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn("[adsense] push failed:", err);
    }
  };

  if (typeof window !== "undefined" && window.__adsenseScriptReady && window.adsbygoogle) {
    tryPush();
    return;
  }

  readyListener = () => tryPush();
  window.addEventListener(ADSENSE_READY_EVENT, readyListener);
  tryPush();
}

/** Load ad when the slot enters (or nears) the viewport. */
export function pushAdsenseSlotWhenVisible(
  ins: HTMLElement | null,
  options?: { rootMargin?: string }
): () => void {
  if (!ins) return () => {};

  if (isSlotInitialized(ins)) return () => {};

  if (typeof IntersectionObserver === "undefined") {
    pushAdsenseSlot(ins);
    return () => {};
  }

  let cancelled = false;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting || cancelled) return;
      observer.disconnect();
      pushAdsenseSlot(ins);
    },
    { rootMargin: options?.rootMargin ?? "240px" }
  );

  observer.observe(ins);

  return () => {
    cancelled = true;
    observer.disconnect();
  };
}

export function isAdsenseTestMode(): boolean {
  if (process.env.NEXT_PUBLIC_ADSENSE_TEST === "true") return true;
  return process.env.NODE_ENV === "development";
}
