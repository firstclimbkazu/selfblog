"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { articleSlug, ensureUniqueSlug } from "@/lib/slug";
import { resolvePublishedAt } from "@/lib/article";

function parseFeaturedOrder(raw: FormDataEntryValue | null): number | null {
  if (!raw) return null;
  const n = Number(raw);
  return n === 1 || n === 2 || n === 3 ? n : null;
}

export async function createArticle(formData: FormData) {
  const title = (formData.get("title") as string).trim();
  const body = (formData.get("body") as string).trim();
  const categoryId = formData.get("categoryId") as string | null;
  const tagIds = formData.getAll("tagIds") as string[];
  const thumbnailUrl = (formData.get("thumbnailUrl") as string) || null;
  const featuredOrder = parseFeaturedOrder(formData.get("featuredOrder"));
  const publish = formData.get("intent") === "publish";

  const existing = await prisma.article.findMany({ select: { slug: true } });
  const slug = ensureUniqueSlug(
    articleSlug(title),
    existing.map((a) => a.slug)
  );

  await prisma.$transaction(async (tx) => {
    if (featuredOrder !== null) {
      await tx.article.updateMany({
        where: { featuredOrder },
        data: { featuredOrder: null },
      });
    }

    await tx.article.create({
      data: {
        title,
        slug,
        body,
        thumbnailUrl,
        featuredOrder,
        categoryId: categoryId || null,
        status: publish ? "PUBLISHED" : "DRAFT",
        publishedAt: publish ? new Date() : null,
        articleTags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
    });
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
  const featuredOrder = parseFeaturedOrder(formData.get("featuredOrder"));
  const publish = formData.get("intent") === "publish";

  const current = await prisma.article.findUnique({ where: { id } });
  if (!current) throw new Error("Article not found");

  const newStatus = publish ? "PUBLISHED" : "DRAFT";
  const publishedAt = resolvePublishedAt(publish, current.publishedAt);

  await prisma.$transaction(async (tx) => {
    await tx.articleTag.deleteMany({ where: { articleId: id } });

    if (featuredOrder !== null) {
      await tx.article.updateMany({
        where: { featuredOrder, NOT: { id } },
        data: { featuredOrder: null },
      });
    }

    await tx.article.update({
      where: { id },
      data: {
        title,
        body,
        thumbnailUrl,
        featuredOrder,
        categoryId: categoryId || null,
        status: newStatus,
        publishedAt,
        articleTags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
    });
  });

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
