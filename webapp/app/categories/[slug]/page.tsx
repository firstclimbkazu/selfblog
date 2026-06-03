import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import ArticleCard from "@/app/components/ArticleCard";
import Pagination from "@/app/Pagination";

const PER_PAGE = 6;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

function parsePage(raw: string | undefined): number {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return {};
  return { title: `${category.name} — Still On The Wall` };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;
  const currentPage = parsePage(page);

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const where = { status: "PUBLISHED" as const, categoryId: category.id };

  const [articles, totalCount] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      include: { category: true },
      take: PER_PAGE,
      skip: (currentPage - 1) * PER_PAGE,
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE));

  function buildHref(targetPage: number): string {
    return targetPage > 1
      ? `/categories/${slug}?page=${targetPage}`
      : `/categories/${slug}`;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="text-sm text-[var(--sotw-text-2)] mb-1">カテゴリ</p>
        <h1 className="text-2xl font-bold text-[var(--sotw-text)] tracking-tight mb-2">
          {category.name}
        </h1>
        <div className="h-0.5 w-8 bg-[var(--sotw-moss)]" />
      </div>

      {articles.length === 0 ? (
        <p className="text-[var(--sotw-text-2)]">このカテゴリの記事はまだありません。</p>
      ) : (
        <ul aria-label="記事リスト" className="space-y-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </ul>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildHref={buildHref}
      />
    </div>
  );
}
