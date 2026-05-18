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
  return { title: `${article.title} — Still On The Wall` };
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
