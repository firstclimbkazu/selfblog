import Link from "next/link";
import type { Prisma } from "@prisma/client";
import PostHeader from "./PostHeader";
import PostBody from "./PostBody";

type Props = {
  article: Prisma.ArticleGetPayload<{
    include: {
      category: true;
      articleTags: { include: { tag: true } };
    };
  }>;
};

export default function PostView({ article }: Props) {
  const tags = article.articleTags.map(({ tag }) => tag);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-[var(--sotw-text-2)] hover:text-[var(--sotw-moss)] transition-colors mb-8"
      >
        ← 一覧へ戻る
      </Link>

      <article>
        <PostHeader
          title={article.title}
          category={article.category}
          publishedAt={article.publishedAt}
          tags={tags}
        />
        <PostBody body={article.body} />
      </article>
    </div>
  );
}
