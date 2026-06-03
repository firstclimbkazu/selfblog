import { prisma } from "@/lib/prisma";
import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";

export default async function HeroSection() {
  const [featured, latest] = await Promise.all([
    prisma.article.findMany({
      where: { status: "PUBLISHED", featuredOrder: { in: [1, 2, 3] } },
      orderBy: { featuredOrder: "asc" },
      include: { category: true },
    }),
    prisma.article.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: { category: true },
    }),
  ]);

  const slots: (typeof latest[number])[] = [];
  const usedIds = new Set<string>();

  for (const order of [1, 2, 3]) {
    const pinned = featured.find((a) => a.featuredOrder === order);
    if (pinned) {
      slots.push(pinned);
      usedIds.add(pinned.id);
    }
  }

  for (const article of latest) {
    if (slots.length >= 3) break;
    if (usedIds.has(article.id)) continue;
    slots.push(article);
    usedIds.add(article.id);
  }

  const [mainArticle, ...subArticles] = slots;

  if (!mainArticle) return null;

  return (
    <section
      aria-label="注目記事"
      className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-4 mb-12 lg:h-[440px]"
    >
      <HeroLeft article={mainArticle} />
      <HeroRight articles={subArticles} />
    </section>
  );
}
