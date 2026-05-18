import { prisma } from "@/lib/prisma";
import PostsTable from "./PostsTable";

export const metadata = { title: "記事管理 — Still On The Wall" };

export default async function AdminPostsPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
  return <PostsTable articles={articles} />;
}
