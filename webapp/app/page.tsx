import HeroSection from "./HeroSection";
import LatestArticles from "./LatestArticles";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <HeroSection />
      <LatestArticles />
    </div>
  );
}
