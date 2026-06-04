import {
  assembleKcContent,
  buildPullQuote,
  imgTag,
} from "./kc-article-blocks";
import { newsImageUrl } from "./news-images";
import type { NewsArticleEnrichment } from "./news-article-enrichments";

const S006 = "spain-billion-euro-squad-world-cup";
const S007 = "england-world-cup-wealth-list";
const S008 = "who-wins-world-cup-predictions";

const IMG_006_1 = newsImageUrl(S006, "006-img-1.jpg");
const IMG_006_2 = newsImageUrl(S006, "006-img-2.jpg");
const IMG_006_3 = newsImageUrl(S006, "006-img-3.jpg");
const IMG_007_1 = newsImageUrl(S007, "007-img-1.jpg");
const IMG_007_2 = newsImageUrl(S007, "007-img-2.jpg");
const IMG_007_3 = newsImageUrl(S007, "007-img-3.jpg");
const IMG_007_4 = newsImageUrl(S007, "007-img-4.jpg");
const IMG_007_5 = newsImageUrl(S007, "007-img-5.jpg");
const IMG_007_6 = newsImageUrl(S007, "007-img-6.jpg");
const IMG_007_7 = newsImageUrl(S007, "007-img-7.jpg");
const IMG_008_1 = newsImageUrl(S008, "008-img-1.jpg");
const IMG_008_2 = newsImageUrl(S008, "008-img-2.jpg");
const IMG_008_3 = newsImageUrl(S008, "008-img-3.jpg");
const IMG_008_4 = newsImageUrl(S008, "008-img-4.jpg");
const IMG_008_5 = newsImageUrl(S008, "008-img-5.jpg");

export const NEWS_ARTICLE_ENRICHMENTS_006_008: NewsArticleEnrichment[] = [
  {
    slug: S006,
    tags: [
      "spain-world-cup-2026",
      "spain-squad-value",
      "lamine-yamal-spain",
      "rodri-ballon-dor",
      "spain-penalty-problem",
      "euros-2024-champions",
      "world-cup-2026",
      "group-h-world-cup",
      "news",
    ],
    seo_title:
      "Spain's $1.4B World Cup Squad: Loaded Talent, One Penalty Flaw",
    seo_description:
      "Spain roll into WC2026 with a €12.8B squad, Euros momentum, and Group H favorability — but their knockout penalty history could blow up the dream.",
    emotion_type: "hype",
    hero_image: IMG_006_1,
    og_image: IMG_006_1,
    read_time_minutes: 7,
    takeaways: [
      "Spain's 26-man roster is valued at roughly €12.8 billion ($14.1B USD)",
      "Euro 2024 champions enter undefeated in qualifying with Yamal, Rodri, Pedri, and Gavi",
      "Group H (Cape Verde, Saudi Arabia, Uruguay) looks manageable on paper",
      "Knockout penalty losses in 2020 and 2022 remain the elephant in the room",
      "Editorial verdict: semifinals at minimum if they solve spot-kick nerves",
    ],
    lead: "Spain is not coming to North America to make friends. They're coming to lift the trophy — with a €12.8 billion squad, Euros momentum, and a group draw that feels like a formality. One thing could still blow it up: penalties.",
    faqs: [
      {
        question: "How much is Spain's 2026 World Cup squad worth?",
        answer:
          "Reports cited in this piece value Luis de la Fuente's 26-man Spain roster at roughly €12.8 billion, or about $14.1 billion USD, making them one of the most expensive squads at the tournament.",
      },
      {
        question: "Who are Spain's key players at World Cup 2026?",
        answer:
          "The spine includes Unai Simón in goal, Rodri as the pivot, Pedri and Gavi in midfield, and wide threats Lamine Yamal and Nico Williams — with Oyarzabal or Ferran Torres leading the line.",
      },
      {
        question: "What is Spain's World Cup 2026 group?",
        answer:
          "Spain are in Group H with Cape Verde, Saudi Arabia, and Uruguay. On paper Cape Verde and Saudi Arabia are the lighter tests; Uruguay is the main group-stage rival.",
      },
      {
        question: "Why do people say Spain have a penalty problem?",
        answer:
          "Spain were eliminated on penalties at Euro 2020 and again at the 2022 World Cup. For a possession-dominant team, knockout games that go to spot kicks have become a recurring psychological hurdle.",
      },
      {
        question: "Can Spain win the 2026 World Cup?",
        answer:
          "This article argues Spain should reach at least the semifinals given talent and form, but winning the whole tournament likely requires avoiding penalties or finally converting them under pressure.",
      },
    ],
    sourceNote:
      "Squad valuation and tactical notes based on reported coverage (Tencent News / original reporting). Group schedule dates are editorial estimates in EST. Penalty history references documented knockout exits.",
    buildBody: () => `
<p>Fresh off their 2024 Euros title, La Roja stroll into the 2026 World Cup undefeated in qualifying, with an absurd squad worth <strong>€12.8 billion ($14.1 billion USD)</strong>, and a group draw that feels less like a challenge and more like a formality.</p>
<figure class="article-image">${imgTag(IMG_006_1, "Spain national team in action during World Cup preparation")}</figure>
<h2>The Squad: Loaded Everywhere You Look</h2>
<p>Manager Luis de la Fuente has his 26-man roster locked. Barcelona wonderkid Fermín is out injured, and Real Madrid's Huijsen didn't make the cut — but Spain barely flinched.</p>
<ul>
<li><strong>Goalkeeper:</strong> Unai Simón (the undisputed No. 1)</li>
<li><strong>Defense:</strong> Cubarsí, Laporte, Grimaldo, Porro — two-way builders from the back</li>
<li><strong>Midfield:</strong> Rodri as the single pivot — the Ballon d'Or winner</li>
<li><strong>Creators:</strong> Pedri and Gavi bring legs and ideas</li>
<li><strong>Wide threats:</strong> Lamine Yamal and Nico Williams — both under 23, both terrifying one-on-one</li>
</ul>
<p>De la Fuente switches between <strong>4-3-3 and 4-2-3-1</strong>, but the philosophy stays the same: control the ball, suffocate the opponent, strike when they crack.</p>
${buildPullQuote("Spain hasn't lost a competitive match in over two years. That's not an accident.")}
<figure class="article-image">${imgTag(IMG_006_2, "Spain's young stars training ahead of the tournament")}</figure>
<h2>The Edge: Midfield Dominance and Infinite Stamina</h2>
<p>No team on the planet can match Spain's midfield on paper. Rodri is the best defensive midfielder alive. Pedri is 22 going on veteran genius. Gavi runs like he's personally offended by the concept of tiredness.</p>
<p>This isn't tiki-taka nostalgia — it's modern positional play with actual bite. They dominate possession <em>and</em> counter-press like maniacs.</p>
<h2>The Problem: Penalties. It's Always Penalties.</h2>
<p>Possession-dominant teams eventually face a parked bus, extra time, and the spot. Spain have a <strong>documented penalty problem</strong>: Euro 2020 — out on penalties. World Cup 2022 — out on penalties.</p>
<p>The group stage won't test this. But the Round of 16? The quarterfinals? That's where the ghosts come back.</p>
<figure class="article-image">${imgTag(IMG_006_3, "Spanish players celebrating a goal in qualifying")}</figure>
<h2>The Path Forward</h2>
<table><thead><tr><th>Date</th><th>Opponent</th><th>What to Expect</th></tr></thead><tbody>
<tr><td>June 16</td><td>Cape Verde</td><td>A warm-up — Spain's depth should handle this.</td></tr>
<tr><td>June 22</td><td>Saudi Arabia</td><td>Tough defense, but Spain breaks low blocks better than almost anyone.</td></tr>
<tr><td>June 27</td><td>Uruguay</td><td>The group decider — both may already be through.</td></tr>
</tbody></table>
<p>Realistically, Spain take 7 or 9 points, win the group, and get a favorable Round of 16 matchup.</p>
<p><strong>The verdict:</strong> Semifinals at minimum. If they avoid penalties — or finally win one — there's no reason they can't win the whole thing. That &quot;if&quot; is doing a lot of heavy lifting.</p>
${buildPullQuote("Talent doesn't score penalties. Nerve does.")}
`,
  },
  {
    slug: S007,
    tags: [
      "england-world-cup-squad-wealth",
      "harry-kane-net-worth",
      "jude-bellingham-wealth",
      "bukayo-saka-sauce",
      "england-world-cup-2026",
      "thomas-tuchel-england",
      "wags-lifestyle",
      "news",
    ],
    seo_title:
      "England World Cup Squad Net Worth: Kane $140M Tops $600M Roster",
    seo_description:
      "The Sun ranked every England 2026 squad player's net worth — Harry Kane leads at $139.7M, Bellingham and Saka's brands shine, but wealth won't buy a trophy.",
    emotion_type: "culture",
    hero_image: IMG_007_1,
    og_image: IMG_007_1,
    read_time_minutes: 8,
    takeaways: [
      "England's 26-man World Cup roster has a combined net worth over $600 million",
      "Harry Kane tops the list at roughly £110M ($139.7M) with Bayern and Skechers deals",
      "Jude Bellingham is worth about $50.8M at age 22 with a massive brand portfolio",
      "Bukayo Saka's image rights and Nando's sauce line add to his $29.8M net worth",
      "Ivan Toney's Saudi move (~£400K/week) and heat experience earned a squad spot",
    ],
    lead: "England hasn't won a World Cup since 1966 — but the money has definitely come home. We ranked Thomas Tuchel's 26-man roster by real net worth, and Harry Kane is smoking the entire squad.",
    faqs: [
      {
        question: "Who is the richest player in England's World Cup squad?",
        answer:
          "Harry Kane leads with a reported net worth of about £110 million ($139.7M), built from elite club contracts at Tottenham and Bayern Munich plus long-term endorsement deals including Skechers.",
      },
      {
        question: "How much is Jude Bellingham worth?",
        answer:
          "Bellingham is listed at roughly £40 million ($50.8M) at 22, boosted by Real Madrid wages and deals with Adidas, Louis Vuitton, and other major brands.",
      },
      {
        question: "Why is Bukayo Saka on England's wealth ranking?",
        answer:
          "Beyond his Arsenal contract, Saka's image rights company grew significantly and he co-brands a signature hot sauce line with Nando's — part of why he's valued around $29.8M.",
      },
      {
        question: "Why did Ivan Toney make England's World Cup squad?",
        answer:
          "Tuchel reportedly valued Toney's Saudi Pro League experience in extreme heat as a potential edge for 2026 knockout matches played in high temperatures.",
      },
      {
        question: "Does player wealth help England win the World Cup?",
        answer:
          "No — this piece stresses that net worth and endorsements don't replace knockout nerve. England still need one perfect month on the pitch, not in a boardroom.",
      },
    ],
    sourceNote:
      "Wealth figures attributed to The Sun via Tencent News reporting. Currency conversion at £1 = $1.27 USD. Net worth estimates are third-party editorial rankings, not audited financial statements.",
    buildBody: () => `
<figure class="article-image">${imgTag(IMG_007_1, "England's 26-man World Cup squad in training")}</figure>
<h2>The Top 10: England's Player Wealth Rankings</h2>
<table><thead><tr><th>#</th><th>Player</th><th>Net Worth (£)</th><th>Net Worth (USD)</th><th>Club</th></tr></thead><tbody>
<tr><td>1</td><td><strong>Harry Kane</strong></td><td>£110M</td><td><strong>$139.7M</strong></td><td>Bayern Munich</td></tr>
<tr><td>2</td><td>Marcus Rashford</td><td>£65M</td><td>$82.6M</td><td>Manchester United</td></tr>
<tr><td>3</td><td>Jude Bellingham</td><td>£40M</td><td>$50.8M</td><td>Real Madrid</td></tr>
<tr><td>4</td><td>Jordan Pickford</td><td>£36M</td><td>$45.7M</td><td>Everton</td></tr>
<tr><td>5</td><td>Bukayo Saka</td><td>£23.5M</td><td>$29.8M</td><td>Arsenal</td></tr>
<tr><td>6</td><td>John Stones</td><td>£22M</td><td>$27.9M</td><td>Manchester City</td></tr>
<tr><td>7</td><td>Ollie Watkins</td><td>£21M</td><td>$26.7M</td><td>Aston Villa</td></tr>
<tr><td>8</td><td>Declan Rice</td><td>£20M</td><td>$25.4M</td><td>Arsenal</td></tr>
<tr><td>9</td><td>Jordan Henderson</td><td>£19.5M</td><td>$24.8M</td><td>—</td></tr>
<tr><td>10</td><td>Ivan Toney</td><td>£15M</td><td>$19.1M</td><td>Saudi Pro League</td></tr>
</tbody></table>
<p><em>Conversions at £1 = $1.27 USD.</em></p>
<figure class="article-image">${imgTag(IMG_007_2, "Harry Kane in action for Bayern Munich")}</figure>
<h2>Where the Money Comes From</h2>
<h3>Harry Kane — $139.7M and Counting</h3>
<p>Kane's wealth comes from elite contracts — first at Tottenham, now in Germany — plus a lifetime Skechers deal after splitting from Nike. He's also England's all-time leading scorer.</p>
<h3>Jude Bellingham — $50.8M at 22</h3>
<p>Twenty-two years old and already worth more than most people earn in 20 lifetimes. Real Madrid money helps, but Bellingham's brand portfolio is borderline absurd: Adidas, Louis Vuitton, energy drinks, fast food, gaming — plus a co-branded clothing line.</p>
<figure class="article-image">${imgTag(IMG_007_3, "Jude Bellingham during a Real Madrid match")}</figure>
<h3>Bukayo Saka — $29.8M and a Sauce Empire</h3>
<p>Fresh off helping Arsenal win the Premier League title, Saka signed a massive extension. His image rights company grew by over £2 million last year, and he has a signature hot sauce line co-branded with Nando's. <strong>Yes, Saka's own sauce.</strong> It sells out constantly.</p>
<figure class="article-image">${imgTag(IMG_007_4, "Bukayo Saka with Nando's sauce branding")}</figure>
<h3>Ivan Toney — The Wild Card at #10</h3>
<p>Toney left Brentford for the Saudi Pro League and his weekly paycheck jumped to roughly <strong>£400,000 ($508K/week)</strong>. Tuchel included him partly because experience in extreme heat could matter in 95°F (35°C) knockout weather.</p>
<figure class="article-image">${imgTag(IMG_007_5, "Ollie Watkins celebrates for Aston Villa")}</figure>
<figure class="article-image">${imgTag(IMG_007_6, "Declan Rice in England training")}</figure>
<figure class="article-image">${imgTag(IMG_007_7, "England 2026 World Cup player wealth ranking chart")}</figure>
<h2>The Bigger Picture</h2>
<p>None of this money buys a World Cup. England's golden generation can negotiate eight-figure endorsement deals — but they've never lifted the trophy that actually matters.</p>
${buildPullQuote("They've got the wealth. They've got the talent. Now they need one perfect month.")}
`,
  },
  {
    slug: S008,
    tags: [
      "world-cup-2026-predictions",
      "goldman-sachs-world-cup",
      "opta-world-cup-prediction",
      "ea-sports-world-cup-simulation",
      "spain-favorite-world-cup",
      "portugal-world-cup-prediction",
      "netherlands-world-cup-2026",
      "news",
    ],
    seo_title:
      "Who Wins World Cup 2026? Goldman, OPTA, EA & Economist Picks",
    seo_description:
      "Six forecasts for WC2026: Goldman Sachs, OPTA, Pew, Transfermarkt pick Spain; EA says Portugal; economist Clement picks Netherlands. Entertainment only.",
    emotion_type: "hype",
    hero_image: IMG_008_1,
    og_image: IMG_008_1,
    read_time_minutes: 9,
    disclaimer:
      "Tournament predictions are for entertainment and discussion only — not betting or financial advice. Models disagree by design; past simulation hits do not guarantee future results.",
    takeaways: [
      "Goldman Sachs (25.7%) and OPTA (16.1%) both favor Spain after thousands of simulations",
      "Pew found 66% of Americans are not very interested in a US-hosted World Cup",
      "EA Sports simulates Portugal winning — after calling four straight champions",
      "German economist Joachim Clement picks Netherlands over Portugal in the final",
      "Four of six predictors agree on Spain; dissenters are EA and Clement",
    ],
    lead: "Six different predictions. Six different methodologies. And somehow, four of them landed on the same answer — Spain. The 2026 World Cup forecasting industry has already declared a spreadsheet champion before kickoff.",
    faqs: [
      {
        question: "Who does Goldman Sachs predict to win World Cup 2026?",
        answer:
          "Goldman's model — built on 20,000 matches since 1978 and 50,000 Monte Carlo runs — gives Spain a 25.7% win probability, with France second at 18.9%.",
      },
      {
        question: "What does the OPTA supercomputer predict?",
        answer:
          "OPTA's 10,000 simulations also favor Spain at 16.1%, citing a favorable Group H path and knockout bracket compared with other top contenders.",
      },
      {
        question: "Who does EA Sports predict will win the 2026 World Cup?",
        answer:
          "EA's official tournament simulation picks Portugal for their first World Cup title. EA had correctly predicted the last four World Cup winners in its pre-tournament sims.",
      },
      {
        question: "Who is Joachim Clement and what does he predict?",
        answer:
          "Joachim Clement is a German economist who correctly called the 2014, 2018, and 2022 champions. His 2026 model forecasts a Netherlands vs Portugal final with the Netherlands winning.",
      },
      {
        question: "Are World Cup prediction models reliable?",
        answer:
          "They are useful narratives, not guarantees. Clement himself notes player quality and host advantage may explain only about half the outcome — the rest is luck. Treat all picks as entertainment.",
      },
    ],
    sourceNote:
      "Predictor summaries based on CRI / Tencent News and cited public models (Goldman Sachs, OPTA, Pew Research, Transfermarkt, EA Sports, Joachim Clement). Probabilities are as reported in source coverage.",
    buildBody: () => `
<h2>Goldman Sachs: Spain by a Mile (25.7%)</h2>
<p>The investment bank built a statistical model covering <strong>20,000 international matches since 1978</strong>, ran <strong>50,000 Monte Carlo simulations</strong>, and factored in scoring talent, momentum, psychology, geography, and a &quot;football nation&quot; bonus.</p>
<p>Result: <strong>Spain wins 25.7%</strong> of simulations. France is second at 18.9%, with Argentina, Brazil, and the Netherlands rounding out the top five.</p>
<figure class="article-image">${imgTag(IMG_008_1, "Goldman Sachs prediction model showing Spain as top favorite")}</figure>
<h2>OPTA Supercomputer: Spain Again (16.1%)</h2>
<p>OPTA ran 10,000 tournament simulations and landed on Spain at 16.1%. Their model highlights <strong>Spain's favorable bracket path</strong> through Group H. France slots in at 13% for second.</p>
${buildPullQuote("OPTA gives five teams exactly 0.0% probability. Respectfully — find a second team.")}
<figure class="article-image">${imgTag(IMG_008_2, "OPTA supercomputer probability chart for World Cup contenders")}</figure>
<h2>Pew Research Center: 66% of Americans Don't Care</h2>
<p>Pew surveyed 3,507 Americans and found <strong>66% are &quot;not very interested.&quot;</strong> Only 14% said they're paying close attention. Among those who care, Spain leads with 9% support.</p>
<p>The USMNT has home-field advantage and only 7% of respondents believed in them. That's brutal.</p>
<figure class="article-image">${imgTag(IMG_008_3, "Pew Research poll on World Cup interest and predictions")}</figure>
<h2>Transfermarkt: Spain — But England Is Right Behind</h2>
<p>Transfermarkt puts Spain at #1 and <strong>England at #2</strong>, arguing Spain's possession-based style is the most technically advanced system in the tournament — driven largely by player market values.</p>
<figure class="article-image">${imgTag(IMG_008_4, "Transfermarkt World Cup odds and predictions")}</figure>
<h2>The Contrarians</h2>
<h3>EA Sports: Portugal Finally Gets Its Moment</h3>
<p>EA simulated the tournament using its player database and picked <strong>Portugal winning their first-ever World Cup</strong>. EA correctly predicted the last <strong>four</strong> World Cup winners in official sims.</p>
<figure class="article-image">${imgTag(IMG_008_5, "EA Sports World Cup simulation — Portugal as champions")}</figure>
<h3>Joachim Clement: Netherlands</h3>
<p>German economist Joachim Clement called Germany 2014, France 2018, and Argentina 2022. For 2026 his model spits out a <strong>Netherlands vs Portugal final</strong>, with the Netherlands winning.</p>
<p>Clement told the BBC that player quality and weather might explain only <strong>50% of the outcome — the other 50% is luck.</strong></p>
<h2>The Scoreboard</h2>
<table><thead><tr><th>Predictor</th><th>Champion Pick</th><th>Runner-Up / #2</th></tr></thead><tbody>
<tr><td><strong>Goldman Sachs</strong></td><td>🇪🇸 Spain (25.7%)</td><td>France (18.9%)</td></tr>
<tr><td><strong>OPTA</strong></td><td>🇪🇸 Spain (16.1%)</td><td>France (13%)</td></tr>
<tr><td><strong>Pew Research</strong></td><td>🇪🇸 Spain (9%)</td><td>Brazil / Argentina (8%)</td></tr>
<tr><td><strong>Transfermarkt</strong></td><td>🇪🇸 Spain</td><td>England</td></tr>
<tr><td><strong>EA Sports</strong></td><td>🇵🇹 Portugal</td><td>—</td></tr>
<tr><td><strong>Clement Model</strong></td><td>🇳🇱 Netherlands</td><td>Portugal</td></tr>
</tbody></table>
<p>Four of six independent predictors landed on Spain. EA and Clement disagree — and a supermajority of Americans don't care who wins as long as the beer is cold.</p>
${buildPullQuote("Markets predicted Hillary Clinton in 2016. Football markets can groupthink too.")}
<p><em>We'll know the truth in about five weeks.</em></p>
`,
  },
];

export function buildEnrichedContentBatch2(
  e: NewsArticleEnrichment
): string {
  return assembleKcContent({
    disclaimer: e.disclaimer,
    takeaways: e.takeaways,
    lead: e.lead,
    bodyInner: e.buildBody(),
    faqs: e.faqs,
    sourceNote: e.sourceNote,
  });
}
