import Link from "next/link";
import type { Prisma } from "@prisma/client";
import DeleteButton from "../components/DeleteButton";

type ArticleWithCategory = Prisma.ArticleGetPayload<{
  include: { category: true };
}>;

type Props = {
  articles: ArticleWithCategory[];
};

export default function PostsTable({ articles }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sotw-text)] tracking-tight mb-1">
            記事管理
          </h1>
          <Link href="/admin" className="text-sm text-[var(--sotw-text-2)] hover:text-[var(--sotw-moss)]">
            ← ダッシュボードへ
          </Link>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-[var(--sotw-moss)] text-white rounded-lg text-sm hover:bg-[var(--sotw-moss-hover)] transition-colors"
        >
          新規作成
        </Link>
      </div>

      <div className="bg-[var(--sotw-surface)] border border-[var(--sotw-border)] rounded-lg overflow-hidden">
        {articles.length === 0 ? (
          <p className="px-6 py-8 text-[var(--sotw-text-2)]">記事がまだありません。</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[var(--sotw-bg)] border-b border-[var(--sotw-border)]">
              <tr>
                <th className="text-left px-4 py-3 text-[var(--sotw-text-2)] font-medium">タイトル</th>
                <th className="text-left px-4 py-3 text-[var(--sotw-text-2)] font-medium">カテゴリ</th>
                <th className="text-left px-4 py-3 text-[var(--sotw-text-2)] font-medium">状態</th>
                <th className="text-left px-4 py-3 text-[var(--sotw-text-2)] font-medium">公開日</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {articles.map((article, i) => (
                <tr key={article.id} className={i % 2 === 0 ? "" : "bg-[var(--sotw-surface-alt)]"}>
                  <td className="px-4 py-3 text-[var(--sotw-text)] font-medium max-w-xs truncate">
                    {article.title}
                  </td>
                  <td className="px-4 py-3 text-[var(--sotw-text-2)]">
                    {article.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${
                        article.status === "PUBLISHED"
                          ? "bg-[var(--sotw-moss-bg)] text-[var(--sotw-moss)]"
                          : "bg-[var(--sotw-surface-alt)] text-[var(--sotw-text-2)]"
                      }`}
                    >
                      {article.status === "PUBLISHED" ? "公開" : "下書き"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--sotw-text-2)]">
                    {article.publishedAt ? article.publishedAt.toLocaleDateString("ja-JP") : "—"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-4 whitespace-nowrap">
                    <Link
                      href={`/admin/posts/${article.id}/edit`}
                      className="text-xs text-[var(--sotw-moss)] hover:underline"
                    >
                      編集
                    </Link>
                    <DeleteButton id={article.id} title={article.title} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
