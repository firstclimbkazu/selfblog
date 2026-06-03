import Link from "next/link";
import Image from "next/image";

type Props = {
  article: {
    id: string;
    title: string;
    slug: string;
    publishedAt: Date | null;
    thumbnailUrl: string | null;
    category: { name: string; slug: string } | null;
  };
};

export default function ArticleCard({ article }: Props) {
  return (
    <li>
      <Link
        href={`/posts/${article.slug}`}
        className="flex gap-4 group p-5 bg-[var(--sotw-surface)] border border-[var(--sotw-border)] rounded-lg hover:border-[var(--sotw-moss)] transition-colors"
      >
        {/* サムネイル */}
        <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden bg-[var(--sotw-surface-alt)]">
          {article.thumbnailUrl ? (
            <Image
              src={article.thumbnailUrl}
              alt={article.title}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-5 h-5 bg-[var(--sotw-moss-bg)] rounded-sm" />
            </div>
          )}
        </div>

        {/* テキスト */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
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
          <h2 className="text-base font-bold text-[var(--sotw-text)] group-hover:text-[var(--sotw-moss)] transition-colors leading-snug line-clamp-2">
            {article.title}
          </h2>
        </div>
      </Link>
    </li>
  );
}
