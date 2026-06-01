import { NextResponse } from "next/server";
import { getTagStats } from "@/lib/data/tags";

export async function GET() {
  const tags = await getTagStats();
  return NextResponse.json({ tags });
}
