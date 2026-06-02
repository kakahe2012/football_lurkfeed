import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin/auth";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import { fetchDashboardStats } from "@/lib/admin/analytics-stats";

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createServiceSupabaseClient();
  const stats = await fetchDashboardStats(supabase);
  return NextResponse.json(stats);
}
