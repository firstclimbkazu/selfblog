import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const articles = await prisma.article.count();
  const categories = await prisma.category.count();
  const tags = await prisma.tag.count();

  console.log("articles:", articles);
  console.log("categories:", categories);
  console.log("tags:", tags);

  await prisma.$disconnect();
}

main().catch(console.error);
