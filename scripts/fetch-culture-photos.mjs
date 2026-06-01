/**
 * Download 30 real-scene football photos (Unsplash, free license) into
 * public/culture/photos/ for offline, self-hosted fallbacks.
 *
 * Run: node scripts/fetch-culture-photos.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(ROOT, "scripts/culture-photo-manifest.json");
const OUT_DIR = path.join(ROOT, "public/culture/photos");

/** Master width — mobile-first; Next/Image serves smaller variants. */
const MASTER_W = 1600;
const MASTER_H = 1200;

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "User-Agent": "LurkFeed-Football/1.0 (culture-photo-fetch)" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error(`Suspiciously small file (${buf.length} bytes)`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

async function main() {
  const items = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  fs.mkdirSync(OUT_DIR, { recursive: true });

  let ok = 0;
  for (const item of items) {
    const filename = `${item.id}.jpg`;
    const dest = path.join(OUT_DIR, filename);
    const url = `https://images.unsplash.com/${item.photo}?w=${MASTER_W}&h=${MASTER_H}&fit=crop&q=85&auto=format`;
    process.stdout.write(`↓ ${filename} … `);
    try {
      const bytes = await download(url, dest);
      console.log(`${Math.round(bytes / 1024)} KB`);
      ok++;
    } catch (e) {
      console.log(`FAIL: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  console.log(`\nDone: ${ok}/${items.length} photos → ${OUT_DIR}`);
  if (ok < items.length) process.exit(1);
}

main();
