import { prisma } from "@/lib/prisma";
import ArticleCard from "./components/ArticleCard";
import CategoryFilterTabs from "./CategoryFilterTabs";
import Pagination from "./Pagination";

const PER_PAGE = 6;

type Props = {
  categorySlug: string | null;
  page: number;
};

export default async function LatestArticles({ categorySlug, page }: Props) {
  const where = {
    status: "PUBLISHED" as const,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  };

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      include: { category: true },
      take: PER_PAGE,
      skip: (page - 1) * PER_PAGE,
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  function buildHref(targetPage: number): string {
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (targetPage > 1) params.set("page", String(targetPage));
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  }

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
        <ul aria-label="最新記事リスト" className="space-y-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </ul>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        buildHref={buildHref}
      />
    </section>
  );
}
