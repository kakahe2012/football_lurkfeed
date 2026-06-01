/**
 * Generate 12 local LurkFeed culture SVG placeholders (zero API cost).
 * Run: node scripts/generate-culture-svgs.mjs
 */
import fs from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), "public/culture");

const PALETTES = [
  { bg: ["#1a3a2f", "#0d6e5c"], accent: "#faf8f5", label: "Night Stadium" },
  { bg: ["#2c2c2c", "#44403c"], accent: "#0d6e5c", label: "Pitch Lines" },
  { bg: ["#0d6e5c", "#3d8b7a"], accent: "#faf8f5", label: "Teal Spirit" },
  { bg: ["#78716c", "#a8a29e"], accent: "#faf8f5", label: "Stone Warmth" },
  { bg: ["#1e293b", "#334155"], accent: "#fbbf24", label: "Floodlights" },
  { bg: ["#14532d", "#166534"], accent: "#faf8f5", label: "Grass Field" },
  { bg: ["#44403c", "#57534e"], accent: "#99f6e4", label: "Fan Culture" },
  { bg: ["#0f172a", "#1e3a5f"], accent: "#faf8f5", label: "World Cup Night" },
  { bg: ["#365314", "#4d7c0f"], accent: "#fef3c7", label: "Sunset Match" },
  { bg: ["#292524", "#44403c"], accent: "#fcd34d", label: "Golden Moment" },
  { bg: ["#134e4a", "#0f766e"], accent: "#faf8f5", label: "Celebration" },
  { bg: ["#3f3f46", "#52525b"], accent: "#a7f3d0", label: "New Fan Vibes" },
];

const MOTIFS = [
  (a) => `<circle cx="414" cy="520" r="120" fill="none" stroke="${a}" stroke-width="3" opacity="0.35"/>
    <path d="M414 400 L474 460 L454 540 L374 540 L354 460 Z" fill="none" stroke="${a}" stroke-width="2.5" opacity="0.5"/>`,
  (a) => `<rect x="120" y="780" width="588" height="4" rx="2" fill="${a}" opacity="0.4"/>
    <circle cx="414" cy="480" r="90" fill="none" stroke="${a}" stroke-width="2" opacity="0.55"/>`,
  (a) => `<ellipse cx="414" cy="900" rx="280" ry="40" fill="${a}" opacity="0.12"/>
    <text x="414" y="540" text-anchor="middle" font-size="140" opacity="0.25" fill="${a}">⚽</text>`,
  (a) => `<path d="M80 750 Q414 650 748 750" fill="none" stroke="${a}" stroke-width="2" opacity="0.35"/>
    <rect x="314" y="420" width="200" height="140" rx="8" fill="none" stroke="${a}" stroke-width="2" opacity="0.3"/>`,
];

fs.mkdirSync(OUT, { recursive: true });

PALETTES.forEach((p, i) => {
  const motif = MOTIFS[i % MOTIFS.length](p.accent);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 828 1104" role="img" aria-label="LurkFeed Football — ${p.label}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${p.bg[0]}"/>
      <stop offset="100%" stop-color="${p.bg[1]}"/>
    </linearGradient>
  </defs>
  <rect width="828" height="1104" fill="url(#bg)"/>
  ${motif}
  <text x="414" y="1020" text-anchor="middle" font-family="system-ui,sans-serif" font-size="22" font-weight="600" letter-spacing="3" fill="${p.accent}" opacity="0.7">LURKFEED</text>
  <text x="414" y="1055" text-anchor="middle" font-family="system-ui,sans-serif" font-size="14" fill="${p.accent}" opacity="0.45">Football. The fun parts.</text>
</svg>`;
  const name = `lf-${String(i + 1).padStart(2, "0")}.svg`;
  fs.writeFileSync(path.join(OUT, name), svg.trim());
  console.log("  wrote", name);
});

console.log(`\nGenerated ${PALETTES.length} culture SVGs → ${OUT}`);
