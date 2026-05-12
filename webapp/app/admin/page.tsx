import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "管理画面 — Still On The Wall" };

export default async function AdminPage() {
  const session = await auth();
  const publishedCount = await prisma.article.count({ where: { status: "PUBLISHED" } });
  const draftCount = await prisma.article.count({ where: { status: "DRAFT" } });

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-[#1E1610] tracking-tight mb-1">
            管理画面
          </h1>
          <p className="text-sm text-[#6B5E52]">{session?.user?.email}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="px-4 py-2 text-sm border border-[#E8E2DA] rounded-lg text-[#6B5E52] hover:border-[#2D6B52] hover:text-[#2D6B52] transition-colors"
          >
            ログアウト
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="p-6 bg-white border border-[#E8E2DA] rounded-lg">
          <p className="text-sm text-[#6B5E52] mb-1">公開済み記事</p>
          <p className="text-3xl font-bold text-[#1E1610]">{publishedCount}</p>
        </div>
        <div className="p-6 bg-white border border-[#E8E2DA] rounded-lg">
          <p className="text-sm text-[#6B5E52] mb-1">下書き</p>
          <p className="text-3xl font-bold text-[#1E1610]">{draftCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/posts"
          className="px-6 py-3 bg-[#2D6B52] text-white rounded-lg text-sm hover:bg-[#245840] transition-colors"
        >
          記事を管理する
        </Link>
        <Link
          href="/admin/categories"
          className="px-6 py-3 border border-[#E8E2DA] rounded-lg text-sm text-[#6B5E52] hover:border-[#2D6B52] hover:text-[#2D6B52] transition-colors"
        >
          カテゴリを管理する
        </Link>
        <Link
          href="/admin/tags"
          className="px-6 py-3 border border-[#E8E2DA] rounded-lg text-sm text-[#6B5E52] hover:border-[#2D6B52] hover:text-[#2D6B52] transition-colors"
        >
          タグを管理する
        </Link>
      </div>
    </div>
  );
}
