import { render, screen } from "@testing-library/react";
import ArticleCard from "@/app/components/ArticleCard";

const baseArticle = {
  id: "test-id",
  title: "テスト記事タイトル",
  slug: "test-slug",
  publishedAt: new Date("2026-05-01T00:00:00.000Z"),
  thumbnailUrl: null,
  category: null,
};

describe("ArticleCard", () => {
  it("タイトルを表示する", () => {
    render(<ArticleCard article={baseArticle} />);
    expect(screen.getByRole("heading", { name: "テスト記事タイトル" })).toBeInTheDocument();
  });

  it("記事詳細ページへの href を持つリンクを表示する", () => {
    render(<ArticleCard article={baseArticle} />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "/posts/test-slug");
  });

  it("publishedAt を time タグで表示し dateTime 属性が ISO 文字列である", () => {
    render(<ArticleCard article={baseArticle} />);
    const time = screen.getByRole("time");
    expect(time).toBeInTheDocument();
    expect(time).toHaveAttribute("dateTime", "2026-05-01T00:00:00.000Z");
    expect(time.textContent).toMatch(/2026/);
  });

  it("publishedAt が null の場合は time タグを表示しない", () => {
    render(<ArticleCard article={{ ...baseArticle, publishedAt: null }} />);
    expect(screen.queryByRole("time")).not.toBeInTheDocument();
  });

  it("category がある場合はカテゴリ名を表示する", () => {
    const article = {
      ...baseArticle,
      category: { name: "クライミング", slug: "climbing" },
    };
    render(<ArticleCard article={article} />);
    expect(screen.getByText("クライミング")).toBeInTheDocument();
  });

  it("category が null の場合はカテゴリ名を表示しない", () => {
    render(<ArticleCard article={baseArticle} />);
    expect(screen.queryByText("クライミング")).not.toBeInTheDocument();
  });

  it("thumbnailUrl がある場合は img を表示し alt がタイトルと一致する", () => {
    const article = {
      ...baseArticle,
      thumbnailUrl: "https://example.com/thumb.jpg",
    };
    render(<ArticleCard article={article} />);
    expect(screen.getByRole("img")).toHaveAttribute("alt", "テスト記事タイトル");
  });

  it("thumbnailUrl が null の場合は img を表示しない", () => {
    render(<ArticleCard article={baseArticle} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
