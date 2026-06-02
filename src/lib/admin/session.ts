import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";
import { getAdminSecret } from "./auth";

export const ADMIN_SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;

export function getAdminCredentials(): { username: string; password: string } {
  return {
    username: process.env.ADMIN_USERNAME?.trim() || "admin",
    password:
      process.env.ADMIN_PASSWORD?.trim() ||
      process.env.ADMIN_SECRET?.trim() ||
      "dev-admin-secret",
  };
}

export function createSessionToken(username: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC;
  const body = Buffer.from(JSON.stringify({ u: username, exp })).toString(
    "base64url"
  );
  const sig = createHmac("sha256", getAdminSecret())
    .update(body)
    .digest("base64url");
  return `${body}.${sig}`;
}

export function verifySessionToken(token: string): boolean {
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", getAdminSecret())
    .update(body)
    .digest("base64url");
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    ) as { exp?: number };
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function hasValidSession(request: NextRequest): boolean {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return token ? verifySessionToken(token) : false;
}
