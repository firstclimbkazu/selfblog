import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCategory } from "../../../taxonomy-actions";
import EditCategoryForm from "./EditCategoryForm";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "カテゴリ編集 — Still On The Wall" };

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();
  return <EditCategoryForm category={category} action={updateCategory.bind(null, id)} />;
}
