import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateCategory } from "../../../taxonomy-actions";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "カテゴリ編集 — Still On The Wall" };

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  const update = updateCategory.bind(null, id);

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E1610] tracking-tight mb-1">
          カテゴリ編集
        </h1>
        <Link href="/admin/categories" className="text-sm text-[#6B5E52] hover:text-[#2D6B52]">
          ← カテゴリ一覧へ
        </Link>
      </div>

      <div className="bg-white border border-[#E8E2DA] rounded-lg p-6">
        <form action={update} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1E1610] mb-1">
              カテゴリ名
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={category.name}
              className="w-full px-3 py-2 border border-[#E8E2DA] rounded-lg text-[#1E1610] focus:outline-none focus:border-[#2D6B52]"
            />
          </div>
          <div>
            <p className="text-xs text-[#6B5E52]">
              現在の slug: <span className="font-mono">{category.slug}</span>
              　（名前変更時は自動更新されます）
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-[#2D6B52] text-white rounded-lg text-sm hover:bg-[#245840] transition-colors"
            >
              保存
            </button>
            <Link
              href="/admin/categories"
              className="px-5 py-2 border border-[#E8E2DA] rounded-lg text-sm text-[#6B5E52] hover:border-[#2D6B52] transition-colors"
            >
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
