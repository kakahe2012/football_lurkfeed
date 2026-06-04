import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ContentLayout } from "@/components/layout/ContentLayout";
import { AdSlot } from "@/components/ads/AdSlot";
import { MasonryFeed } from "@/components/feed/MasonryFeed";
import { getPublishedPosts, getTrendingPostsRecent } from "@/lib/data/posts";
import {
  buildItemListSchema,
  buildBreadcrumbSchema,
} from "@/lib/seo/structured-data";
import { getSiteUrl } from "@/lib/utils";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "LurkFeed Football — Football. The fun parts.",
  description:
    "World Cup gossip, drama and culture for new fans. Stories, players, fashion, memes — the messy magic of football, no jargon required.",
  keywords: [
    "World Cup 2026",
    "football gossip",
    "football culture",
    "World Cup stories",
    "football for new fans",
    "World Cup drama",
    "football memes",
    "football fashion",
  ],
  alternates: { canonical: getSiteUrl() },
  openGraph: {
    title: "LurkFeed Football — Football. The fun parts.",
    description:
      "World Cup gossip, drama and culture for new fans. Built for stories, not stats.",
    type: "website",
    siteName: "LurkFeed Football",
  },
  twitter: {
    card: "summary_large_image",
    title: "LurkFeed Football — Football. The fun parts.",
    description:
      "World Cup gossip, drama and culture — built for new fans.",
  },
  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
  },
};

export default async function HomePage() {
  const [posts, trending] = await Promise.all([
    getPublishedPosts(12),
    getTrendingPostsRecent(3, 10),
  ]);

  // Front-page CollectionPage schema: tells Google + AI engines that the
  // homepage is an editorial feed of N current stories. Combined with the
  // Organization + WebSite schema in the root layout, this gives crawlers
  // a clean entity graph to start from.
  const base = getSiteUrl();
  const itemList = buildItemListSchema(posts.slice(0, 12), {
    name: "Latest Football Stories — LurkFeed Football",
    url: base,
    description:
      "Hand-picked World Cup gossip, drama and culture stories for new fans.",
  });
  const breadcrumb = buildBreadcrumbSchema([{ name: "Home", url: `${base}/` }]);

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <SiteHeader />
      <ContentLayout trending={trending}>
        <section className="mb-5 px-1">
          <p className="text-sm leading-relaxed text-stone-500">
            Your World Cup gossip, drama & culture corner — built for new fans.
          </p>
          <h1 className="mt-2 text-xl font-semibold leading-snug text-stone-900 md:text-2xl">
            Football. The fun parts.
          </h1>
        </section>
        <MasonryFeed initialPosts={posts} />
      </ContentLayout>
      <AdSlot placement="sticky" />
    </main>
  );
}
