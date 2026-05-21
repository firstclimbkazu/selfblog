"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { taxonomySlug, ensureUniqueSlug } from "@/lib/slug";
import { removeLpFiles } from "@/lib/lp-storage";

type LpStatusValue = "DRAFT" | "PUBLISHED";

function readForm(formData: FormData) {
  const title = ((formData.get("title") as string) || "").trim();
  const slugInput = ((formData.get("slug") as string) || "").trim();
  const html = (formData.get("html") as string) ?? "";
  const css = (formData.get("css") as string) || null;
  const js = (formData.get("js") as string) || null;
  const headHtml = (formData.get("headHtml") as string) || null;
  const metaTitle = ((formData.get("metaTitle") as string) || "").trim() || null;
  const metaDescription =
    ((formData.get("metaDescription") as string) || "").trim() || null;
  const metaOgImage =
    ((formData.get("metaOgImage") as string) || "").trim() || null;
  const status = (formData.get("status") as LpStatusValue) || "DRAFT";

  return {
    title,
    slugInput,
    html,
    css,
    js,
    headHtml,
    metaTitle,
    metaDescription,
    metaOgImage,
    status,
  };
}

export async function createLp(formData: FormData) {
  const data = readForm(formData);

  if (!data.title) throw new Error("title は必須です");
  if (!data.html) throw new Error("html は必須です");

  const existing = await prisma.landingPage.findMany({ select: { slug: true } });
  const base = data.slugInput
    ? taxonomySlug(data.slugInput)
    : taxonomySlug(data.title);
  const slug = ensureUniqueSlug(
    base,
    existing.map((l) => l.slug)
  );

  const lp = await prisma.landingPage.create({
    data: {
      title: data.title,
      slug,
      html: data.html,
      css: data.css,
      js: data.js,
      headHtml: data.headHtml,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      metaOgImage: data.metaOgImage,
      status: data.status,
    },
  });

  revalidatePath("/admin/lps");
  revalidatePath(`/lp/${lp.slug}`);
  redirect(`/admin/lps/${lp.id}/edit`);
}

export async function updateLp(id: string, formData: FormData) {
  const data = readForm(formData);

  if (!data.title) throw new Error("title は必須です");
  if (!data.html) throw new Error("html は必須です");

  const current = await prisma.landingPage.findUnique({ where: { id } });
  if (!current) throw new Error("LP が見つかりません");

  let slug = current.slug;
  if (data.slugInput && data.slugInput !== current.slug) {
    const existing = await prisma.landingPage.findMany({
      where: { NOT: { id } },
      select: { slug: true },
    });
    slug = ensureUniqueSlug(
      taxonomySlug(data.slugInput),
      existing.map((l) => l.slug)
    );
  }

  await prisma.landingPage.update({
    where: { id },
    data: {
      title: data.title,
      slug,
      html: data.html,
      css: data.css,
      js: data.js,
      headHtml: data.headHtml,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      metaOgImage: data.metaOgImage,
      status: data.status,
    },
  });

  revalidatePath("/admin/lps");
  revalidatePath(`/lp/${current.slug}`);
  if (slug !== current.slug) revalidatePath(`/lp/${slug}`);
}

export async function deleteLp(id: string) {
  const lp = await prisma.landingPage.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!lp) throw new Error("LP が見つかりません");

  const urls = lp.images.map((img) => img.publicUrl);

  await prisma.landingPage.delete({ where: { id } });

  await removeLpFiles(urls);

  revalidatePath("/admin/lps");
  revalidatePath(`/lp/${lp.slug}`);
}

export async function addLpImage(
  lpId: string,
  payload: { publicUrl: string; fileName: string; fileSize: number | null }
) {
  const lp = await prisma.landingPage.findUnique({ where: { id: lpId } });
  if (!lp) throw new Error("LP が見つかりません");

  const image = await prisma.lpImage.create({
    data: {
      lpId,
      publicUrl: payload.publicUrl,
      fileName: payload.fileName,
      fileSize: payload.fileSize,
    },
  });

  revalidatePath(`/admin/lps/${lpId}/edit`);
  return {
    id: image.id,
    publicUrl: image.publicUrl,
    fileName: image.fileName,
    fileSize: image.fileSize,
    createdAt: image.createdAt.toISOString(),
  };
}

export async function deleteLpImage(imageId: string) {
  const image = await prisma.lpImage.findUnique({ where: { id: imageId } });
  if (!image) throw new Error("画像が見つかりません");

  await prisma.lpImage.delete({ where: { id: imageId } });
  await removeLpFiles([image.publicUrl]);

  revalidatePath(`/admin/lps/${image.lpId}/edit`);
}
