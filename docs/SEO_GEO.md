# SEO + GEO Architecture

> **Goal**: maximize discoverability on both classic search (Google / Bing) and
> generative answer engines (ChatGPT search, Perplexity, Google AI Overviews,
> Bing Copilot, Claude search), so that when someone asks an AI "who's
> favourite for the 2026 Golden Boot?" or "explain offside simply", an
> answer that **cites football.lurkfeed.com** is produced.

This doc captures the full system. If you're adding a new page type or
schema block, start here.

---

## Layered architecture

```
┌─────────────────────────────────────────────────────────┐
│ 1. CONTENT LAYER (KC v3 HTML)                            │
│   - .takeaways, .faq-section, .pull-quote, .ranked-list  │
│   - meta keywords / og:image / article:section           │
│   - JSON-LD inside imported file (we re-emit our own)    │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼  parse-html.ts → DB
┌─────────────────────────────────────────────────────────┐
│ 2. EXTRACTION LAYER (extract-geo.ts)                      │
│   - extractFaqPairs(html)         → Q&A array             │
│   - extractTakeaways(html)        → bullet array          │
│   - extractRankedItems(html)      → listicle entities     │
│   - extractMentionedPeople(html, tags) → Person + sameAs  │
│   - extractMentionedTeams(tags)   → SportsTeam + sameAs   │
│   - detectArticleType(tags, cat)  → Article variant       │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼  rendered at request time
┌─────────────────────────────────────────────────────────┐
│ 3. SCHEMA FACTORY (structured-data.ts)                    │
│   - buildOrganizationSchema()                             │
│   - buildWebSiteSchema()           with SearchAction      │
│   - buildArticleSchema(post)       NewsArticle / Opinion  │
│                                    / Analysis / Review    │
│   - buildFaqSchema(post)           FAQPage (auto-skip <2) │
│   - buildKeyTakeawaysSchema(post)  ItemList               │
│   - buildEntitySchemas(post)       Person + SportsTeam    │
│   - buildBreadcrumbSchema(crumbs)                         │
│   - buildItemListSchema(posts, …)  collection pages       │
│   - buildStoryGraph(post)          full story bundle      │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼  injected via dangerouslySetInnerHTML
┌─────────────────────────────────────────────────────────┐
│ 4. PAGES                                                  │
│   /                  → Org + WebSite + ItemList + Breadcrumb│
│   /story/[slug]      → Article + FAQ + Takeaways + Persons │
│                        + Teams + Breadcrumb + Org + WebSite│
│   /tag/[slug]        → Org + WebSite + ItemList + Breadcrumb│
│   /robots.txt        → AI-crawler allowlist                │
│   /sitemap.xml       → real lastmod + hot-score priority   │
│   /llms.txt          → curated index for LLM crawlers      │
│   /feed.xml          → RSS for delta-update crawlers       │
└─────────────────────────────────────────────────────────┘
```

---

## Per-page schema inventory

| Page | Schemas emitted | Why |
|---|---|---|
| Root layout (every page) | Organization, WebSite+SearchAction | Anchor entity graph for AI. SearchAction enables Google sitelinks searchbox. |
| `/` | + ItemList(latest 10), BreadcrumbList | Tells Google the homepage is a curated feed. AI engines treat this as the canonical "what's on this site". |
| `/story/[slug]` | + Article variant, FAQPage*, ItemList(takeaways)*, Person×N, SportsTeam×N, BreadcrumbList | The big one. Full GEO bundle per article. * = only when content has the data. |
| `/tag/[slug]` | + ItemList(all posts in tag), BreadcrumbList | Helps AI engines understand topical clusters. |
| `/robots.txt` | — | Explicit allowlist for 22 named AI/LLM crawlers + classic search. |
| `/sitemap.xml` | — | Real publish/edit timestamps. Top 25% of articles by hot score get priority 0.9 + daily; bottom 25% get 0.5 + monthly. |
| `/llms.txt` | — | Plain-Markdown curated site index per [llmstxt.org](https://llmstxt.org). |
| `/feed.xml` | — | RSS 2.0 for Bytespider / Applebot / news aggregators. |

---

## Article variants (`detectArticleType`)

KC's category system is mapped onto schema.org news subtypes for
slightly better citation rates:

| KC category / tag | Schema type |
|---|---|
| `prediction` / `odds` / `analysis` | `AnalysisNewsArticle` |
| `opinion` / `debate` / `controversial` | `OpinionNewsArticle` |
| `review` / `rating-controversy` | `ReviewNewsArticle` |
| `news` / `transfer` / `breaking` / `trending` | `NewsArticle` |
| anything else | `Article` |

This is a **soft hint**; classic SERP behavior is identical across these,
but Google AI Overviews and Perplexity tend to surface "Analysis" /
"Opinion" articles in editorial-question contexts more often.

---

## Player knowledge base

`extract-geo.ts` ships a hard-coded `PLAYER_KB` mapping the KC tag
vocabulary onto canonical Wikipedia + Wikidata URLs. This is the
**most under-rated GEO lever**: an LLM crawler that sees
`{"@type":"Person","name":"Kylian Mbappé","sameAs":["…wiki…"]}` immediately
knows our article is about the same entity Wikipedia / ESPN have records
for, and is much more likely to cite us when a user asks about that
player.

Adding a new player:
1. Open `src/lib/seo/extract-geo.ts`.
2. Add an entry to `PLAYER_KB`. Wikipedia URL is required, Wikidata is
   strongly recommended (it's the actual entity ID across Google's
   Knowledge Graph).

The `COUNTRY_KB` works the same way for `SportsTeam` entities.

---

## What KC v3 does for us automatically

Every article generated by the `football-content-factory` skill ships
with:

- ✅ `<meta name="keywords">` → our `tags`
- ✅ `<meta name="article:section">` → our emotion mapping
- ✅ `<meta property="og:image">` → our `hero_image`
- ✅ `.article-lead` → our `intro_hook` (and the `speakable` selector)
- ✅ `.takeaways ul li` → ItemList schema (auto-extracted)
- ✅ `.faq-section .faq-item` → FAQPage schema (auto-extracted)
- ✅ Player names mentioned in body → Person + sameAs schema (matched
   against `PLAYER_KB`)

So the GEO loop is: **write a KC v3 article → save it via the importer →
visit the page → 6–13 JSON-LD blocks render automatically**.

---

## Verifying live

Quick smoke tests after deploy:

```bash
# 1. Count JSON-LD blocks on a story page (should be ≥ 8)
curl -s https://football.lurkfeed.com/story/wc2026-golden-boot-odds \
  | grep -c 'application/ld+json'

# 2. Confirm robots.txt lists GPTBot
curl -s https://football.lurkfeed.com/robots.txt | grep GPTBot

# 3. Validate Article schema with Google's Rich Results test
open "https://search.google.com/test/rich-results?url=https://football.lurkfeed.com/story/wc2026-golden-boot-odds"

# 4. Validate sitemap with Google Search Console / Bing Webmaster
```

Recommended monitoring once you have GA4:

- **Brand mentions in AI answers**: search "site:perplexity.ai
  lurkfeed", "site:chat.openai.com" etc. for citation samples.
- **Console FAQ rich results**: GSC → Enhancements → FAQs.
- **Console SearchAction**: GSC → Sitelinks searchbox.
- **GA4 referrers from `chat.openai.com`, `perplexity.ai`,
  `claude.ai`, `you.com`, `bing.com/copilot`** — these are AI-engine
  click-throughs.

---

## Next-tier optimizations (not yet shipped)

When traffic justifies the work:

1. **Per-author Person schema** — once we have human bylines we can
   replace the Organization-as-author with real `Person` entities + their
   social `sameAs`.
2. **`HowTo` schema** for explainer-type articles (e.g. "how does the
   World Cup format work").
3. **`SportsEvent` schema** for individual matches once we cover them
   live.
4. **Review aggregators** — if/when player ratings articles take off,
   `AggregateRating` blocks bump CTR.
5. **`speakable` more granular** — currently we declare `.article-lead`
   and `.takeaways`. Adding `.faq-item h3` would help voice surfaces
   read FAQ questions out loud.
