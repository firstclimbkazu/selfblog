import Link from "next/link";
import Image from "next/image";

type HeroArticle = {
  id: string;
  title: string;
  slug: string;
  publishedAt: Date | null;
  thumbnailUrl: string | null;
  category: { name: string; slug: string } | null;
};

type Props = {
  articles: HeroArticle[];
};

export default function HeroRight({ articles }: Props) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/posts/${article.slug}`}
          className="group flex gap-4 bg-[var(--sotw-surface)] border border-[var(--sotw-border)] rounded-lg overflow-hidden hover:border-[var(--sotw-moss)] transition-colors flex-1 p-4"
        >
          <div className="relative w-32 h-full flex-shrink-0 rounded overflow-hidden bg-[var(--sotw-surface-alt)]">
            {article.thumbnailUrl ? (
              <Image
                src={article.thumbnailUrl}
                alt={article.title}
                fill
                sizes="160px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-6 h-6 bg-[var(--sotw-moss-bg)] rounded" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div className="flex items-center gap-2">
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
            <h3 className="text-sm md:text-base font-bold text-[var(--sotw-text)] group-hover:text-[var(--sotw-moss)] transition-colors leading-snug line-clamp-2">
              {article.title}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
