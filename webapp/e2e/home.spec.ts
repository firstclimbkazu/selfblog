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

  test("公開記事が4件表示される", async ({ page }) => {
    const cards = page.locator("ul li");
    await expect(cards).toHaveCount(4);
  });

  test("DRAFT記事は表示されない", async ({ page }) => {
    await expect(page.getByText("城ヶ崎")).not.toBeVisible();
  });

  test("記事カードにタイトル・カテゴリ・日付が表示される", async ({ page }) => {
    const firstCard = page.locator("ul li").first();
    await expect(firstCard.getByRole("heading")).toBeVisible();
    await expect(firstCard.locator("time")).toBeVisible();
    await expect(firstCard.getByText("クライミング")).toBeVisible();
  });

  test("記事カードをクリックすると詳細ページに遷移する", async ({ page }) => {
    await page.locator("ul li").first().click();
    await expect(page).toHaveURL(/\/posts\//);
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
