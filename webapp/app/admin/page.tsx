import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AdminDashboard from "./components/AdminDashboard";

export const metadata = { title: "管理画面 — Still On The Wall" };

export default async function AdminPage() {
  const session = await auth();
  const [publishedCount, draftCount] = await Promise.all([
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "DRAFT" } }),
  ]);
  return (
    <AdminDashboard
      email={session?.user?.email}
      publishedCount={publishedCount}
      draftCount={draftCount}
    />
  );
}
