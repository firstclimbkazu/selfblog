import { prisma } from "@/lib/prisma";
import TagsManager from "./TagsManager";

export const metadata = { title: "タグ管理 — Still On The Wall" };

export default async function AdminTagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { articleTags: true } } },
  });
  return <TagsManager tags={tags} />;
}
