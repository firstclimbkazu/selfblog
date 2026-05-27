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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function PostView({ article }: Props) {
  const tags = article.articleTags.map(({ tag }) => tag);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.body.replace(/[#*`\[\]]/g, "").slice(0, 120),
    url: `${SITE_URL}/posts/${article.slug}`,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    image: article.thumbnailUrl ?? `${SITE_URL}/og-default.png`,
    author: {
      "@type": "Person",
      name: "firstclimbkazu",
      url: `${SITE_URL}/profile`,
    },
    publisher: {
      "@type": "Organization",
      name: "Still On The Wall",
      url: SITE_URL,
    },
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
