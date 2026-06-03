import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      ts: Date.now(),
      node: typeof process !== "undefined" ? process.version : null,
    },
    { headers: { "cache-control": "no-store" } }
  );
}
