import type { NextRequest } from "next/server";

export const DEFAULT_ADMIN_SECRET = "dev-admin-secret";

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || DEFAULT_ADMIN_SECRET;
}

/**
 * In production we refuse to run with the default secret — this prevents
 * an unconfigured deployment from exposing an open admin API.
 */
export function isAdminSecretInsecure(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    getAdminSecret() === DEFAULT_ADMIN_SECRET
  );
}

/** Constant-time-ish comparison to avoid trivial timing leaks. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function isAuthorized(request: NextRequest): boolean {
  if (isAdminSecretInsecure()) return false;
  const header = request.headers.get("authorization") || "";
  const expected = `Bearer ${getAdminSecret()}`;
  return safeEqual(header, expected);
}
