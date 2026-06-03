import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Props = {
  currentSlug: string | null;
};

export default async function CategoryFilterTabs({ currentSlug }: Props) {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { name: true, slug: true },
  });

  const tabs = [
    { name: "すべて", slug: null, href: "/" },
    ...categories.map((c) => ({
      name: c.name,
      slug: c.slug,
      href: `/?category=${encodeURIComponent(c.slug)}`,
    })),
  ];

  return (
    <nav aria-label="カテゴリフィルタ" className="mb-6">
      <ul className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.slug === currentSlug;
          return (
            <li key={tab.slug ?? "all"}>
              <Link
                href={tab.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "inline-flex items-center h-8 px-3.5 rounded-full text-sm font-medium bg-[var(--sotw-moss)] text-white"
                    : "inline-flex items-center h-8 px-3.5 rounded-full text-sm bg-[var(--sotw-surface-alt)] text-[var(--sotw-text-2)] border border-[var(--sotw-border)] hover:border-[var(--sotw-moss)] hover:text-[var(--sotw-moss)] transition-colors"
                }
              >
                {tab.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
