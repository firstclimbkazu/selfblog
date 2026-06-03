import { prisma } from "@/lib/prisma";
import ArticleCard from "./components/ArticleCard";
import CategoryFilterTabs from "./CategoryFilterTabs";

type Props = {
  categorySlug: string | null;
};

export default async function LatestArticles({ categorySlug }: Props) {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <section>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--sotw-text)] tracking-tight mb-2">
          最新記事
        </h1>
        <div className="h-0.5 w-8 bg-[var(--sotw-moss)]" />
      </div>

      <CategoryFilterTabs currentSlug={categorySlug} />

      {articles.length === 0 ? (
        <p className="text-[var(--sotw-text-2)]">該当する記事がありません。</p>
      ) : (
        <ul className="space-y-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </ul>
      )}
    </section>
  );
}
