"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { articleSlug, ensureUniqueSlug } from "@/lib/slug";
import { resolvePublishedAt } from "@/lib/article";

export async function createArticle(formData: FormData) {
  const title = (formData.get("title") as string).trim();
  const body = (formData.get("body") as string).trim();
  const categoryId = formData.get("categoryId") as string | null;
  const tagIds = formData.getAll("tagIds") as string[];
  const thumbnailUrl = (formData.get("thumbnailUrl") as string) || null;
  const publish = formData.get("intent") === "publish";

  const existing = await prisma.article.findMany({ select: { slug: true } });
  const slug = ensureUniqueSlug(
    articleSlug(title),
    existing.map((a) => a.slug)
  );

  const article = await prisma.article.create({
    data: {
      title,
      slug,
      body,
      thumbnailUrl,
      categoryId: categoryId || null,
      status: publish ? "PUBLISHED" : "DRAFT",
      publishedAt: publish ? new Date() : null,
      articleTags: {
        create: tagIds.map((tagId) => ({ tagId })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/posts");
  redirect(`/admin/posts`);
}

export async function updateArticle(id: string, formData: FormData) {
  const title = (formData.get("title") as string).trim();
  const body = (formData.get("body") as string).trim();
  const categoryId = formData.get("categoryId") as string | null;
  const tagIds = formData.getAll("tagIds") as string[];
  const thumbnailUrl = (formData.get("thumbnailUrl") as string) || null;
  const publish = formData.get("intent") === "publish";

  const current = await prisma.article.findUnique({ where: { id } });
  if (!current) throw new Error("Article not found");

  const newStatus = publish ? "PUBLISHED" : "DRAFT";
  const publishedAt = resolvePublishedAt(publish, current.publishedAt);

  await prisma.$transaction([
    prisma.articleTag.deleteMany({ where: { articleId: id } }),
    prisma.article.update({
      where: { id },
      data: {
        title,
        body,
        thumbnailUrl,
        categoryId: categoryId || null,
        status: newStatus,
        publishedAt,
        articleTags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
    }),
  ]);

  revalidatePath("/");
  revalidatePath(`/posts/${current.slug}`);
  revalidatePath("/admin/posts");
  redirect(`/admin/posts`);
}

export async function deleteArticle(id: string) {
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) throw new Error("Article not found");

  await prisma.article.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath(`/posts/${article.slug}`);
  revalidatePath("/admin/posts");
}
