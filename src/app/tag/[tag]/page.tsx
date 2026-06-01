import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MasonryFeed } from "@/components/feed/MasonryFeed";
import { getPostsByTag, getTagLabel } from "@/lib/data/tags";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
} from "@/lib/seo/structured-data";
import { getSiteUrl } from "@/lib/utils";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const label = getTagLabel(tag);
  const url = `${getSiteUrl()}/tag/${tag}`;
  const description = `${label} football stories — World Cup gossip, drama and culture, hand-picked for new fans on LurkFeed Football.`;

  return {
    title: `${label} — Football Stories`,
    description,
    keywords: [label, "World Cup 2026", "football", "football culture"],
    alternates: { canonical: url },
    openGraph: {
      title: `${label} — Football Stories`,
      description,
      url,
      type: "website",
      siteName: "LurkFeed Football",
    },
    twitter: {
      card: "summary_large_image",
      title: `${label} — Football Stories`,
      description,
    },
    robots: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  if (!posts.length) notFound();

  const label = getTagLabel(tag);
  const base = getSiteUrl();
  const url = `${base}/tag/${tag}`;

  const breadcrumb = buildBreadcrumbSchema([
    { name: "Home", url: `${base}/` },
    { name: label, url },
  ]);
  const itemList = buildItemListSchema(posts, {
    name: `${label} — LurkFeed Football`,
    url,
    description: `${label} football stories on LurkFeed Football.`,
  });

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-3 pt-4 md:px-4">
        <section className="mb-5 px-1">
          <p className="text-xs font-medium uppercase tracking-wide text-teal-700">
            Tag
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-stone-900">{label}</h1>
          <p className="mt-1 text-sm text-stone-500">{posts.length} stories</p>
        </section>
        <MasonryFeed initialPosts={posts} />
      </div>
    </main>
  );
}
