import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "../components/DeleteButton";

export const metadata = { title: "記事管理 — Still On The Wall" };

export default async function AdminPostsPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1610] tracking-tight mb-1">
            記事管理
          </h1>
          <Link href="/admin" className="text-sm text-[#6B5E52] hover:text-[#2D6B52]">
            ← ダッシュボードへ
          </Link>
        </div>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-[#2D6B52] text-white rounded-lg text-sm hover:bg-[#245840] transition-colors"
        >
          新規作成
        </Link>
      </div>

      <div className="bg-white border border-[#E8E2DA] rounded-lg overflow-hidden">
        {articles.length === 0 ? (
          <p className="px-6 py-8 text-[#6B5E52]">記事がまだありません。</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F9F7F4] border-b border-[#E8E2DA]">
              <tr>
                <th className="text-left px-4 py-3 text-[#6B5E52] font-medium">タイトル</th>
                <th className="text-left px-4 py-3 text-[#6B5E52] font-medium">カテゴリ</th>
                <th className="text-left px-4 py-3 text-[#6B5E52] font-medium">状態</th>
                <th className="text-left px-4 py-3 text-[#6B5E52] font-medium">公開日</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {articles.map((article, i) => (
                <tr
                  key={article.id}
                  className={i % 2 === 0 ? "" : "bg-[#FAFAF9]"}
                >
                  <td className="px-4 py-3 text-[#1E1610] font-medium max-w-xs truncate">
                    {article.title}
                  </td>
                  <td className="px-4 py-3 text-[#6B5E52]">
                    {article.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-xs px-2 py-0.5 rounded font-medium ${
                        article.status === "PUBLISHED"
                          ? "bg-[#E8F0EC] text-[#2D6B52]"
                          : "bg-[#F0EDE8] text-[#6B5E52]"
                      }`}
                    >
                      {article.status === "PUBLISHED" ? "公開" : "下書き"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6B5E52]">
                    {article.publishedAt
                      ? article.publishedAt.toLocaleDateString("ja-JP")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-4 whitespace-nowrap">
                    <Link
                      href={`/admin/posts/${article.id}/edit`}
                      className="text-xs text-[#2D6B52] hover:underline"
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
