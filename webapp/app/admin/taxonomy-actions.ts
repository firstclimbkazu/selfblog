"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { taxonomySlug } from "@/lib/slug";

async function uniqueSlug(
  base: string,
  model: "category" | "tag",
  excludeId?: string
): Promise<string> {
  let slug = base;
  let i = 2;
  while (true) {
    const existing =
      model === "category"
        ? await prisma.category.findUnique({ where: { slug } })
        : await prisma.tag.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    slug = `${base}-${i++}`;
  }
  return slug;
}

// ── Category ──────────────────────────────────────────────

export async function createCategory(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const slug = await uniqueSlug(taxonomySlug(name), "category");
  await prisma.category.create({ data: { name, slug } });
  revalidatePath("/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const current = await prisma.category.findUnique({ where: { id } });
  if (!current) throw new Error("Category not found");
  const slug = await uniqueSlug(taxonomySlug(name), "category", id);
  await prisma.category.update({ where: { id }, data: { name, slug } });
  revalidatePath("/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/categories");
}

// ── Tag ───────────────────────────────────────────────────

export async function createTag(formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const slug = await uniqueSlug(taxonomySlug(name), "tag");
  await prisma.tag.create({ data: { name, slug } });
  revalidatePath("/tags");
  redirect("/admin/tags");
}

export async function updateTag(id: string, formData: FormData) {
  const name = (formData.get("name") as string).trim();
  const current = await prisma.tag.findUnique({ where: { id } });
  if (!current) throw new Error("Tag not found");
  const slug = await uniqueSlug(taxonomySlug(name), "tag", id);
  await prisma.tag.update({ where: { id }, data: { name, slug } });
  revalidatePath("/tags");
  redirect("/admin/tags");
}

export async function deleteTag(id: string) {
  await prisma.tag.delete({ where: { id } });
  revalidatePath("/tags");
}
