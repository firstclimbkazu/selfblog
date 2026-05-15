import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const url = process.env.DATABASE_URL ?? "";
  // URLのホスト部分だけ表示（パスワード非表示）
  try {
    const parsed = new URL(url);
    console.log("DB host:", parsed.hostname);
    console.log("DB port:", parsed.port);
    console.log("DB name:", parsed.pathname);
  } catch {
    console.log("DB URL parse error");
  }

  const adapter = new PrismaPg({ connectionString: url });
  const prisma = new PrismaClient({ adapter });

  try {
    const count = await prisma.article.count();
    console.log("article count:", count);
  } catch (e) {
    console.error("DB query error:", e);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
