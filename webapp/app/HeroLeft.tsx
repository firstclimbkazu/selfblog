import Link from "next/link";
import Image from "next/image";

type Props = {
  article: {
    title: string;
    slug: string;
    publishedAt: Date | null;
    thumbnailUrl: string | null;
    category: { name: string; slug: string } | null;
  };
};

export default function HeroLeft({ article }: Props) {
  return (
    <Link
      href={`/posts/${article.slug}`}
      className="group flex flex-col bg-[var(--sotw-surface)] border border-[var(--sotw-border)] rounded-lg overflow-hidden hover:border-[var(--sotw-moss)] transition-colors h-full"
    >
      {article.thumbnailUrl && (
        <div className="relative w-full flex-1 min-h-0 bg-[var(--sotw-surface-alt)]">
          <Image
            src={article.thumbnailUrl}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="flex flex-col gap-2 p-5 flex-shrink-0">
        <div className="flex items-center gap-3">
          {article.category && (
            <span className="text-xs font-medium text-[var(--sotw-moss)] bg-[var(--sotw-moss-bg)] px-2 py-0.5 rounded">
              {article.category.name}
            </span>
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

        <h2 className="text-lg md:text-xl font-bold text-[var(--sotw-text)] group-hover:text-[var(--sotw-moss)] transition-colors leading-snug line-clamp-2">
          {article.title}
        </h2>

        <span className="mt-1 text-sm text-[var(--sotw-moss)] group-hover:underline">
          続きを読む →
        </span>
      </div>
    </Link>
  );
}
