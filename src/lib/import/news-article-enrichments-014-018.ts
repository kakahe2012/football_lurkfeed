import {
  assembleKcContent,
  buildPullQuote,
  imgTag,
} from "./kc-article-blocks";
import { newsImageUrl } from "./news-images";
import type { NewsArticleEnrichment } from "./news-article-enrichments";

const S014 = "bbc-top-10-world-cup-jerseys";
const S015 = "messi-ronaldo-world-cup-scoreboard";
const S016 = "mbappe-girlfriend-drama-petition-world-cup";
const S017 = "france-16-billion-squad-world-cup-preview";
const S018 = "neymar-calf-injury-last-world-cup";

const IMG_014_1 = newsImageUrl(S014, "014-img-1.webp");
const IMG_014_2 = newsImageUrl(S014, "014-img-2.webp");
const IMG_014_3 = newsImageUrl(S014, "014-img-3.webp");
const IMG_014_4 = newsImageUrl(S014, "014-img-4.webp");
const IMG_014_5 = newsImageUrl(S014, "014-img-5.webp");
const IMG_014_6 = newsImageUrl(S014, "014-img-6.webp");
const IMG_014_7 = newsImageUrl(S014, "014-img-7.webp");
const IMG_014_8 = newsImageUrl(S014, "014-img-8.webp");
const IMG_014_10 = newsImageUrl(S014, "014-img-10.webp");
const IMG_014_11 = newsImageUrl(S014, "014-img-11.webp");

const IMG_015_1 = newsImageUrl(S015, "015-img-1.webp");
const IMG_015_2 = newsImageUrl(S015, "015-img-2.webp");
const IMG_015_3 = newsImageUrl(S015, "015-img-3.webp");

const IMG_016_1 = newsImageUrl(S016, "016-img-1.webp");
const IMG_016_4 = newsImageUrl(S016, "016-img-4.webp");
const IMG_016_7 = newsImageUrl(S016, "016-img-7.webp");
const IMG_016_9 = newsImageUrl(S016, "016-img-9.webp");
const IMG_016_15 = newsImageUrl(S016, "016-img-15.webp");
const IMG_016_16 = newsImageUrl(S016, "016-img-16.webp");

const IMG_017_1 = newsImageUrl(S017, "017-img-1.webp");
const IMG_017_2 = newsImageUrl(S017, "017-img-2.webp");
const IMG_017_3 = newsImageUrl(S017, "017-img-3.webp");
const IMG_017_4 = newsImageUrl(S017, "017-img-4.webp");

const IMG_018_1 = newsImageUrl(S018, "018-img-1.webp");
const IMG_018_2 = newsImageUrl(S018, "018-img-2.webp");
const IMG_018_3 = newsImageUrl(S018, "018-img-3.webp");
const IMG_018_4 = newsImageUrl(S018, "018-img-4.webp");
const IMG_018_5 = newsImageUrl(S018, "018-img-5.webp");
const IMG_018_6 = newsImageUrl(S018, "018-img-6.webp");

export const NEWS_ARTICLE_ENRICHMENTS_014_018: NewsArticleEnrichment[] = [
  {
    slug: S014,
    tags: [
      "world-cup-jerseys",
      "world-cup-kits",
      "bbc-world-cup",
      "germany-1990-jersey",
      "maradona-1986-jersey",
      "nigeria-2018-kit",
      "world-cup-fashion",
      "world-cup-2026",
      "news",
    ],
    seo_title:
      "10 Greatest World Cup Jerseys Ever — BBC Ranking, Germany #1",
    seo_description:
      "BBC ranked the 10 greatest World Cup kits of all time: Germany 1990 tops the list, Argentina 1986 and USA 1994 denim make the podium. Cameroon's banned sleeveless kit at #10.",
    emotion_type: "culture",
    hero_image: IMG_014_1,
    og_image: IMG_014_11,
    read_time_minutes: 6,
    takeaways: [
      "BBC Sport ranked the 10 greatest World Cup jerseys — Germany 1990 home takes #1",
      "#2 Argentina 1986 away: Maradona&apos;s Hand of God shirt sold for £7.1M at auction",
      "#3 USA 1994 denim away kit — peak &apos;90s Americana cult classic",
      "Cameroon 2002 sleeveless kit at #10 was banned by FIFA before the World Cup",
      "Nigeria 2018 home had 3 million pre-orders and broke into streetwear culture",
    ],
    lead: "With 48 teams about to march into stadiums across the US, Canada, and Mexico, BBC dropped a list that&apos;s guaranteed to start fights in every group chat: the 10 greatest World Cup jerseys of all time.",
    faqs: [
      {
        question: "What is the greatest World Cup jersey of all time?",
        answer:
          "BBC Sport ranks West Germany&apos;s 1990 home kit #1 — the flag-inspired geometric Adidas design worn when they lifted the trophy in Italy. Designer Ina Franzmann almost replaced it after Euro 1988 until Franz Beckenbauer insisted they keep it.",
      },
      {
        question: "Why is Argentina&apos;s 1986 away jersey so famous?",
        answer:
          "Maradona wore the navy away shirt for the quarterfinal vs England — scoring the Hand of God and the Goal of the Century. The squad allegedly bought knockoff replacements in Mexico City after FIFA kit rules blocked their home stripes.",
      },
      {
        question: "Why didn&apos;t Cameroon wear the 2002 sleeveless jersey at the World Cup?",
        answer:
          "Cameroon wore sleeveless kits at AFCON 2000 and won, but FIFA ordered sleeves added before the World Cup. The banned design still ranks among the most iconic kits ever made.",
      },
      {
        question: "Which World Cup jersey sold for the most money at auction?",
        answer:
          "Maradona&apos;s Argentina 1986 shirt — swapped with England&apos;s Steve Hodge after the quarterfinal — sold for £7.1 million ($9M) in 2022, making it one of the most expensive pieces of sports memorabilia ever.",
      },
      {
        question: "What made Nigeria&apos;s 2018 World Cup kit special?",
        answer:
          "Nike&apos;s Nigeria 2018 home jersey drew roughly 3 million pre-orders and sold out at flagship stores. It crossed from football into mainstream streetwear — rare for a national-team kit.",
      },
    ],
    sourceNote:
      "Kit rankings and anecdotes attributed to BBC Sport coverage via Tencent News (June 5, 2026).",
    buildBody: () => `
<p>Some are iconic. Some are cursed. One literally never saw a World Cup pitch. Let&apos;s get into it.</p>
<figure class="article-image">${imgTag(IMG_014_1, "Classic World Cup jerseys through the decades")}</figure>
<ol class="ranked-list" start="10">
<li class="rank-item"><div class="rank-content"><h3>10. Cameroon — 2002 Home</h3>
<figure class="article-image">${imgTag(IMG_014_2, "Cameroon 2002 sleeveless jersey")}</figure>
<p>This is the jersey that was too cool for FIFA. Cameroon wore sleeveless kits at AFCON 2000 and won the whole thing. Then FIFA stepped in and said: &quot;Put some sleeves on that.&quot;</p>
<p>They never got to wear it at the World Cup. Which, honestly, just adds to the legend. Former Cameroon midfielder Eric Djemba-Djemba put it best: <em>&quot;The whole of Africa wanted to wear that shirt.&quot;</em></p></div></li>
<li class="rank-item"><div class="rank-content"><h3>9. England — 1966 Away</h3>
<figure class="article-image">${imgTag(IMG_014_3, "England 1966 red away jersey")}</figure>
<p>If you&apos;re in a pub in London this summer, you&apos;ll see this red jersey everywhere. It&apos;s the shirt England wore the one and only time they lifted the World Cup. Sometimes a jersey doesn&apos;t need to look revolutionary — it just needs to mean something.</p></div></li>
<li class="rank-item"><div class="rank-content"><h3>8. France — 1982 Home</h3>
<figure class="article-image">${imgTag(IMG_014_4, "France 1982 home jersey")}</figure>
<p>The 1982 semifinal between France and West Germany was chaos: a shocking goalkeeper collision, a 3-3 thriller in extra time, the first penalty shootout in World Cup history. Michel Platini&apos;s French squad wore this — a jersey so clean it looks like it was designed yesterday.</p></div></li>
<li class="rank-item"><div class="rank-content"><h3>7. Netherlands — 1974 Home</h3>
<figure class="article-image">${imgTag(IMG_014_5, "Netherlands 1974 Cruyff jersey with two stripes")}</figure>
<p>Total Football wasn&apos;t just a tactical revolution — it was an attitude. Johan Cruyff had a personal Puma deal and refused Adidas&apos; three stripes. After a standoff, his jersey shipped with only two stripes. King behavior.</p></div></li>
<li class="rank-item"><div class="rank-content"><h3>6. Croatia — 1998 Home</h3>
<figure class="article-image">${imgTag(IMG_014_6, "Croatia 1998 checkerboard home jersey")}</figure>
<p>Davor Šuker, a red-and-white checkerboard, and a third-place debut run that nobody saw coming. Croatia&apos;s 1998 kit was the uniform of the tournament&apos;s most surprising underdog story.</p></div></li>
<li class="rank-item"><div class="rank-content"><h3>5. Nigeria — 2018 Home</h3>
<figure class="article-image">${imgTag(IMG_014_7, "Nigeria 2018 home jersey")}</figure>
<p>Three million pre-orders. Lines around the block at Nike&apos;s London flagship. This wasn&apos;t just a football jersey — it was a fashion moment that broke into streetwear culture.</p></div></li>
<li class="rank-item"><div class="rank-content"><h3>4. Brazil — 1970 Home</h3>
<figure class="article-image">${imgTag(IMG_014_8, "Brazil 1970 yellow home jersey")}</figure>
<p>No country owns a color the way Brazil owns yellow. Pelé, Carlos Alberto, Jairzinho, Rivelino — the greatest national team ever assembled, in a kit so simple and brilliant it&apos;s basically untouchable.</p></div></li>
<li class="rank-item"><div class="rank-content"><h3>3. USA — 1994 Away</h3>
<p>Adidas went full Americana: denim texture, giant stars across the front, and the audacity to pull it off. The team worried they&apos;d get clowned. Instead this kit became a cult classic. Peak &apos;90s. Absolutely zero notes.</p></div></li>
<li class="rank-item"><div class="rank-content"><h3>2. Argentina — 1986 Away</h3>
<figure class="article-image">${imgTag(IMG_014_10, "Argentina 1986 Maradona away jersey")}</figure>
<p>The &quot;Hand of God.&quot; The solo goal that broke England. FIFA blocked Argentina&apos;s striped home kit vs England&apos;s white — so Carlos Bilardo allegedly sent staff to a Mexico City knockoff market. Maradona picked the winner: <em>&quot;This is a beautiful jersey. Wearing it, we will beat the English.&quot;</em></p>
<p>Equipment managers hand-stitched numbers the night before. In 2022, Steve Hodge sold that exact shirt at auction for <strong>£7.1 million ($9 million)</strong>.</p></div></li>
<li class="rank-item"><div class="rank-content"><h3>1. Germany — 1990 Home</h3>
<figure class="article-image">${imgTag(IMG_014_11, "Germany 1990 home World Cup winning jersey")}</figure>
<p>The undisputed champ. A collector&apos;s grail. The design debuted at Euro 1988; designer Ina Franzmann was already working on a replacement when Franz Beckenbauer said: keep it. West Germany lifted the trophy in Italy under those blazing summer lights.</p>
${buildPullQuote("Sometimes the best decisions are the ones you almost didn't make.")}
</div></li>
</ol>
`,
  },
  {
    slug: S015,
    tags: [
      "messi-vs-ronaldo",
      "world-cup-stats",
      "lionel-messi-world-cup",
      "cristiano-ronaldo-world-cup",
      "messi-2022-world-cup",
      "world-cup-golden-ball",
      "world-cup-2026",
      "news",
    ],
    seo_title:
      "Messi vs Ronaldo World Cup Stats — Goals, Trophies & Final Scoreboard",
    seo_description:
      "Head-to-head World Cup numbers: Messi 13 goals, 8 assists, 1 trophy, 2 Golden Balls vs Ronaldo 8 goals, 5-tournament scoring streak. Sixth tournament for both in 2026.",
    emotion_type: "icons",
    hero_image: IMG_015_1,
    og_image: IMG_015_3,
    read_time_minutes: 7,
    takeaways: [
      "Messi: 26 WC matches, 13 goals, 8 assists, 21 goal involvements, 1 trophy (2022), 2 Golden Balls",
      "Ronaldo: 22 WC matches, 8 goals, 2 assists — only player to score in 5 straight World Cups",
      "2022 split the legacy: Messi won the final; Ronaldo was benched in knockouts and lost to Morocco",
      "Both heading to a record sixth World Cup in 2026 — possibly their last",
      "2014 Maracanã heartbreak vs 2022 coronation defines Messi&apos;s World Cup arc",
    ],
    lead: "The 2026 World Cup is about to begin, and somehow — impossibly — both Lionel Messi and Cristiano Ronaldo are still here. Sixth tournament. Fourth decade. Before the whistle blows, here&apos;s how the World Cup scoreboard actually shakes out.",
    faqs: [
      {
        question: "Who has more World Cup goals — Messi or Ronaldo?",
        answer:
          "Lionel Messi has 13 World Cup goals across six tournaments; Cristiano Ronaldo has 8. Messi also leads in assists (8 vs 2) and total goal involvements (21 vs 10).",
      },
      {
        question: "Has Ronaldo ever won the World Cup?",
        answer:
          "No. Ronaldo has reached the semifinals (2006) but never won the trophy. Messi won the 2022 World Cup with Argentina, scoring twice in the final against France.",
      },
      {
        question: "What World Cup record does Ronaldo hold over Messi?",
        answer:
          "Ronaldo is the only player to score in five consecutive World Cups (2006 through 2022). That streak is widely considered untouchable.",
      },
      {
        question: "How did Messi and Ronaldo perform at World Cup 2022?",
        answer:
          "Messi: 7 goals and 3 assists in 7 matches, Player of the Tournament, World Cup winner. Ronaldo: 1 goal in 5 matches, benched in the knockout rounds, eliminated by Morocco in the quarterfinals.",
      },
      {
        question: "Are Messi and Ronaldo playing World Cup 2026?",
        answer:
          "Yes — both are on their national squads for a record sixth World Cup appearance, likely their final tournament given their ages (Messi turns 39 during the tournament; Ronaldo is 41).",
      },
    ],
    sourceNote:
      "Statistics compiled from FIFA World Cup records and Tencent News editorial coverage (June 5, 2026).",
    buildBody: () => `
<figure class="article-image">${imgTag(IMG_015_1, "Messi and Ronaldo World Cup comparison")}</figure>
<h2>The Tale of the Tape</h2>
<table><thead><tr><th>Stat</th><th>Messi</th><th>Ronaldo</th></tr></thead><tbody>
<tr><td>Tournaments</td><td>6 (2006–2026)</td><td>6 (2006–2026)</td></tr>
<tr><td>Matches</td><td>26</td><td>22</td></tr>
<tr><td>Goals</td><td>13</td><td>8</td></tr>
<tr><td>Assists</td><td>8</td><td>2</td></tr>
<tr><td>Goal involvements</td><td><strong>21</strong></td><td>10</td></tr>
<tr><td>World Cup trophies</td><td><strong>1</strong> (2022)</td><td>0</td></tr>
<tr><td>World Cup Golden Balls</td><td><strong>2</strong></td><td>0</td></tr>
<tr><td>Unique record</td><td>—</td><td>Only player to score in 5 straight WCs</td></tr>
</tbody></table>
<h2>How We Got Here</h2>
<h3>2006 — The Origin Stories</h3>
<p>19-year-old Messi came off the bench for Argentina wearing #19, scored his first World Cup goal against Serbia &amp; Montenegro. 21-year-old Ronaldo rode alongside Portugal&apos;s golden generation, finished fourth. Two teenagers, same stage, completely different arrivals.</p>
<figure class="article-image">${imgTag(IMG_015_2, "Messi and Ronaldo early World Cup years")}</figure>
<h3>2010 — Reality Check</h3>
<p>Both were now the faces of their national teams. Messi went scoreless as Argentina got destroyed by Germany in the quarters. Ronaldo managed one goal before Spain knocked Portugal out.</p>
<h3>2014 — The One That Still Hurts</h3>
<p>Messi at the Maracanã, staring at the trophy he couldn&apos;t touch — four goals, one assist, Player of the Tournament, then Mario Götze in extra time. Ronaldo played through injury, one goal, Portugal out in the group stage.</p>
<h3>2018 — Peak Solo Drama</h3>
<p>Ronaldo&apos;s hat-trick against Spain — including that late free-kick — was the individual performance of the tournament. Messi scored to keep Argentina alive vs Nigeria; Mbappé&apos;s France sent both home in the round of 16.</p>
<figure class="article-image">${imgTag(IMG_015_3, "Messi lifting the World Cup trophy in 2022")}</figure>
<h3>2022 — The Coronation</h3>
<p>Messi: 7 matches, 7 goals, 3 assists. Two goals in the greatest final of all time. Won the shootout, lifted the trophy, removed the last asterisk from his legacy.</p>
<p>Ronaldo: 5 matches, 1 goal. Benched in the knockouts. Walked off in tears after losing to Morocco.</p>
<h2>The Verdict</h2>
${buildPullQuote("One got the fairy tale ending. One didn't. That's not an opinion — it's what happened.")}
<p>Ronaldo&apos;s record of scoring in five consecutive World Cups is genuinely untouchable. And here they both are in 2026, late thirties, possibly for the last time. The rivalry is over on the spreadsheet — but there&apos;s still one more chapter to write.</p>
`,
  },
  {
    slug: S016,
    tags: [
      "kylian-mbappe",
      "mbappe-girlfriend",
      "esther-exposito",
      "real-madrid-drama",
      "france-world-cup-2026",
      "world-cup-gossip",
      "bad-bunny-controversy",
      "news",
    ],
    seo_title:
      "Mbappé World Cup Drama: 40M Petition, Yacht Photos & Esther Expósito",
    seo_description:
      "France captain Kylian Mbappé faces a 40M-signature sell petition, tabloid obsession over Netflix star Esther Expósito, and a thigh injury weeks before World Cup 2026.",
    emotion_type: "secrets",
    hero_image: IMG_016_1,
    og_image: IMG_016_7,
    read_time_minutes: 6,
    takeaways: [
      "40 million signatures on a petition demanding Real Madrid sell Mbappé — more than Canada&apos;s population",
      "Mbappé spotted on a yacht with girlfriend Esther Expósito while nursing a thigh injury",
      "Esther Expósito (Elite, 24M Instagram followers) went public with Mbappé in March 2026",
      "Bad Bunny concert video sparked a viral &quot;cheating&quot; narrative — Expósito called out the misogyny",
      "France still enter WC2026 as favorites; Mbappé remains captain despite off-pitch chaos",
    ],
    lead: "Kylian Mbappé is 27, has a World Cup trophy, scored a hat-trick in a World Cup final, and captains France — and right now 40 million people signed a petition demanding Real Madrid sell him while the internet debates whether his actress girlfriend danced too close to Bad Bunny.",
    faqs: [
      {
        question: "Why do fans want Real Madrid to sell Kylian Mbappé?",
        answer:
          "A viral petition citing Madrid&apos;s Champions League exit and frustration after PSG won two UCL titles without him has collected roughly 40 million signatures. Critics blame Mbappé despite continued goal production.",
      },
      {
        question: "Who is Kylian Mbappé&apos;s girlfriend Esther Expósito?",
        answer:
          "Esther Expósito, 26, stars in Netflix&apos;s Elite and has about 24 million Instagram followers. She and Mbappé went public in March 2026 after months of dating rumors.",
      },
      {
        question: "What was the Bad Bunny controversy with Mbappé?",
        answer:
          "Video of Expósito dancing near Bad Bunny at a Madrid VIP concert sparked cheating allegations. Expósito responded that the outrage reflected misogyny and obsession with policing women&apos;s bodies, not actual infidelity.",
      },
      {
        question: "Is Mbappé injured before World Cup 2026?",
        answer:
          "Reports indicate Mbappé is managing a thigh injury and was advised to rest — paparazzi photos from a yacht break in the Balearic Islands fueled criticism about his commitment.",
      },
      {
        question: "Will Mbappé captain France at World Cup 2026?",
        answer:
          "Yes. Despite the off-pitch noise, Mbappé remains France&apos;s captain and talisman heading into the tournament as one of the favorites.",
      },
    ],
    sourceNote:
      "Tabloid and petition figures attributed to Yi Tu Sports / Tencent News coverage (June 5, 2026).",
    buildBody: () => `
<p>Welcome to being the most scrutinized athlete on earth.</p>
<figure class="article-image">${imgTag(IMG_016_1, "Kylian Mbappé in action for France")}</figure>
<h2>The Petition That Broke the Internet</h2>
<p>Since May, a petition calling for Mbappé&apos;s departure from Real Madrid has racked up <strong>40 million signatures</strong> — more people than the population of Canada.</p>
<p>He&apos;s still scoring. Still producing. But Madrid crashed out of the Champions League, PSG has since won two UCL titles <em>without</em> him, and somehow Mbappé became the scapegoat for both clubs.</p>
${buildPullQuote("The man who scored a hat-trick in a World Cup final is now being booed by his own former fanbase at trophy celebrations.")}
<figure class="article-image">${imgTag(IMG_016_4, "Online petition and fan backlash against Mbappé")}</figure>
<h2>The Yacht Photos</h2>
<p>Paparazzi caught Mbappé on a yacht off Spain&apos;s Balearic Islands — with Expósito, on jet skis, looking entirely unbothered.</p>
<figure class="article-image">${imgTag(IMG_016_7, "Mbappé on yacht with girlfriend")}</figure>
<p>Twitter decided he&apos;s &quot;not taking the World Cup seriously.&quot; For what it&apos;s worth, he&apos;s nursing a thigh injury and was advised to rest. Jet skis are probably not the recommended rehab protocol, but let the man live.</p>
<h2>Who Is Esther Expósito?</h2>
<figure class="article-image">${imgTag(IMG_016_9, "Esther Expósito actress from Elite")}</figure>
<p>Star of Netflix&apos;s <em>Elite</em> with <strong>24 million Instagram followers</strong>. Madrid-born, classically trained since age 13, fiercely private. She and Mbappé went public in March after months of rumors — never formally discussing the relationship, just showing up at dinners, matches, and yachts.</p>
<figure class="article-image">${imgTag(IMG_016_15, "Esther Expósito at airport")}</figure>
<h2>The Bad Bunny Controversy</h2>
<p>Video surfaced of Expósito at a Bad Bunny concert in Madrid — VIP area, dancing near the rapper. The internet screamed cheating scandal.</p>
<figure class="article-image">${imgTag(IMG_016_16, "Bad Bunny concert in Madrid")}</figure>
<p>Expósito&apos;s response was direct: the real problem wasn&apos;t &quot;two seconds of dancing&quot; but a culture obsessed with policing women&apos;s bodies under the guise of protecting male athletes. She was invited. She went. She had fun. End of story.</p>
<h2>The Stakes</h2>
<p>France enter the 2026 World Cup as one of the favorites. Mbappé is their captain, talisman, and best player — with a thigh injury, a mountain of public criticism, and every tabloid tracking his relationship like a royal wedding.</p>
<p>If France wins, none of this will matter. If they don&apos;t? Those 40 million signatures might start looking like an undercount.</p>
`,
  },
  {
    slug: S017,
    tags: [
      "france-world-cup-2026",
      "france-squad-value",
      "kylian-mbappe",
      "ousmane-dembele",
      "didier-deschamps",
      "world-cup-group-stage",
      "mbappe-vs-haaland",
      "news",
    ],
    seo_title:
      "France World Cup 2026 Squad Preview — $16.4B Roster, Group & Flaws",
    seo_description:
      "France&apos;s $16.4B World Cup 2026 squad is the most expensive ever — Griezmann cut, Mbappé vs Haaland on June 27. Deschamps&apos; real challenge: locker-room chemistry.",
    emotion_type: "hype",
    hero_image: IMG_017_1,
    og_image: IMG_017_2,
    read_time_minutes: 7,
    takeaways: [
      "France squad valued at $16.4B (€14.8B) — most expensive World Cup roster ever",
      "Antoine Griezmann, Eduardo Camavinga, Hugo Ekitike, and Randal Kolo Muani all left out",
      "Group I: Senegal (June 17), Iraq (June 23), Norway/Mbappé vs Haaland (June 27)",
      "Spine: Saliba + Upamecano, Tchouaméni + Kanté, Mbappé + Dembélé + Olise",
      "History says France&apos;s biggest opponent is internal chemistry — not talent",
    ],
    lead: "France&apos;s roster is absurd — $16.4 billion in squad value, Griezmann didn&apos;t make the cut, and the rejects would start for most nations. But history says France&apos;s biggest opponent wears the same jersey.",
    faqs: [
      {
        question: "What is France&apos;s World Cup 2026 squad value?",
        answer:
          "Editorial coverage cites a total squad valuation of approximately $16.4 billion (€14.8B) — described as the most expensive team ever assembled for a World Cup.",
      },
      {
        question: "Who did France leave out of the 2026 World Cup squad?",
        answer:
          "Notable omissions include Antoine Griezmann, Real Madrid&apos;s Eduardo Camavinga, PSG&apos;s Hugo Ekitike, and Spurs striker Randal Kolo Muani — players who would start for many other nations.",
      },
      {
        question: "Who is in France&apos;s World Cup 2026 group?",
        answer:
          "France are in Group I with Senegal (June 17), Iraq (June 23), and Norway (June 27). The Norway match features Mbappé vs Erling Haaland.",
      },
      {
        question: "What formation does Didier Deschamps use for France?",
        answer:
          "Deschamps typically runs a 4-2-3-1 built on defensive solidity and lightning counterattacks — Saliba and Upamecano at center back, Tchouaméni and Kanté in midfield, Mbappé, Dembélé, and Olise in attack.",
      },
      {
        question: "Why is France considered vulnerable despite their talent?",
        answer:
          "France have a history of locker-room infighting at major tournaments (Euro 2020 scandals, player cliques). Deschamps&apos; main job is managing egos; midfield depth is also thinner if Kanté or Tchouaméni gets injured.",
      },
    ],
    sourceNote:
      "Squad valuations and group schedule from The Green Pitch Watcher / Tencent News (June 5, 2026).",
    buildBody: () => `
<p>When your <em>rejects</em> would start for most nations, you&apos;re playing a different game.</p>
<figure class="article-image">${imgTag(IMG_017_1, "France national team squad photo")}</figure>
<h2>The Setup</h2>
<p>France landed in Group I alongside Senegal, Iraq, and Norway. Manager Didier Deschamps — World Cup winner as player (1998) and coach (2018) — runs a tight <strong>4-2-3-1</strong>:</p>
<ul>
<li><strong>CBs:</strong> William Saliba + Dayot Upamecano</li>
<li><strong>DMs:</strong> Aurélien Tchouaméni + N&apos;Golo Kanté</li>
<li><strong>AMs:</strong> Adrien Rabiot and Rayan Cherki</li>
<li><strong>Front three:</strong> Mbappé, Ousmane Dembélé (reigning Ballon d&apos;Or), Michael Olise</li>
</ul>
<figure class="article-image">${imgTag(IMG_017_2, "France tactical setup and key players")}</figure>
<h2>The Schedule</h2>
<table><thead><tr><th>Date</th><th>Opponent</th><th>The Storyline</th></tr></thead><tbody>
<tr><td>June 17</td><td><strong>Senegal</strong></td><td>Rematch of the 2002 opener when Senegal stunned France&apos;s golden generation</td></tr>
<tr><td>June 23</td><td><strong>Iraq</strong></td><td>Organized defense and sharp counters — France should cruise</td></tr>
<tr><td>June 27</td><td><strong>Norway</strong></td><td>Mbappé vs Haaland. Two of the three best players on earth.</td></tr>
</tbody></table>
${buildPullQuote("If Saliba isn't fit for the opener, Senegal has a real shot at an upset.")}
<figure class="article-image">${imgTag(IMG_017_3, "France World Cup 2026 group stage map")}</figure>
<h2>The Real Problem</h2>
<p>France&apos;s talent is never the question. It&apos;s the chemistry.</p>
<p>Infighting scandals at Euro 2020. Player cliques, leaked stories, mothers confronting each other in the stands — the full reality TV package. Deschamps&apos; job isn&apos;t really about tactics. It&apos;s about keeping 26 multi-millionaire egos pointed in the same direction.</p>
<figure class="article-image">${imgTag(IMG_017_4, "France squad depth chart")}</figure>
<p>The midfield is also thinner than it looks. If Kanté or Tchouaméni picks up an injury, the drop-off is significant — and there&apos;s no natural deep-lying playmaker in the squad.</p>
<h2>Prediction</h2>
<p>France should win this group — probably with 7 or even 9 points. They should reach the semifinals.</p>
<p>But &quot;should&quot; and &quot;France at a World Cup&quot; have a complicated relationship. The only opponent France can&apos;t out-talent is their own locker room.</p>
`,
  },
  {
    slug: S018,
    tags: [
      "neymar-injury",
      "brazil-world-cup-2026",
      "neymar-calf-tear",
      "carlo-ancelotti",
      "world-cup-injuries",
      "vinicius-jr",
      "brazil-group-c",
      "news",
    ],
    seo_title:
      "Neymar Calf Injury World Cup 2026 — Grade 2 Tear, Timeline & Last Dance",
    seo_description:
      "Brazil star Neymar has a grade 2 calf tear, 2–3 week recovery vs June 14 opener. 944 days since last Brazil cap. Fourth World Cup — likely his last.",
    emotion_type: "heartbreak",
    hero_image: IMG_018_1,
    og_image: IMG_018_5,
    read_time_minutes: 7,
    takeaways: [
      "Grade 2 right calf tear — ~50% of muscle fibers damaged; specialists cite 3–5 week recovery",
      "Brazil opens vs Morocco June 14 at MetLife Stadium — timeline is extremely tight",
      "944 days since Neymar last played for Brazil (October 2023)",
      "Santos allegedly downplayed a May 17 knock as &quot;edema&quot; before MRI revealed tear",
      "128 caps, 79 goals — Brazil&apos;s all-time top scorer, but now a wildcard not the engine",
    ],
    lead: "Brazil&apos;s medical report reads like a countdown nobody wants to watch: Neymar, 34, has a grade 2 muscle tear in his right calf. Recovery: 2–3 weeks. Brazil&apos;s first match: June 14 against Morocco. Do the math.",
    faqs: [
      {
        question: "What injury does Neymar have before World Cup 2026?",
        answer:
          "Brazil&apos;s medical staff reported a grade 2 tear in Neymar&apos;s right calf — roughly 50% of muscle fibers damaged. The team projected 2–3 weeks recovery; orthopedic specialists often cite 3–5 weeks for elite athletes.",
      },
      {
        question: "Will Neymar be fit for Brazil&apos;s World Cup opener?",
        answer:
          "It&apos;s tight. Brazil play Morocco on June 14, 2026 at MetLife Stadium in New Jersey. Even if cleared, Neymar is unlikely to be at full match fitness after a calf tear and nearly three years away from the national team.",
      },
      {
        question: "When did Neymar last play for Brazil?",
        answer:
          "Coverage cites October 2023 — roughly 944 days before the 2026 World Cup — as his last competitive minute for the Seleção, following ACL and meniscus surgery in a qualifier vs Uruguay.",
      },
      {
        question: "Is Neymar on Brazil&apos;s 2026 World Cup squad?",
        answer:
          "Yes. Carlo Ancelotti confirmed Neymar on the final 26-man roster despite fitness concerns, calling him central to tactical plans — though his role is now more creative wildcard than primary engine.",
      },
      {
        question: "What is Neymar&apos;s Brazil scoring record?",
        answer:
          "Neymar has 128 caps, 79 goals, and 59 assists for Brazil — the nation&apos;s all-time leading scorer, passing Pelé with a brace against Bolivia in September 2023.",
      },
    ],
    sourceNote:
      "Injury timeline and squad status from Xiao Yan Sports / Tencent News (June 4, 2026). Medical timelines are projections, not guarantees.",
    buildBody: () => `
<figure class="article-image">${imgTag(IMG_018_1, "Neymar injury update before World Cup 2026")}</figure>
<h2>Why the Timeline Is Optimistic at Best</h2>
<p>Dr. João Manoel Paulo Fonseca, an orthopedic specialist in São Paulo, explained: a grade 2 tear means <strong>roughly 50% of muscle fibers are damaged</strong>. For a top-level athlete, actual recovery is typically 3–5 weeks — not the 2–3 the team doctor projected.</p>
<p>Even if Neymar is cleared, he won&apos;t be at full capacity. You don&apos;t go from a torn calf to 90 minutes of World Cup knockout intensity in two weeks.</p>
${buildPullQuote("Neymar hasn't played a competitive minute for Brazil since October 2023. That's 944 days ago.")}
<figure class="article-image">${imgTag(IMG_018_2, "Neymar at Brazil national team training")}</figure>
<h2>The Cover-Up That Almost Worked</h2>
<p>On May 17, Neymar took a hit playing for Santos. The club diagnosed &quot;edema&quot; — just inflammation. Ten days later at national team camp, an MRI revealed a grade 2 tear.</p>
<p>Brazilian media report Santos downplayed the injury to avoid spooking Carlo Ancelotti, who&apos;d warned: &quot;I&apos;m only calling up players at 100% fitness.&quot; Ancelotti kept him anyway — but trust between club and country is fractured.</p>
<figure class="article-image">${imgTag(IMG_018_3, "Brazil World Cup 2026 host venues")}</figure>
<h2>The Weight of History</h2>
<table><thead><tr><th>Year</th><th>What Happened</th></tr></thead><tbody>
<tr><td><strong>2014</strong></td><td>Fractured vertebra vs Colombia. Missed the 7-1 semifinal disaster.</td></tr>
<tr><td><strong>2018</strong></td><td>Played. Brazil out in the quarters.</td></tr>
<tr><td><strong>2022</strong></td><td>Lost to Croatia on penalties in the quarters.</td></tr>
<tr><td><strong>2023</strong></td><td>Torn ACL + meniscus vs Uruguay. Surgery. 944 days out.</td></tr>
</tbody></table>
<figure class="article-image">${imgTag(IMG_018_4, "Neymar 2014 World Cup back injury")}</figure>
<h2>What Brazil Actually Needs From Him</h2>
<p><strong>128 caps, 79 goals, 59 assists.</strong> Brazil&apos;s all-time leading scorer — ahead of Pelé.</p>
<p>But Neymar at 34, coming off a calf tear, after nearly three years away, is not the Neymar of 2014. Brazil&apos;s attack runs through Vinícius Jr. and Rodrygo. Neymar&apos;s role: creativity in tight spaces, set pieces, moments of magic.</p>
<p>He&apos;s not Brazil&apos;s engine anymore. He&apos;s their wildcard. And wildcards don&apos;t work if they&apos;re not on the pitch.</p>
<figure class="article-image">${imgTag(IMG_018_5, "Neymar with Brazil squad")}</figure>
<h2>The Group C Reality Check</h2>
<p>Brazil opens against <strong>Morocco</strong> — 2022 semifinalists. If Neymar misses that one, pressure shifts to Haiti (June 20) and Scotland (June 25).</p>
<figure class="article-image">${imgTag(IMG_018_6, "Morocco national team at World Cup")}</figure>
<p>Ancelotti has said Neymar is in the plans. The medical staff gave the optimistic timeline. The roster slot is reserved.</p>
<p>Now it&apos;s just whether a 34-year-old body with a 50% torn muscle, three years of rust, and the weight of a nation can deliver one more time. If this is really his last dance, Brazil better hope he shows up for it.</p>
`,
  },
];

export function buildEnrichedContentBatch014018(
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
