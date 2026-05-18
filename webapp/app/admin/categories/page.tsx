import { prisma } from "@/lib/prisma";
import CategoriesManager from "./CategoriesManager";

export const metadata = { title: "カテゴリ管理 — Still On The Wall" };

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articles: true } } },
  });
  return <CategoriesManager categories={categories} />;
}
