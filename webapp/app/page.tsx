import HeroSection from "./HeroSection";
import LatestArticles from "./LatestArticles";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ category?: string; page?: string }>;
};

function parsePage(raw: string | undefined): number {
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : 1;
}

export default async function Home({ searchParams }: Props) {
  const { category, page } = await searchParams;
  const categorySlug = category?.trim() || null;
  const currentPage = parsePage(page);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <HeroSection />
      <LatestArticles categorySlug={categorySlug} page={currentPage} />
    </div>
  );
}
