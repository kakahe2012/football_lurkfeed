import type { NextRequest } from "next/server";
import { hasValidSession } from "./session";

export const DEFAULT_ADMIN_SECRET = "dev-admin-secret";

export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET || DEFAULT_ADMIN_SECRET;
}

export function isAdminSecretInsecure(): boolean {
  return (
    process.env.NODE_ENV === "production" &&
    getAdminSecret() === DEFAULT_ADMIN_SECRET
  );
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Cookie session or legacy Bearer token (scripts / API). */
export function isAuthorized(request: NextRequest): boolean {
  if (isAdminSecretInsecure()) return false;
  if (hasValidSession(request)) return true;
  const header = request.headers.get("authorization") || "";
  const expected = `Bearer ${getAdminSecret()}`;
  return safeEqual(header, expected);
}

export { safeEqual };
