import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ContentLayout } from "@/components/layout/ContentLayout";
import { ArticleView } from "@/components/article/ArticleView";
import {
  getPostBySlug,
  getRelatedPosts,
  getPublishedPosts,
  getTrendingPostsRecent,
} from "@/lib/data/posts";
import { buildPostMetadata } from "@/lib/seo/metadata";
import { buildStoryGraph, buildBreadcrumbSchema } from "@/lib/seo/structured-data";
import { sanitizeHtml } from "@/lib/sanitize-html";
import { fixContentImageUrls } from "@/lib/media/resolve-image";
import { getSiteUrl } from "@/lib/utils";
import { getTagLabel } from "@/lib/data/tag-definitions";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { getAllSlugs } = await import("@/lib/data/posts");
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not found" };
  return buildPostMetadata(post);
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const safePost = {
    ...post,
    content: sanitizeHtml(fixContentImageUrls(post.content, post.slug)),
  };

  const [related, all, trending] = await Promise.all([
    getRelatedPosts(post, 4),
    getPublishedPosts(50),
    getTrendingPostsRecent(3, 10),
  ]);

  const idx = all.findIndex((p) => p.id === post.id);
  const nextPost = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : all[0];

  // GEO bundle: Article + (optional) FAQPage + Key Takeaways ItemList +
  // Person/SportsTeam entities, computed against the SANITIZED body.
  const storyGraph = buildStoryGraph(safePost);

  // Breadcrumb: Home → primary tag (if any) → article. Helps both classic SERP
  // and AI engines understand site hierarchy.
  const base = getSiteUrl();
  const primaryTag = post.tags[0];
  const breadcrumb = buildBreadcrumbSchema(
    [
      { name: "Home", url: `${base}/` },
      ...(primaryTag
        ? [{ name: getTagLabel(primaryTag), url: `${base}/tag/${primaryTag}` }]
        : []),
      { name: post.title, url: `${base}/story/${post.slug}` },
    ]
  );

  return (
    <>
      {storyGraph.map((block, i) => (
        <script
          key={`schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <SiteHeader />
      <ContentLayout trending={trending}>
        <ArticleView post={safePost} related={related} nextPost={nextPost} />
      </ContentLayout>
    </>
  );
}
