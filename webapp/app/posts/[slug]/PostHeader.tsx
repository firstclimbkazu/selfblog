import Link from "next/link";

type Props = {
  title: string;
  category: { name: string; slug: string } | null;
  publishedAt: Date | null;
  tags: { id: string; name: string; slug: string }[];
};

export default function PostHeader({ title, category, publishedAt, tags }: Props) {
  return (
    <header className="mb-8">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {category && (
          <Link
            href={`/categories/${category.slug}`}
            className="text-xs font-medium text-[var(--sotw-moss)] bg-[var(--sotw-moss-bg)] px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
          >
            {category.name}
          </Link>
        )}
        {publishedAt && (
          <time
            dateTime={publishedAt.toISOString()}
            className="text-xs text-[var(--sotw-text-2)]"
          >
            {publishedAt.toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
      </div>

      <h1 className="text-3xl font-bold text-[var(--sotw-text)] tracking-tight mb-4">
        {title}
      </h1>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
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
  );
}
