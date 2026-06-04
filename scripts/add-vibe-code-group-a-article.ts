/**
 * Publish "The Vibe Code — Group A" article to seed-posts.
 * Usage: npx tsx scripts/add-vibe-code-group-a-article.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  assembleKcContent,
  buildPullQuote,
} from "../src/lib/import/kc-article-blocks";
import type { Post } from "../src/types";

const SLUG = "vibe-code-world-cup-2026-group-a";
const HERO = `/uploads/articles/${SLUG}/hero.png`;
const SEED_PATH = join(process.cwd(), "src/lib/data/seed-posts.ts");

function buildBody(): string {
  return `
<h2>Forget xG. Meet the Oriental Overlay</h2>
<p>We&apos;ve been running the numbers on a different kind of machine — an ancient pattern-recognition system that reads teams by their <strong>Energy Signatures</strong>. To Western eyes, it looks like astrology. To Eastern sages, it&apos;s <strong>Cosmic Mechanics</strong>. Every nation carries a frequency based on geography, culture, and even kit colors. We call it the <strong>Oriental Overlay</strong>.</p>
<p>Is this science? No. Is it more fun than a spreadsheet? Absolutely. Here is how <strong>Group A</strong> actually plays out.</p>

<h2>The Lay of the Land: Estadio Azteca</h2>
<p>First, the cheat code: <strong>altitude</strong>. At <strong>7,349 ft</strong>, oxygen is a luxury. But beyond physics, the Azteca sits on a <strong>Volcanic Earth</strong> node. In this framework, that creates a massive Earth buff for physical teams and a Fire amplifier for passion-driven sides — a graveyard for Water elements and a pressure cooker for Metal precision.</p>

<h2>The Archetypes: The Oriental Overlay</h2>
<table><thead><tr><th>Team</th><th>Archetype</th><th>The Oriental Overlay</th></tr></thead><tbody>
<tr><td>🇲🇽 Mexico</td><td><strong>The Solar Engine</strong></td><td>Fire dominant / Earth anchored. Red Phoenix of the South. Green kits = Wood feeding Fire. High Noon in a Fire Horse year = ultimate power-up.</td></tr>
<tr><td>🇰🇷 South Korea</td><td><strong>The Kinetic Blade</strong></td><td>Metal tempered by Wood. Surgical strikes, relentless growth — but Metal melts in extreme heat. Azteca tests the blade&apos;s temper.</td></tr>
<tr><td>🇨🇿 Czechia</td><td><strong>The Iron Shield</strong></td><td>Pure Metal / harvest Earth. Structural and unyielding. Metal chokes Wood and can contain Water, but struggles vs Fire unless Earth defense reflects heat.</td></tr>
<tr><td>🇿🇦 South Africa</td><td><strong>The Deep Current</strong></td><td>Water nurtured by Wood. Flows and adapts — but Earth (altitude) dams it and Fire (Mexico) boils it away.</td></tr>
</tbody></table>

<h2>The Predictions: The Cosmic Script</h2>

<h3>🥇 1st: 🇲🇽 Mexico (The Inevitable)</h3>
<p>2026 is the <strong>Year of the Fire Horse (Bing Wu)</strong> — peak fire energy in the 60-year cycle. The opener at <strong>1:00 PM high noon</strong> isn&apos;t coincidence in this model.</p>
<p>South Africa&apos;s Water evaporates. Korea&apos;s Metal softens in the heat. Expect a classic <strong>late goal surge</strong> (Fire-element trait) even if they start slowly.</p>
<p><strong>Vibe:</strong> &quot;The universe signed the permission slip.&quot; <strong>Key overlay:</strong> Fire + Earth = unstoppable momentum.</p>

<h3>🥈 2nd: 🇰🇷 South Korea (The Blade in the Heat)</h3>
<p>The <strong>Son Heung-min last dance</strong> narrative reads as Wood-fueled Metal — sharp individually, altitude as kryptonite. Metal weakens in Fire; they cannot press 90 minutes.</p>
<p>Editorial script: tense <strong>1-0 over South Africa</strong>, calculated <strong>draw vs Mexico</strong>. Losing to Czechia (Metal-on-Metal) would be culturally seismic.</p>
<p><strong>Vibe:</strong> &quot;Sharp, but wilting in the greenhouse.&quot;</p>

<h3>🥉 3rd: 🇨🇿 Czechia (The Spoiler Spirit)</h3>
<p>The Iron Shield — structurally sound, creatively barren. Handle South Africa&apos;s Water (think <strong>1-0</strong>) but struggle vs Mexico&apos;s Fire. Ultimate party-crasher; likely <strong>best third-place</strong> candidate on low-xGA floor.</p>
<p><strong>Vibe:</strong> &quot;Cold, hard, and impossible to ignore.&quot;</p>

<h3>💀 4th: 🇿🇦 South Africa (The Drowned Logic)</h3>
<p>Water in a Fire-Earth group. Altitude dams the flow; Mexican sun boils it. One viral counter-attack flash flood — then grim overall prognosis.</p>
<p><strong>Vibe:</strong> &quot;Wrong element, wrong planet.&quot;</p>

${buildPullQuote("Mexico to win the group — the Fire Horse demands it. The rest fight for scraps in the shadow of the volcano.")}

<h2>The Final Table: The Cosmic Verdict</h2>
<table><thead><tr><th>Pos</th><th>Team</th><th>Pts</th><th>The Oriental Verdict</th></tr></thead><tbody>
<tr><td>🥇</td><td>🇲🇽 Mexico</td><td><strong>7</strong></td><td>Fire Horse year + High Noon = destiny</td></tr>
<tr><td>🥈</td><td>🇰🇷 South Korea</td><td><strong>4</strong></td><td>Blade stays sharp, but the heat is exhausting</td></tr>
<tr><td>🥉</td><td>🇨🇿 Czechia</td><td><strong>3</strong></td><td>Iron Shield survives the group by a hair</td></tr>
<tr><td>💀</td><td>🇿🇦 South Africa</td><td><strong>1</strong></td><td>Water meets volcano — never going to work</td></tr>
</tbody></table>

<h2>What to Tell Your Group Chat</h2>
<ul>
<li><strong>The lock:</strong> Mexico to win the group — the Fire Horse demands it.</li>
<li><strong>The spicy take:</strong> Korea vs Czechia under 2.5 goals — Metal-on-Metal cage fight.</li>
<li><strong>The hail mary:</strong> Czechia as best third — the Iron Shield is low-key elite.</li>
<li><strong>The verdict:</strong> Elements favor the hosts; everyone else fights for volcano scraps.</li>
</ul>

<div class="fact-box">
<h4>Peak Fire Stack (Group A at Azteca)</h4>
<ul>
<li><strong>Year:</strong> Fire Horse 2026 (Bing Wu)</li>
<li><strong>Kickoff vibe:</strong> High Noon opener energy</li>
<li><strong>Venue:</strong> 7,349 ft volcanic Earth node</li>
<li><strong>Host overlay:</strong> Mexico maxed Fire + Earth</li>
</ul>
</div>
`.trim();
}

function buildPost(): Post {
  const title =
    "The Vibe Code: We Plugged World Cup 2026 Group A Into a 3,000-Year-Old Algorithm";
  const lead =
    "Forget xG. Forget Opta. We ran Group A through the Oriental Overlay — Mexico as Fire, South Africa as Water, Korea as Metal, Czechia as Iron — and the cosmic table is unhinged.";
  const now = new Date().toISOString();

  const content = assembleKcContent({
    disclaimer:
      "Entertainment only — not betting, financial, or outcome advice. The Oriental Overlay is a creative cultural framework, not science. Don't bet your rent on a 3,000-year-old algorithm. Enjoy the vibes, not the stakes.",
    takeaways: [
      "Group A at Estadio Azteca (7,349 ft): Earth buff + Fire amplifier in the Oriental Overlay model",
      "Mexico ranked 1st (7 pts) — Fire Horse 2026 + high-noon host energy",
      "South Korea 2nd (4 pts), Czechia 3rd (3 pts) as best-third spoiler, South Africa 4th (1 pt)",
      "Archetypes: Mexico Solar Engine, Korea Kinetic Blade, Czechia Iron Shield, RSA Deep Current",
      "Cultural experiment only — cross-check with real football data and VAR",
    ],
    lead,
    bodyInner: buildBody(),
    faqs: [
      {
        question: "What is the Vibe Code Oriental Overlay for World Cup 2026?",
        answer:
          "In this editorial series, the Oriental Overlay treats each nation as an energy signature (Fire, Water, Metal, Earth, Wood) based on culture, geography, and kits — applied to Group A as entertainment, not scientific forecasting.",
      },
      {
        question: "Who wins World Cup 2026 Group A in the Vibe Code prediction?",
        answer:
          "This piece ranks Mexico first on seven points, South Korea second on four, Czechia third on three (with a best-third-place path), and South Africa fourth on one point.",
      },
      {
        question: "Why does Mexico dominate Group A in this model?",
        answer:
          "Mexico is framed as Fire-dominant and Earth-anchored, amplified by the 2026 Fire Horse year, a high-noon opener vibe, and Estadio Azteca's altitude and volcanic Earth node — while Water (South Africa) and overheated Metal (Korea) struggle.",
      },
      {
        question: "Which teams are in World Cup 2026 Group A?",
        answer:
          "Group A in this article features Mexico, South Korea, Czechia, and South Africa, with fixtures centered on Estadio Azteca and the broader Azteca altitude effect.",
      },
      {
        question: "Is the Vibe Code Group A article betting advice?",
        answer:
          "No. It is labeled entertainment and cultural storytelling. Do not use it for gambling or financial decisions; actual outcomes depend on football, tactics, injuries, and luck.",
      },
    ],
    sourceNote:
      "Oriental Overlay and Five Elements framing are editorial cultural devices. Group composition and venue facts reference public World Cup 2026 scheduling. Point totals are illustrative narrative, not certified predictions.",
  });

  return {
    id: "62",
    title,
    slug: SLUG,
    content,
    intro_hook:
      lead.length > 200 ? `${lead.slice(0, 197)}…` : lead,
    hero_image: HERO,
    emotion_type: "culture",
    feed_type: "story",
    media_type: "article",
    tags: [
      "world-cup-2026",
      "vibe-code",
      "oriental-overlay",
      "fire-horse-year",
      "group-a-world-cup",
      "mexico-world-cup-2026",
      "south-korea-world-cup",
      "son-heung-min",
      "estadio-azteca",
      "entertainment",
      "culture",
    ],
    seo_title:
      "Vibe Code: Group A World Cup 2026 Predictions — Oriental Overlay",
    seo_description:
      "The Vibe Code runs WC2026 Group A through a 3,000-year-old Oriental Overlay: Mexico tops the cosmic table, Korea 2nd, Czechia 3rd, South Africa 4th. Entertainment only.",
    og_image: HERO,
    publish_status: "published",
    read_time_minutes: 9,
    view_count: 19500,
    share_count: 1365,
    ctr_score: 0.09,
    created_at: now,
    published_at: now,
  };
}

function loadSeedPosts(): Post[] {
  const raw = readFileSync(SEED_PATH, "utf8");
  const match = raw.match(/export const SEED_POSTS: Post\[\] = (\[[\s\S]*\]);/);
  if (!match) throw new Error("Could not parse SEED_POSTS");
  return JSON.parse(match[1]) as Post[];
}

function writeSeedPosts(posts: Post[]): void {
  const header = `import type { Post } from "@/types";

/** Auto-generated — markdown import + merge + news enrich
 * Added vibe-code-world-cup-2026-group-a at ${new Date().toISOString()}
 * Count: ${posts.length}
 */

export const SEED_POSTS: Post[] = `;
  writeFileSync(SEED_PATH, `${header}${JSON.stringify(posts, null, 2)};\n`, "utf8");
}

function main(): void {
  const posts = loadSeedPosts();
  const post = buildPost();
  const idx = posts.findIndex((p) => p.slug === SLUG);
  if (idx >= 0) {
    posts[idx] = post;
    console.log(`Updated: ${SLUG}`);
  } else {
    posts.unshift(post);
    console.log(`Added: ${SLUG} (id 62, total ${posts.length})`);
  }
  writeSeedPosts(posts);
}

main();
