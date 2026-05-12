import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/app/components/Header";

describe("Header", () => {
  it("サイト名リンクが / を指す", () => {
    render(<Header />);
    const siteLinks = screen.getAllByRole("link", { name: /Still On The Wall/ });
    expect(siteLinks[0]).toHaveAttribute("href", "/");
  });

  it("デスクトップナビに主要リンクが含まれる", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "カテゴリ" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "タグ" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "プロフィール" })).toBeInTheDocument();
  });

  it("カテゴリリンクが /categories を指す", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "カテゴリ" })).toHaveAttribute(
      "href",
      "/categories"
    );
  });

  it("ハンバーガーボタンが存在する", () => {
    render(<Header />);
    expect(
      screen.getByRole("button", { name: "メニューを開く" })
    ).toBeInTheDocument();
  });

  it("ハンバーガーボタンをクリックするとモバイルメニューが開き nav リンクが増える", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const beforeCount = screen.getAllByRole("link", { name: "カテゴリ" }).length;
    await user.click(screen.getByRole("button", { name: "メニューを開く" }));
    const afterCount = screen.getAllByRole("link", { name: "カテゴリ" }).length;
    expect(afterCount).toBeGreaterThan(beforeCount);
  });

  it("ダークモードトグルボタンが存在する", () => {
    render(<Header />);
    const toggles = screen.getAllByRole("button", {
      name: "ダークモードに切り替え",
    });
    expect(toggles.length).toBeGreaterThanOrEqual(1);
  });
});
