import { prisma } from "@/lib/prisma";
import TagList from "./TagList";

export const dynamic = "force-dynamic";
export const metadata = { title: "タグ一覧 — Still On The Wall" };

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { articleTags: { where: { article: { status: "PUBLISHED" } } } },
      },
    },
  });
  return <TagList tags={tags} />;
}
