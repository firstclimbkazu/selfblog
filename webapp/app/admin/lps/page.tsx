import { prisma } from "@/lib/prisma";
import LpsTable from "./LpsTable";

export const metadata = { title: "LP管理 — Still On The Wall" };

export default async function AdminLpsPage() {
  const lps = await prisma.landingPage.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return <LpsTable lps={lps} />;
}
