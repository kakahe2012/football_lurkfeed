const SESSION_KEY = "ff_session_id";

export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
    const v = params.get(key);
    if (v) utm[key] = v;
  }
  return utm;
}

export function getReferrer(): string {
  if (typeof document === "undefined") return "";
  const ref = document.referrer || "";
  if (!ref) return "direct";
  try {
    const host = new URL(ref).hostname;
    if (host === window.location.hostname) return "internal";
    return host;
  } catch {
    return ref.slice(0, 200);
  }
}
