import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateArticle } from "../../../actions";
import ArticleForm from "../../../components/ArticleForm";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "記事編集 — Still On The Wall" };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;

  const [article, categories, tags] = await Promise.all([
    prisma.article.findUnique({
      where: { id },
      include: { articleTags: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!article) notFound();

  const updateWithId = updateArticle.bind(null, id);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1E1610] tracking-tight mb-1">
          記事編集
        </h1>
        <Link href="/admin/posts" className="text-sm text-[#6B5E52] hover:text-[#2D6B52]">
          ← 記事一覧へ
        </Link>
      </div>

      <ArticleForm
        action={updateWithId}
        categories={categories}
        tags={tags}
        defaultValues={{
          title: article.title,
          body: article.body,
          categoryId: article.categoryId,
          tagIds: article.articleTags.map((at) => at.tagId),
          thumbnailUrl: article.thumbnailUrl,
        }}
      />
    </div>
  );
}
