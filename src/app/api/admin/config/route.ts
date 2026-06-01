import { NextRequest, NextResponse } from "next/server";
import { getProviderInfo } from "@/lib/ai/llm-client";
import { isR2Configured } from "@/lib/storage/r2";
import { isAuthorized } from "@/lib/admin/auth";

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ai = getProviderInfo();

  return NextResponse.json({
    ai,
    supabase: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.SUPABASE_SERVICE_ROLE_KEY
    ),
    r2: isR2Configured(),
    adsense: Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT),
    ga4: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
    site_url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  });
}
