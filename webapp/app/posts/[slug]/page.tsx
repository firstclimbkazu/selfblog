import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostView from "./PostView";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({ where: { slug } });
  if (!article) return {};

  const description = article.body.replace(/[#*`\[\]]/g, "").slice(0, 120);
  const url = `/posts/${slug}`;
  const images = article.thumbnailUrl
    ? [{ url: article.thumbnailUrl, width: 1200, height: 630 }]
    : [{ url: "/og-default.png", width: 1200, height: 630 }];

  return {
    title: article.title,
    description,
    openGraph: {
      type: "article",
      url,
      title: article.title,
      description,
      images,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: images.map((i) => i.url),
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      articleTags: { include: { tag: true } },
    },
  });
  if (!article || article.status !== "PUBLISHED") notFound();
  return <PostView article={article} />;
}
