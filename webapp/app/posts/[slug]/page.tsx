import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { prisma } from "@/lib/prisma";

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

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-[var(--sotw-text-2)] hover:text-[var(--sotw-moss)] transition-colors mb-8"
      >
        ← 一覧へ戻る
      </Link>

      <article>
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {article.category && (
              <Link
                href={`/categories/${article.category.slug}`}
                className="text-xs font-medium text-[var(--sotw-moss)] bg-[var(--sotw-moss-bg)] px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
              >
                {article.category.name}
              </Link>
            )}
            {article.publishedAt && (
              <time
                dateTime={article.publishedAt.toISOString()}
                className="text-xs text-[var(--sotw-text-2)]"
              >
                {article.publishedAt.toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>

          <h1 className="text-3xl font-bold text-[var(--sotw-text)] tracking-tight mb-4">
            {article.title}
          </h1>

          {article.articleTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.articleTags.map(({ tag }) => (
                <Link
                  key={tag.id}
                  href={`/tags/${tag.slug}`}
                  className="text-xs text-[var(--sotw-text-2)] bg-[var(--sotw-surface-alt)] border border-[var(--sotw-border)] px-2 py-0.5 rounded hover:border-[var(--sotw-moss)] transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          <div className="h-px bg-[var(--sotw-border)] mt-6" />
        </header>

        <div className="prose prose-stone max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.body}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
