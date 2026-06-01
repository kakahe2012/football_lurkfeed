import { NextRequest, NextResponse } from "next/server";
import { isAuthorized, isAdminSecretInsecure } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  if (isAdminSecretInsecure()) {
    return NextResponse.json(
      { ok: false, error: "ADMIN_SECRET 未配置，生产环境已锁定后台。" },
      { status: 503 }
    );
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
