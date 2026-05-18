import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateTag } from "../../../taxonomy-actions";
import EditTagForm from "./EditTagForm";

type Props = { params: Promise<{ id: string }> };

export const metadata = { title: "タグ編集 — Still On The Wall" };

export default async function EditTagPage({ params }: Props) {
  const { id } = await params;
  const tag = await prisma.tag.findUnique({ where: { id } });
  if (!tag) notFound();
  return <EditTagForm tag={tag} action={updateTag.bind(null, id)} />;
}
