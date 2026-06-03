import { prisma } from "@/lib/prisma";
import ArticleCard from "./components/ArticleCard";

export default async function LatestArticles() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
  });

  return (
    <section>
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[var(--sotw-text)] tracking-tight mb-2">
          最新記事
        </h1>
        <div className="h-0.5 w-8 bg-[var(--sotw-moss)]" />
      </div>

      {articles.length === 0 ? (
        <p className="text-[var(--sotw-text-2)]">記事がまだありません。</p>
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
