import { test, expect } from "@playwright/test";

test.describe("トップページ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("ページタイトルが表示される", async ({ page }) => {
    await expect(page).toHaveTitle(/Still On The Wall/);
  });

  test("ヘッダーにサイト名が表示される", async ({ page }) => {
    await expect(page.getByRole("link", { name: "Still On The Wall" }).first()).toBeVisible();
  });

  test("注目記事セクションが表示される", async ({ page }) => {
    await expect(page.getByRole("region", { name: "注目記事" })).toBeVisible();
  });

  test("注目記事の左メインカードに最新記事が表示される", async ({ page }) => {
    const hero = page.getByRole("region", { name: "注目記事" });
    await expect(hero.getByRole("heading", { level: 2 })).toContainText("瑞牆山");
    await expect(hero.getByRole("link", { name: /続きを読む/ })).toBeVisible();
  });

  test("注目記事の右側にサブ記事が2件並ぶ", async ({ page }) => {
    const hero = page.getByRole("region", { name: "注目記事" });
    await expect(hero.getByRole("heading", { level: 3 })).toHaveCount(2);
  });

  test("最新記事リスト1ページ目に公開記事が6件表示される", async ({ page }) => {
    const list = page.getByRole("list", { name: "最新記事リスト" });
    await expect(list.locator("li")).toHaveCount(6);
  });

  test("DRAFT記事は表示されない", async ({ page }) => {
    await expect(page.getByText("城ヶ崎")).not.toBeVisible();
  });

  test("最新記事カードにタイトル・カテゴリ・日付が表示される", async ({ page }) => {
    const firstCard = page
      .getByRole("list", { name: "最新記事リスト" })
      .locator("li")
      .first();
    await expect(firstCard.getByRole("heading")).toBeVisible();
    await expect(firstCard.locator("time")).toBeVisible();
    await expect(firstCard.getByText("クライミング")).toBeVisible();
  });

  test("最新記事カードをクリックすると詳細ページに遷移する", async ({ page }) => {
    await page
      .getByRole("list", { name: "最新記事リスト" })
      .locator("li")
      .first()
      .click();
    await expect(page).toHaveURL(/\/posts\//);
  });

  test("カテゴリフィルタタブが表示され、すべてがActive", async ({ page }) => {
    const tabs = page.getByRole("navigation", { name: "カテゴリフィルタ" });
    await expect(tabs).toBeVisible();
    await expect(tabs.getByRole("link", { name: "すべて" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    await expect(tabs.getByRole("link", { name: "クライミング" })).toBeVisible();
  });

  test("カテゴリタブクリックで絞り込みURLに遷移する", async ({ page }) => {
    await page
      .getByRole("navigation", { name: "カテゴリフィルタ" })
      .getByRole("link", { name: "クライミング" })
      .click();
    await expect(page).toHaveURL(/category=climbing/);
  });

  test("カテゴリ絞り込み時に対象カテゴリのみが表示される", async ({ page }) => {
    await page.goto("/?category=climbing", { waitUntil: "domcontentloaded" });
    const list = page.getByRole("list", { name: "最新記事リスト" });
    await expect(list.locator("li")).toHaveCount(6);
    await expect(list.getByText("丸の内")).not.toBeVisible();
    await expect(list.getByText("スクワマ")).not.toBeVisible();
  });

  test("カテゴリ絞り込み時に対応するタブがActive", async ({ page }) => {
    await page.goto("/?category=climbing", { waitUntil: "domcontentloaded" });
    const tabs = page.getByRole("navigation", { name: "カテゴリフィルタ" });
    await expect(tabs.getByRole("link", { name: "クライミング" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    await expect(tabs.getByRole("link", { name: "すべて" })).not.toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("ページネーションが表示され、1ページ目がActive", async ({ page }) => {
    const pagination = page.getByRole("navigation", { name: "ページネーション" });
    await expect(pagination).toBeVisible();
    await expect(pagination.getByText("1", { exact: true })).toHaveAttribute(
      "aria-current",
      "page"
    );
    await expect(pagination.getByRole("link", { name: "2ページ目" })).toBeVisible();
  });

  test("ページネーションの次へリンクで2ページ目に遷移し、残り記事が表示される", async ({ page }) => {
    await page
      .getByRole("navigation", { name: "ページネーション" })
      .getByRole("link", { name: "次のページ" })
      .click();
    await expect(page).toHaveURL(/page=2/);
    const list = page.getByRole("list", { name: "最新記事リスト" });
    await expect(list.locator("li")).toHaveCount(6);
  });

  test("2ページ目では2ページ目がActiveで前へリンクが活きる", async ({ page }) => {
    await page.goto("/?page=2", { waitUntil: "domcontentloaded" });
    const pagination = page.getByRole("navigation", { name: "ページネーション" });
    await expect(pagination.getByText("2", { exact: true })).toHaveAttribute(
      "aria-current",
      "page"
    );
    await expect(pagination.getByRole("link", { name: "前のページ" })).toBeVisible();
  });

  test("カテゴリ絞り込みで全件が1ページに収まる場合はページネーション非表示", async ({ page }) => {
    await page.goto("/?category=urban", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("navigation", { name: "ページネーション" })
    ).not.toBeVisible();
  });

  test("ナビゲーションリンクが揃っている", async ({ page }) => {
    const viewportSize = page.viewportSize();
    test.skip((viewportSize?.width ?? 1280) < 768, "モバイルナビゲーションはmobile.spec.tsでテスト");
    const nav = page.getByRole("navigation").first();
    await expect(nav.getByRole("link", { name: "カテゴリ" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "タグ" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "プロフィール" })).toBeVisible();
  });

  test("フッターが表示される", async ({ page }) => {
    await expect(page.getByRole("contentinfo")).toContainText("Still On The Wall");
  });
});
