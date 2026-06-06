import {
  assembleKcContent,
  buildPullQuote,
  imgTag,
} from "./kc-article-blocks";
import { newsImageUrl } from "./news-images";
import type { NewsArticleEnrichment } from "./news-article-enrichments";

const S019 = "mbappe-real-madrid-greatest-messi-ronaldo";

const IMG_019_1 = newsImageUrl(S019, "019-img-1.webp");
const IMG_019_2 = newsImageUrl(S019, "019-img-2.webp");
const IMG_019_3 = newsImageUrl(S019, "019-img-3.webp");

export const NEWS_ARTICLE_ENRICHMENTS_019: NewsArticleEnrichment[] = [
  {
    slug: S019,
    tags: [
      "kylian-mbappe",
      "real-madrid",
      "messi-vs-ronaldo",
      "lionel-messi",
      "cristiano-ronaldo",
      "world-cup-2026",
      "france-world-cup",
      "sorare-interview",
      "goat-debate",
      "news",
    ],
    seo_title:
      "Mbappé on Real Madrid GOAT Status & Messi vs Ronaldo — Sorare Interview",
    seo_description:
      "Kylian Mbappé says Real Madrid is the world's greatest club, calls Messi and Ronaldo 'completely opposite,' and shuts down the talent-vs-work debate. Pre-World Cup 2026 Sorare interview.",
    emotion_type: "icons",
    hero_image: IMG_019_1,
    og_image: IMG_019_2,
    read_time_minutes: 5,
    takeaways: [
      "Mbappé: Real Madrid is the greatest club on earth — 'maybe except for Barça fans, the whole world agrees'",
      "He played with Messi at PSG and against Ronaldo in the UCL — calls them 'completely opposite' styles",
      "Torches the talent-vs-hard-work labels: 'only someone who has never played football would say that'",
      "Refuses to pick Messi or Ronaldo as GOAT — describes left vs right foot, agility vs explosiveness without naming either",
      "Interview drops eight days before World Cup 2026 as Mbappé leads France as consensus best player on the planet",
    ],
    lead: "Kylian Mbappé sat down with Sorare ahead of the 2026 World Cup and said the quiet part loud — on Real Madrid, on Messi, on Ronaldo, and on every take you&apos;ve ever read on football Twitter.",
    faqs: [
      {
        question: "What did Mbappé say about Real Madrid being the greatest club?",
        answer:
          "In a Sorare pre-World Cup interview, Mbappé said playing for Real Madrid is 'exactly what you imagine' and that 'except for Barça fans, the whole world agrees this is the greatest club on the planet.' He called Madrid the global 'reference point' in football history.",
      },
      {
        question: "What is Mbappé's take on Messi vs Ronaldo?",
        answer:
          "Mbappé said he played with Messi at PSG (2021–2023) and against Ronaldo in the Champions League. He described them as 'completely different' and 'completely opposite' — left foot vs right foot, agility vs direct explosiveness — but deliberately did not name which description applied to which player.",
      },
      {
        question: "What did Mbappé say about talent vs hard work in the GOAT debate?",
        answer:
          "He rejected the fan narrative that Ronaldo is pure effort and Messi is pure talent, calling it something 'only someone who has never played football would say.' He argued both have extraordinary talent and work ethic if you have ever worn boots and trained every day.",
      },
      {
        question: "When did Mbappé give this interview?",
        answer:
          "Coverage cites a Sorare interview published ahead of the 2026 World Cup, roughly eight days before kickoff, on June 6, 2026 — with Mbappé preparing to lead France at the tournament.",
      },
      {
        question: "Has Mbappé won the World Cup before?",
        answer:
          "Yes. Mbappé won the 2018 World Cup with France at age 19 in Russia, scoring in the final. He enters World Cup 2026 as France captain and one of the tournament favorites.",
      },
    ],
    sourceNote:
      "Quotes and interview summary attributed to Nian Zhou / Tencent Football coverage of Mbappé&apos;s Sorare interview (June 6, 2026).",
    buildBody: () => `
<p>Buckle up.</p>
<figure class="article-image">${imgTag(IMG_019_1, "Kylian Mbappé speaking in Sorare pre-World Cup interview")}</figure>
<h2>&quot;Every Person on Earth Knows — Except Barça Fans&quot;</h2>
<p>When asked about what it&apos;s like playing for Real Madrid, Mbappé didn&apos;t really pause:</p>
${buildPullQuote("I think it's exactly what you imagine. Because you imagine that, maybe except for Barça fans, the whole world agrees this is the greatest club on the planet.")}
<p>Look, the man plays for Real Madrid. You can&apos;t exactly expect him to say anything else. But the way he said it — casual, matter-of-fact, almost like he was explaining gravity — is extremely on brand for someone who grew up idolizing the club and then actually signed for them.</p>
<p>He followed it up:</p>
${buildPullQuote("Barcelona shaped football history in one way, but Real Madrid is that landmark club — the reference point for the whole world.")}
<p>He then added that he wants to leave his mark on Madrid&apos;s history, because doing that means leaving a mark on football history itself. Twenty-six years old. Already writing legacy narratives.</p>
<h2>The Messi vs Ronaldo Take That Actually Slaps</h2>
<p>Mbappé is one of the very few people on earth who has genuinely <strong>played with Messi</strong> (PSG, 2021–2023) and <strong>played against Ronaldo</strong> (Champions League). That makes his opinion on the greatest debate in sports history worth something more than a Twitter poll.</p>
<figure class="article-image">${imgTag(IMG_019_2, "Messi and Ronaldo — the GOAT debate Mbappé refuses to settle")}</figure>
<p>Here&apos;s what he said:</p>
${buildPullQuote("I played with Messi and against Ronaldo. Ronaldo is my idol, but I also played alongside Messi. And because I've been on the pitch with both of them, I can tell you — they are completely different. Completely opposite. Left foot vs right foot, height, style — one is more agile, one is more direct, more explosive. And the other has a bigger picture view of the game.")}
<p>No names assigned to which description. Very intentional. Very Mbappé.</p>
<h2>He Absolutely Torched the &quot;Talent vs Hard Work&quot; Debate</h2>
<p>This is the part that&apos;s going viral for a reason.</p>
<p>For years, fans have been slapping labels on Messi and Ronaldo: <em>Ronaldo is a grinder, Messi is pure God-given talent.</em> It&apos;s everywhere — documentaries, YouTube comments, bar arguments. Mbappé is tired of it.</p>
${buildPullQuote("Saying one of them relies on effort and the other on talent — that's something only someone who has never played football would say. If you can tell me Ronaldo has no talent or Messi has no work ethic, then you've never put on boots and trained every single day.")}
<p>Then he called it &quot;from the heart.&quot;</p>
<p>And honestly? Hard to argue. Ronaldo&apos;s VO2 max is off the charts — that&apos;s not just discipline, that&apos;s genetics. And anyone who watched Messi arrive at 4 AM for extra sessions in Barcelona&apos;s youth academy knows the effort argument cuts both ways.</p>
<figure class="article-image">${imgTag(IMG_019_3, "Mbappé in action for France ahead of World Cup 2026")}</figure>
<h2>Why This Interview Hits Different Right Now</h2>
<p>The World Cup kicks off in <strong>eight days</strong>. Mbappé just led France through qualifying, is fresh off a quiet but effective Real Madrid season, and is the consensus pick for the best player on the planet right now.</p>
<p>He&apos;s walking into this tournament with the weight of France&apos;s expectations, a €16.8 billion squad behind him, and the kind of quiet confidence that only comes from someone who already has a World Cup winner&apos;s medal — at 19, in Russia 2018.</p>
<p>For a guy who&apos;s usually reserved in interviews, this was unusually candid. Almost like he&apos;s ready to say whatever he wants because the football is about to do the talking.</p>
<p>Eight days, Kylian. Let&apos;s go.</p>
`,
  },
];

export function buildEnrichedContentBatch019(
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
