/**
 * Publish "The Eastern Oracle" opener article to seed-posts.
 * Usage: npx tsx scripts/add-eastern-oracle-article.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  assembleKcContent,
  buildPullQuote,
  imgTag,
} from "../src/lib/import/kc-article-blocks";
import type { Post } from "../src/types";

const SLUG = "eastern-oracle-mexico-south-africa-2026-opener";
const HERO = `/uploads/articles/${SLUG}/hero.png`;
const SEED_PATH = join(process.cwd(), "src/lib/data/seed-posts.ts");

function buildBody(): string {
  const heroFigure = `<figure class="article-image">${imgTag(
    HERO,
    "Mexico vs South Africa World Cup 2026 opener prediction — I Ching mystical analytics graphic with 2-1 scoreline"
  )}</figure>`;

  return `
<h2>The Vibe Check: A Cultural Experiment</h2>
<p>Let's be real: modern football analytics are starting to look like a beige spreadsheet. So, we decided to run the numbers through a different kind of machine — the <strong>I Ching</strong> (The Book of Changes) and the <strong>Five Elements Theory</strong>.</p>
<p>Think of it as &quot;Mystical Analytics.&quot; We're not telling you to bet your rent on this. We're treating these ancient frameworks as a cosmic layer of data. Sometimes, the universe has a sense of humor (and a favorite).</p>
<p><strong>TL;DR:</strong> This is a vibe check powered by ancient Eastern wisdom. Let's get weird.</p>

<h2>The Matchup: Mexico vs. South Africa</h2>
<table><thead><tr><th></th><th>Details</th></tr></thead><tbody>
<tr><td><strong>Fixture</strong></td><td>🇲🇽 Mexico vs 🇿🇦 South Africa</td></tr>
<tr><td><strong>Date</strong></td><td>June 11, 2026</td></tr>
<tr><td><strong>Venue</strong></td><td>Estadio Azteca (Altitude: 7,349 ft / 2,240 m)</td></tr>
<tr><td><strong>The Backstory</strong></td><td>They met in the 2010 opener (1-1 draw). Now, the script is flipped.</td></tr>
</tbody></table>

${heroFigure}

<h2>The Elemental Breakdown: Reading the Energy</h2>
<p>In this system, every nation has an &quot;energetic signature&quot; based on geography, culture, and history. We call it the <strong>Elemental Signature</strong>.</p>

<h3>🇲🇽 Mexico: The Solar Engine (Fire / Lightning)</h3>
<ul>
<li><strong>Geography:</strong> High-altitude desert. Thin air. Intense sun. Pure <strong>FIRE</strong> energy.</li>
<li><strong>Culture:</strong> Aztec heritage revolves around the Sun God. The fans? Volcanic passion.</li>
<li><strong>Kit:</strong> Green, white, and red — green feeds the fire; red is the inferno.</li>
<li><strong>Vibe:</strong> Explosive starts. At the Azteca, fire is amplified by thin air as a defensive wall. Mexico is the ultimate Fire-type team.</li>
</ul>

<h3>🇿🇦 South Africa: The Deep Current (Water / Earth)</h3>
<ul>
<li><strong>Geography:</strong> Cape of Good Hope — where two oceans collide. <strong>WATER</strong> energy.</li>
<li><strong>Culture:</strong> Grounded, rhythmic, resilient. Bafana Bafana spirit is fluid and adaptive.</li>
<li><strong>Kit:</strong> Gold and green — earthy tones.</li>
<li><strong>Vibe:</strong> They absorb and strike on the counter. The Water-type team — flows, but can drown you.</li>
</ul>

<h2>The Cosmic Context: The Year of the Inferno</h2>
<p>2026 is a <strong>Fire Horse</strong> year — coded as extreme heat and explosive action in the ancient calendar.</p>
<div class="fact-box">
<h4>Peak Fire Stack (Mexico Opener)</h4>
<ul>
<li><strong>Year:</strong> Peak Fire (Fire Horse 2026)</li>
<li><strong>Month:</strong> June — summer</li>
<li><strong>Time:</strong> 1:00 PM local — high noon, maximum solar output</li>
<li><strong>Venue:</strong> Azteca at 7,349 ft — the Fire-Oven</li>
</ul>
</div>
<p>You are taking a Fire-type team (Mexico), in a high-altitude Fire-Oven, during a Peak Fire year, at Peak Fire O'Clock — against a Water-type team. In this framework, <strong>Fire evaporates Water</strong>. The environment drains stamina and willpower.</p>
${buildPullQuote(
  "Fire over Water at the Azteca — mystical analytics, not a betting tip."
)}

<h2>The Pattern: &quot;Fire Over Water&quot; (未济)</h2>
<p>The hexagram that emerges is <strong>Fire Over Water</strong> — &quot;The Unfinished Symphony.&quot;</p>
<ul>
<li><strong>The favorite wins:</strong> Fire (Mexico) dominates Water (South Africa).</li>
<li><strong>It won't be clean:</strong> Late winner, controversial penalty, or nervy finish — Mexico wins but makes it harder than it needs to be.</li>
</ul>

<h2>The Verdict: The Data Point</h2>
<p>Cross-referenced with FIFA rankings, home advantage, and altitude physics:</p>
<table><thead><tr><th>Outcome</th><th>Probability</th></tr></thead><tbody>
<tr><td>🇲🇽 Mexico Win</td><td><strong>65%</strong></td></tr>
<tr><td>🤝 Draw</td><td><strong>25%</strong></td></tr>
<tr><td>🇿🇦 South Africa Win</td><td><strong>10%</strong></td></tr>
</tbody></table>
<p><strong>Predicted scoreline:</strong> 2-1 or 1-0. Fire beats Water, but Water leaks through — don't be shocked if South Africa scores first before the Fire takes over.</p>
${buildPullQuote(
  "If Mexico wins 2-1 in the 87th minute and you feel déjà vu — now you know why."
)}

<h2>Coming Next</h2>
<p>Stay tuned for Episode 2: <strong>USA vs. Paraguay</strong> — Can the &quot;Metal&quot; of the American system cut through the &quot;Wood&quot; of South America?</p>
`.trim();
}

function buildPost(): Post {
  const title =
    "The Eastern Oracle: Why Mexico Will (Probably) Cook South Africa in the 2026 Opener";
  const lead =
    "Forget xG. Forget Opta. We ran the 2026 World Cup opener through a 3,000-year-old Eastern mystical algorithm — here's what the I Ching says about Mexico vs South Africa at the Azteca.";
  const now = new Date().toISOString();

  const content = assembleKcContent({
    disclaimer:
      "This is 100% entertainment. Not betting or financial advice. The Eastern Oracle is a cultural experiment in alternative analytics — gamble responsibly, or just enjoy the vibes.",
    takeaways: [
      "Mexico vs South Africa opens World Cup 2026 on June 11 at Estadio Azteca (7,349 ft altitude)",
      "Mystical analytics frame Mexico as Fire and South Africa as Water — Fire Horse year amplifies Mexico",
      "I Ching hexagram \"Fire Over Water\" (未济) suggests Mexico win but not cleanly — late drama likely",
      "Editorial probabilities: Mexico 65%, Draw 25%, South Africa 10%; scoreline 2-1 or 1-0",
      "Entertainment only — cross-check with real football data, not a licensed advisor",
    ],
    lead,
    bodyInner: buildBody(),
    faqs: [
      {
        question: "When is Mexico vs South Africa at World Cup 2026?",
        answer:
          "The opening match is scheduled for June 11, 2026, at Estadio Azteca in Mexico City — the same venue that hosted the 2010 World Cup opener (a 1-1 draw between the two sides).",
      },
      {
        question: "What does the I Ching say about Mexico vs South Africa?",
        answer:
          "In this editorial framework, the hexagram Fire Over Water (未济) suggests Mexico (Fire) beats South Africa (Water) but in an \"unfinished\" way — a win that may feel nervy, late, or controversial rather than dominant.",
      },
      {
        question: "What is mystical analytics in football?",
        answer:
          "Mystical analytics here means treating ancient systems like the I Ching and Five Elements as an alternative narrative layer on top of normal stats — for culture and entertainment, not as a substitute for xG, rankings, or sports science.",
      },
      {
        question: "What score does the Eastern Oracle predict for the opener?",
        answer:
          "The readout in this piece points to Mexico winning 2-1 or 1-0, with a chance South Africa scores first before Mexico's \"Fire\" takes over — aligned with the Fire-over-Water pattern.",
      },
      {
        question: "Is this article betting advice?",
        answer:
          "No. It is labeled entertainment and cultural commentary. Do not use it as financial or gambling guidance; always bet responsibly if you choose to bet at all.",
      },
    ],
    sourceNote:
      "Fixture date and venue per FIFA World Cup 2026 scheduling and Estadio Azteca hosting. 2010 opener result (1-1) is historical fact. I Ching and Five Elements interpretations are editorial cultural framing, not scientific predictions. Probabilities are illustrative only.",
  });

  return {
    id: "56",
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
      "mexico-vs-south-africa",
      "eastern-oracle",
      "mystical-analytics",
      "i-ching-football",
      "world-cup-opener-2026",
      "estadio-azteca",
      "alternative-analytics",
      "prediction",
      "culture",
    ],
    seo_title:
      "Eastern Oracle: Mexico vs South Africa 2026 Opener — I Ching Prediction",
    seo_description:
      "Mystical analytics for World Cup 2026's opener: I Ching & Five Elements read Mexico (Fire) over South Africa (Water) at Azteca — 65% win, 2-1 vibe. Entertainment only.",
    og_image: HERO,
    publish_status: "published",
    read_time_minutes: 8,
    view_count: 4200,
    share_count: 310,
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
 * Added eastern-oracle-mexico-south-africa-2026-opener at ${new Date().toISOString()}
 * Count: ${posts.length}
 */

export const SEED_POSTS: Post[] = `;
  writeFileSync(SEED_PATH, `${header}${JSON.stringify(posts, null, 2)};\n`, "utf8");
}

function main(): void {
  const posts = loadSeedPosts();
  if (posts.some((p) => p.slug === SLUG)) {
    const idx = posts.findIndex((p) => p.slug === SLUG);
    posts[idx] = buildPost();
    console.log(`Updated existing post: ${SLUG}`);
  } else {
    posts.unshift(buildPost());
    console.log(`Added new post: ${SLUG} (id 56, total ${posts.length})`);
  }
  writeSeedPosts(posts);
}

main();
