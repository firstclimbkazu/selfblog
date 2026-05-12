import { test, expect } from "@playwright/test";

test.describe("記事詳細ページ", () => {
  test("タイトル・本文・カテゴリ・タグが表示される", async ({ page }) => {
    await page.goto("/posts/mizugaki-crack-debut", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { level: 1 })).toContainText("瑞牆山");
    await expect(page.getByRole("link", { name: "クライミング" })).toBeVisible();
    await expect(page.getByText("#岩場")).toBeVisible();
    await expect(page.getByText("#トレーニング")).toBeVisible();
    await expect(page.getByText("ジャミング")).toBeVisible();
  });

  test("マークダウンが正しくレンダリングされる", async ({ page }) => {
    await page.goto("/posts/bouldering-one-year", { waitUntil: "domcontentloaded" });

    await expect(page.getByRole("heading", { name: "体の変化" })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("strong")).toBeVisible();
  });

  test("カテゴリリンクをクリックするとカテゴリページに遷移する", async ({ page }) => {
    await page.goto("/posts/mizugaki-crack-debut", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: "クライミング" }).click();
    await expect(page).toHaveURL("/categories/climbing");
  });

  test("タグリンクをクリックするとタグページに遷移する", async ({ page }) => {
    await page.goto("/posts/mizugaki-crack-debut", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /#岩場/ }).click();
    await expect(page).toHaveURL("/tags/crag");
  });

  test("「一覧へ戻る」でトップページに戻れる", async ({ page }) => {
    await page.goto("/posts/mizugaki-crack-debut", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: "← 一覧へ戻る" }).click();
    await expect(page).toHaveURL("/");
  });

  test("存在しないslugで404", async ({ page }) => {
    const response = await page.goto("/posts/this-does-not-exist", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
  });

  test("DRAFT記事のslugで404", async ({ page }) => {
    const response = await page.goto("/posts/jogasaki-autumn-draft", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
  });
});
