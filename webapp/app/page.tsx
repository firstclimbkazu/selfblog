import HeroSection from "./HeroSection";
import LatestArticles from "./LatestArticles";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ category?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { category } = await searchParams;
  const categorySlug = category?.trim() || null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <HeroSection />
      <LatestArticles categorySlug={categorySlug} />
    </div>
  );
}
