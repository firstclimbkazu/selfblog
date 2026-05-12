import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createTag, deleteTag } from "../taxonomy-actions";
import InlineDeleteButton from "../components/InlineDeleteButton";

export const metadata = { title: "タグ管理 — Still On The Wall" };

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articleTags: true } } },
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E1610] tracking-tight mb-1">
          タグ管理
        </h1>
        <Link href="/admin" className="text-sm text-[#6B5E52] hover:text-[#2D6B52]">
          ← ダッシュボードへ
        </Link>
      </div>

      {/* 新規作成フォーム */}
      <div className="bg-white border border-[#E8E2DA] rounded-lg p-5 mb-8">
        <h2 className="text-sm font-medium text-[#1E1610] mb-3">新しいタグを追加</h2>
        <form action={createTag} className="flex gap-3">
          <input
            name="name"
            type="text"
            required
            placeholder="タグ名"
            className="flex-1 px-3 py-2 border border-[#E8E2DA] rounded-lg text-sm text-[#1E1610] focus:outline-none focus:border-[#2D6B52]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#2D6B52] text-white rounded-lg text-sm hover:bg-[#245840] transition-colors"
          >
            追加
          </button>
        </form>
      </div>

      {/* 一覧 */}
      <div className="bg-white border border-[#E8E2DA] rounded-lg overflow-hidden">
        {tags.length === 0 ? (
          <p className="px-5 py-6 text-sm text-[#6B5E52]">タグがまだありません。</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-[#F9F7F4] border-b border-[#E8E2DA]">
              <tr>
                <th className="text-left px-4 py-3 text-[#6B5E52] font-medium">タグ名</th>
                <th className="text-left px-4 py-3 text-[#6B5E52] font-medium">slug</th>
                <th className="text-left px-4 py-3 text-[#6B5E52] font-medium">記事数</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {tags.map((tag, i) => (
                <tr key={tag.id} className={i % 2 === 0 ? "" : "bg-[#FAFAF9]"}>
                  <td className="px-4 py-3 font-medium text-[#1E1610]">#{tag.name}</td>
                  <td className="px-4 py-3 text-[#6B5E52] font-mono text-xs">{tag.slug}</td>
                  <td className="px-4 py-3 text-[#6B5E52]">{tag._count.articleTags}</td>
                  <td className="px-4 py-3 text-right space-x-4 whitespace-nowrap">
                    <Link
                      href={`/admin/tags/${tag.id}/edit`}
                      className="text-xs text-[#2D6B52] hover:underline"
                    >
                      編集
                    </Link>
                    <InlineDeleteButton
                      label={tag.name}
                      action={deleteTag.bind(null, tag.id)}
                    />
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
