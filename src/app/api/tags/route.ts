import { NextResponse } from "next/server";
import { getTagStats } from "@/lib/data/tags";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export async function GET() {
  try {
    const tags = await getTagStats();
    return NextResponse.json(
      { tags },
      { headers: { "cache-control": "no-store" } }
    );
  } catch (err) {
    console.error("[/api/tags] failed:", err);
    return NextResponse.json({ tags: [] }, { status: 200 });
  }
}
