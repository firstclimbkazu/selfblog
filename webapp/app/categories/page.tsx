import { prisma } from "@/lib/prisma";
import CategoryList from "./CategoryList";

export const dynamic = "force-dynamic";
export const metadata = { title: "カテゴリ一覧 — Still On The Wall" };

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { articles: { where: { status: "PUBLISHED" } } },
      },
    },
  });
  return <CategoryList categories={categories} />;
}
