import Link from "next/link";
import type { Prisma } from "@prisma/client";

type CategoryWithCount = Prisma.CategoryGetPayload<{
  include: { _count: { select: { articles: true } } };
}>;

type Props = {
  categories: CategoryWithCount[];
};

export default function CategoryList({ categories }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[var(--sotw-text)] tracking-tight mb-2">
          カテゴリ一覧
        </h1>
        <div className="h-0.5 w-8 bg-[var(--sotw-moss)]" />
      </div>

      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/categories/${category.slug}`}
              className="flex items-center justify-between p-5 bg-[var(--sotw-surface)] border border-[var(--sotw-border)] rounded-lg hover:border-[var(--sotw-moss)] transition-colors group"
            >
              <span className="font-medium text-[var(--sotw-text)] group-hover:text-[var(--sotw-moss)] transition-colors">
                {category.name}
              </span>
              <span className="text-sm text-[var(--sotw-text-2)]">{category._count.articles}件</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
