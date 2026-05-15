import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata = { title: "タグ一覧 — Still On The Wall" };

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          articleTags: {
            where: { article: { status: "PUBLISHED" } },
          },
        },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[var(--sotw-text)] tracking-tight mb-2">
          タグ一覧
        </h1>
        <div className="h-0.5 w-8 bg-[var(--sotw-moss)]" />
      </div>

      <div className="flex flex-wrap gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.id}
            href={`/tags/${tag.slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--sotw-surface)] border border-[var(--sotw-border)] rounded-full text-sm text-[var(--sotw-text-2)] hover:border-[var(--sotw-moss)] hover:text-[var(--sotw-moss)] transition-colors"
          >
            <span>#{tag.name}</span>
            <span className="text-xs text-[var(--sotw-text-3)]">
              {tag._count.articleTags}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
