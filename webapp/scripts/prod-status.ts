import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const articles = await prisma.article.findMany({
    select: { title: true, status: true, publishedAt: true, slug: true },
    orderBy: { createdAt: "desc" },
  });

  for (const a of articles) {
    console.log(`[${a.status}] ${a.title} (${a.slug})`);
  }

  const categories = await prisma.category.findMany({ select: { name: true, slug: true } });
  console.log("\nCategories:", categories.map(c => c.name).join(", "));

  const tags = await prisma.tag.findMany({ select: { name: true } });
  console.log("Tags:", tags.map(t => t.name).join(", "));

  await prisma.$disconnect();
}

main().catch(console.error);
