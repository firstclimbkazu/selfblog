import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import ArticleCard from "@/app/components/ArticleCard";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return { title: `${category.name} — Still On The Wall` };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      articles: {
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: { category: true },
      },
    },
  });

  if (!category) notFound();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-sm text-[var(--sotw-text-2)] mb-1">カテゴリ</p>
        <h1 className="text-2xl font-bold text-[var(--sotw-text)] tracking-tight mb-2">
          {category.name}
        </h1>
        <div className="h-0.5 w-8 bg-[var(--sotw-moss)]" />
      </div>

      {category.articles.length === 0 ? (
        <p className="text-[var(--sotw-text-2)]">このカテゴリの記事はまだありません。</p>
      ) : (
        <ul className="space-y-6">
          {category.articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </ul>
      )}
    </div>
  );
}
