import { NextRequest, NextResponse } from "next/server";
import {
  getAdminCredentials,
  createSessionToken,
  ADMIN_SESSION_COOKIE,
  SESSION_MAX_AGE_SEC,
} from "@/lib/admin/session";
import { isAdminSecretInsecure, safeEqual } from "@/lib/admin/auth";

export async function POST(request: NextRequest) {
  if (isAdminSecretInsecure()) {
    return NextResponse.json(
      {
        error:
          "生产环境请配置 ADMIN_SECRET、ADMIN_USERNAME、ADMIN_PASSWORD 后重新部署",
      },
      { status: 503 }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "无效请求" }, { status: 400 });
  }

  const { username, password } = getAdminCredentials();
  if (
    !body.username ||
    !body.password ||
    !safeEqual(body.username, username) ||
    !safeEqual(body.password, password)
  ) {
    return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
  }

  const token = createSessionToken(body.username);
  const res = NextResponse.json({ ok: true, username: body.username });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SEC,
    path: "/",
  });
  return res;
}
