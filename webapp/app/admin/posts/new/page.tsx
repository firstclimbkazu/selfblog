import { prisma } from "@/lib/prisma";
import { createArticle } from "../../actions";
import ArticleForm from "../../components/ArticleForm";
import Link from "next/link";

export const metadata = { title: "新規記事作成 — Still On The Wall" };

export default async function NewPostPage() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--sotw-text)] tracking-tight mb-1">
          新規記事作成
        </h1>
        <Link href="/admin/posts" className="text-sm text-[var(--sotw-text-2)] hover:text-[var(--sotw-moss)]">
          ← 記事一覧へ
        </Link>
      </div>

      <ArticleForm
        action={createArticle}
        categories={categories}
        tags={tags}
      />
    </div>
  );
}
