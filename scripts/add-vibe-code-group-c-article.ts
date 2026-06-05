/**
 * Publish "The Vibe Code — Group C" article to seed-posts.
 * Usage: npx tsx scripts/add-vibe-code-group-c-article.ts
 */
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import {
  assembleKcContent,
  buildPullQuote,
} from "../src/lib/import/kc-article-blocks";
import type { Post } from "../src/types";

const SLUG = "vibe-code-world-cup-2026-group-c";
const HERO = `/uploads/articles/${SLUG}/hero.png`;
const SEED_PATH = join(process.cwd(), "src/lib/data/seed-posts.ts");

function buildBody(): string {
  return `
<h2>The Setting: East Coast Energy, Stadium by Stadium</h2>
<p>Group C&apos;s venues are pure East Coast mood-board:</p>
<ul>
<li><strong>MetLife (NJ, open roof, heavy humid summer heat)</strong> → amps Fire / Yang environments</li>
<li><strong>Gillette (Boston, coastal breeze, tighter grass)</strong> → favors Metal / disciplined structure</li>
<li><strong>Lincoln Financial (Philly, enclosed-ish, loud)</strong> → Earth-Metal grind</li>
<li><strong>Mercedes-Benz (Atlanta, retractable roof, climate-controlled)</strong> → artificial atmosphere = the universe hits &quot;neutral&quot;</li>
</ul>
<p>When you map that onto our element-system, you get a group where firepower meets wall-building, and the two underdogs aren&apos;t just &quot;happy to be here&quot; — they&apos;re carrying very specific conduit stars who can flip an element mid-match.</p>

<h2>The Archetypes: Who These Teams Actually Are (Elementally Speaking)</h2>
<table><thead><tr><th>Team</th><th>Archetype</th><th>Totem Star(s) as Conduits</th><th>Why It Matters</th></tr></thead><tbody>
<tr><td>🇧🇷 Brazil</td><td><strong>The Rainforest Inferno — Wood → Fire</strong></td><td>Vinícius Jr (the spark), Raphinha (the edge), Casemiro / Marquinhos (the roots holding the flame)</td><td>Classic Wood-feeds-Fire nation: rhythm → acceleration → explosion. When the &quot;samba current&quot; starts flowing, it behaves like a living weather system.</td></tr>
<tr><td>🇲🇦 Morocco</td><td><strong>The Atlas Wall of Iron &amp; Sand — Earth tempered by Metal</strong></td><td>Achraf Hakimi (the kinetic metal rail), Soufiane Rahimi / Ounahi-type engine (the desert pulse)</td><td>Fourth-place pedigree + a backline that reflects pressure. Earth absorbs; Metal cuts. Their whole brand is: stay compact, then slash you on a hairline fracture.</td></tr>
<tr><td>🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland</td><td><strong>Granite &amp; Mist — Metal / Water hybrid</strong></td><td>Scott McTominay (the thunderhead in the box), Andrew Robertson (the ceaseless coastal wind at left back)</td><td>Wet-weather warriors. &quot;Mist&quot; football: cloudy skies, set-pieces, second balls, moral endurance. Metal discipline + Water persistence.</td></tr>
<tr><td>🇭🇹 Haiti</td><td><strong>Saltwater &amp; Thunder — Water breaking into Storm</strong></td><td>Emelyn Andrus / Frantzdy Pierrot (target-nail in the box), Don Louicius / Duckens Nazon (chaos on the break)</td><td>Small sample-size = chaos. Water&apos;s superpower is surprise flooding when the favorites get bored. Their &quot;storm&quot; shows up if you let them settle.</td></tr>
</tbody></table>

<h2>The Predictions: How the Script Plays Out</h2>

<h3>🥇 1st — 🇧🇷 Brazil (The Rainforest Inferno)</h3>
<p><strong>Opening night:</strong> Brazil vs Morocco @ MetLife, 6PM ET, humid furnace. That&apos;s the perfect ignition window. MetLife&apos;s open air + June swamp-heat = Fire-friendly. And Brazil&apos;s whole system is Wood rhythm → sudden Fire burst, usually delivered by Vinícius Jr&apos;s acceleration opening a seam, or Raphinha&apos;s slicing patterns turning half-chances into goals.</p>
<p><strong>Oriental Overlay read:</strong> Brazil&apos;s biggest enemy is self-combustion (too much Fire, not enough root). That&apos;s why Casemiro + Marquinhos matter elementally — they are the Earth anchor. Without them, the Inferno burns its own house down.</p>
<p>Against Haiti: too much quality; even a rotated Brazil still controls tempo. Against Scotland: Scotland will try to drag Brazil into the mist (slow it, scrap it, set-piece it). But Brazil&apos;s individual conduits (Vini specifically) can ignite any stale script.</p>
<p><strong>Verdict:</strong> Brazil tops the group not because they&apos;re &quot;due,&quot; but because their elemental engine matches the East Coast heat and their stars are high-conductivity lightning rods. <strong>Projected role:</strong> 1st — ~7 pts.</p>

<h3>🥈 2nd — 🇲🇦 Morocco (The Atlas Wall)</h3>
<p>Here&apos;s the spicy part: Morocco vs Brazil is being framed as &quot;upset-or-bust,&quot; but the Overlay says it&apos;s more nuanced. Morocco is Earth-Metal: they don&apos;t need to out-samba Brazil; they need to reflect heat and hurt you on transitions via Hakimi&apos;s Metal rail — quick vertical releases, counters that feel like a sliding blade.</p>
<p><strong>The swing match:</strong> Scotland vs Morocco @ Gillette (coastal, cooler, tighter pitch). This is Metal-vs-Metal / Mist-vs-Wall. Expect a low-scoring, foul-heavy, psychological chess match. Morocco&apos;s &quot;wall&quot; usually holds; Scotland&apos;s &quot;mist&quot; usually finds one scramble. If Morocco win or draw that game, 2nd place is theirs.</p>
<p><strong>Star-layer:</strong> Hakimi is the conduit that turns Morocco&apos;s defensive stability into offensive voltage. When he&apos;s high, the element shifts from pure Earth to Earth-with-Metal-lightning. That&apos;s the difference between &quot;brave loss&quot; and &quot;statement win.&quot;</p>
<p><strong>Verdict:</strong> Morocco&apos;s structure + tournament scar tissue (2022 semifinal run) makes them the most stable challenger to Brazil&apos;s throne. <strong>Projected role:</strong> 2nd — ~5 pts.</p>

<h3>🥉 3rd — 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland (The Granite &amp; Mist)</h3>
<p>Scotland&apos;s entire vibe is &quot;we&apos;ll outlast your vibe.&quot; They&apos;re the team you hate playing in October; in June humidity, they have to work harder to summon the mist.</p>
<p><strong>Why they&apos;re dangerous anyway:</strong> McTominay is the lightning rod for chaotic boxes. He converts &quot;ugly half-clearances&quot; into goals — classic Water seeping through Metal cracks. Robertson keeps the emotional tempo high even when the technique gaps show. Gillette Stadium&apos;s coastal air is legit their &quot;home element&quot;: less swamp, more bite.</p>
<p><strong>The cruel math:</strong> They likely split with Haiti, scrap a draw or narrow loss to Morocco, then walk into Hard Rock Stadium (Miami, hot, loud) vs Brazil. That&apos;s a Fire vs Granite finale — beautiful, brutal, probably 0-2 or 1-2.</p>
<p><strong>Overlay truth:</strong> Scotland won&apos;t win the group, but their 3rd-place floor is dangerously high because they specialize in 1-0 and 2-1 &quot;grit results.&quot; In an expanded bracket where best 3rd-places survive, they&apos;re tailor-made for the best-3rd conversation. <strong>Projected role:</strong> 3rd — ~3 pts (best-3rd candidate).</p>

<h3>4th — 🇭🇹 Haiti (The Saltwater Storm)</h3>
<p>This is the fairytale slot — and the Overlay respects it. Water nations live for the moment the favorite gets too comfortable. Haiti&apos;s &quot;storm&quot; isn&apos;t about possession; it&apos;s about sudden-rise pressure, wide transitions, and punishing teams that underestimate their duels.</p>
<p><strong>The problem:</strong> Brazil is too layered to underestimate anyone, and Morocco&apos;s wall punishes disorganized momentum. Haiti&apos;s best shot is scraping a result vs Scotland by turning the match into a tornado of second balls and transition chaos.</p>
<p><strong>Conduit angle:</strong> When Pierrot or Nazon gets a half-step, the &quot;saltwater&quot; cuts deep. But cutting deep once ≠ cutting deep twice.</p>
<p><strong>Verdict:</strong> Haiti leaves with pride, one viral chance, and a legacy photo. The elements are just stacked against a Water team trying to flood two defensive monoliths. <strong>Projected role:</strong> 4th — ~1 pt.</p>

${buildPullQuote("Lock: Brazil top in June humidity. Spiciest take: Scotland vs Morocco Under 2.5 — two walls head-butting. Chaos hedge: Haiti +1.5 if you want drama without the heart attack.")}

<h2>The Final Table (Vibe Code Version)</h2>
<table><thead><tr><th>Pos</th><th>Team</th><th>Pts</th><th>Vibe Verdict</th></tr></thead><tbody>
<tr><td>1</td><td>🇧🇷 Brazil</td><td><strong>7</strong></td><td>Inferno lit at MetLife; too many conductors on the pitch</td></tr>
<tr><td>2</td><td>🇲🇦 Morocco</td><td><strong>5</strong></td><td>Atlas Wall holds; Hakimi&apos;s rail decides the margin</td></tr>
<tr><td>3</td><td>🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland</td><td><strong>3</strong></td><td>Granite &amp; Mist; best-3rd lurker</td></tr>
<tr><td>4</td><td>🇭🇹 Haiti</td><td><strong>1</strong></td><td>Storm breaks once, then runs out of sea</td></tr>
</tbody></table>

<h2>What Is the Oriental Overlay Actually Doing?</h2>
<p>People hear &quot;Five Elements&quot; and imagine incense and fortune cookies. But strip the mystic skin off, and you get a <strong>narrative physics engine</strong>:</p>
<ul>
<li><strong>Fire / Wood</strong> = acceleration, risk, flair, emotional momentum (Brazil)</li>
<li><strong>Earth / Metal</strong> = structure, defensive walls, ruthless transitions (Morocco)</li>
<li><strong>Metal / Water</strong> = discipline + persistence in bad weather, set-piece ratchet (Scotland)</li>
<li><strong>Water</strong> = fluid chaos, counter-rhythm, &quot;flood when you blink&quot; (Haiti)</li>
</ul>
<p>The &quot;mystery&quot; isn&apos;t predicting the scoreline — it&apos;s noticing that certain team cultures consistently behave like certain elements, and then checking whether the venue/conditions feed or starve that element. MetLife&apos;s heat feeds Fire. Gillette&apos;s coast feeds Mist. A roof in Atlanta neutralizes everyone equally. The Overlay just gives you a poetic way to see those dynamics before the stats catch up.</p>

<h2>What to Tell Your Group Chat</h2>
<ul>
<li><strong>The lock:</strong> Brazil top — you&apos;re not brave picking against the Inferno in June humidity.</li>
<li><strong>The spiciest take:</strong> Scotland vs Morocco Under 2.5 — two walls head-butting.</li>
<li><strong>The chaos hedge:</strong> Haiti +1.5 in the opener if you want the drama without the heart attack.</li>
<li><strong>The swing game:</strong> Scotland vs Morocco @ Gillette decides who holds 2nd behind Brazil.</li>
</ul>

<div class="fact-box">
<h4>Group C Venue Element Map</h4>
<ul>
<li><strong>MetLife (NJ):</strong> Open roof, humid heat — Fire / Yang amplifier (Brazil opener)</li>
<li><strong>Gillette (Boston):</strong> Coastal breeze, tight grass — Metal / Mist home for Scotland</li>
<li><strong>Lincoln Financial (Philly):</strong> Loud, enclosed grind — Earth-Metal</li>
<li><strong>Mercedes-Benz (Atlanta):</strong> Retractable roof — neutral, climate-controlled</li>
</ul>
</div>
`.trim();
}

function buildPost(): Post {
  const title =
    "The Vibe Code: World Cup 2026 Group C — A Clash of Kingdoms";
  const lead =
    "The Ancient Algorithm says Group C isn't a Group of Death — it's a Clash of Kingdoms. Brazil brought the throne; Morocco built the Atlas Wall; Scotland summons Granite & Mist; Haiti rides Saltwater & Thunder. We ran it through the Oriental Overlay.";
  const now = new Date().toISOString();

  const content = assembleKcContent({
    disclaimer:
      "Entertainment only — pop-astrology-for-football, not a betting tip sheet. The Oriental Overlay is a 3,000-year-old pattern-language (Five Elements) used as cosmic color-grading on top of xG. Fun? Yes. Guaranteed? No. Don't bet rent on a vibe engine.",
    takeaways: [
      "Group C: Brazil, Morocco, Scotland, Haiti — Clash of Kingdoms, not Group of Death",
      "Oriental Overlay ranks Brazil 1st (7 pts), Morocco 2nd (5 pts), Scotland 3rd (3 pts, best-3rd lurker), Haiti 4th (1 pt)",
      "Venue element map: MetLife feeds Fire, Gillette feeds Mist/Metal, Atlanta roof neutralizes everyone",
      "Archetypes: Brazil Rainforest Inferno, Morocco Atlas Wall, Scotland Granite & Mist, Haiti Saltwater Storm",
      "Swing match: Scotland vs Morocco @ Gillette — low-scoring wall vs mist decides 2nd place",
    ],
    lead,
    bodyInner: buildBody(),
    faqs: [
      {
        question: "Who wins World Cup 2026 Group C in the Vibe Code prediction?",
        answer:
          "This piece ranks Brazil first on roughly seven points, Morocco second on five, Scotland third on three (with a strong best-third-place case), and Haiti fourth on one point — as entertainment, not certified forecasts.",
      },
      {
        question: "Which teams are in World Cup 2026 Group C?",
        answer:
          "Group C features Brazil, Morocco, Scotland, and Haiti, with fixtures across East Coast venues including MetLife Stadium (NJ), Gillette Stadium (Boston), Lincoln Financial Field (Philadelphia), and Mercedes-Benz Stadium (Atlanta).",
      },
      {
        question: "Why does Brazil top Group C in the Oriental Overlay?",
        answer:
          "Brazil is framed as the Rainforest Inferno (Wood → Fire) with Vinícius Jr, Raphinha, and Casemiro/Marquinhos as conduits. MetLife's humid June heat amplifies Fire, matching Brazil's rhythm-to-explosion engine better than the other nations' elements.",
      },
      {
        question: "What is the key swing match in Group C?",
        answer:
          "Scotland vs Morocco at Gillette Stadium is the swing needle — Metal-vs-Metal, Mist-vs-Wall. A Morocco win or draw there likely secures second place behind Brazil.",
      },
      {
        question: "Can Scotland advance from Group C as best third place?",
        answer:
          "The Overlay positions Scotland as a best-third candidate: they specialize in 1-0 and 2-1 grit results, Gillette's coastal air suits their Granite & Mist archetype, and their floor is high even if they lose the Brazil finale in Miami heat.",
      },
      {
        question: "Is the Vibe Code Group C article betting advice?",
        answer:
          "No. It is labeled entertainment and cultural storytelling only. References to spreads or totals in group-chat tips are rhetorical, not gambling recommendations.",
      },
    ],
    sourceNote:
      "Oriental Overlay and Five Elements framing are editorial cultural devices. Group composition and venue references follow public World Cup 2026 scheduling assumptions. Point totals are illustrative narrative, not certified predictions.",
  });

  return {
    id: "64",
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
      "group-c-world-cup",
      "brazil-world-cup-2026",
      "morocco-world-cup",
      "scotland-world-cup",
      "haiti-world-cup",
      "brazil-vs-morocco",
      "atlas-wall",
      "granite-and-mist",
      "alternative-analytics",
      "entertainment",
      "culture",
    ],
    seo_title:
      "Vibe Code: Group C World Cup 2026 — Brazil, Morocco & Oriental Overlay",
    seo_description:
      "The Vibe Code runs WC2026 Group C through the Oriental Overlay: Brazil 1st, Morocco 2nd, Scotland 3rd, Haiti 4th. Clash of Kingdoms on the East Coast. Entertainment only.",
    og_image: HERO,
    publish_status: "published",
    read_time_minutes: 10,
    view_count: 20100,
    share_count: 1407,
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
 * Added vibe-code-world-cup-2026-group-c at ${new Date().toISOString()}
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
    console.log(`Added: ${SLUG} (id 64, total ${posts.length})`);
  }
  writeSeedPosts(posts);
}

main();
