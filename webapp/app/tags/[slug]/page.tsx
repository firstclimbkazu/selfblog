import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import ArticleCard from "@/app/components/ArticleCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug } });
  if (!tag) return {};
  return { title: `#${tag.name} — Still On The Wall` };
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params;

  const tag = await prisma.tag.findUnique({
    where: { slug },
    include: {
      articleTags: {
        include: {
          article: {
            include: { category: true },
          },
        },
        where: { article: { status: "PUBLISHED" } },
        orderBy: { article: { publishedAt: "desc" } },
      },
    },
  });

  if (!tag) notFound();

  const articles = tag.articleTags.map((at) => at.article);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-sm text-[var(--sotw-text-2)] mb-1">タグ</p>
        <h1 className="text-2xl font-bold text-[var(--sotw-text)] tracking-tight mb-2">
          #{tag.name}
        </h1>
        <div className="h-0.5 w-8 bg-[var(--sotw-moss)]" />
      </div>

      {articles.length === 0 ? (
        <p className="text-[var(--sotw-text-2)]">このタグの記事はまだありません。</p>
      ) : (
        <ul className="space-y-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </ul>
      )}
    </div>
  );
}
