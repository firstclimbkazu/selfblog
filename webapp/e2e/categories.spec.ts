import { test, expect } from "@playwright/test";

test.describe("カテゴリページ", () => {
  test("カテゴリ一覧に4件表示される", async ({ page }) => {
    await page.goto("/categories", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("カテゴリ");
    await expect(page.locator("ul li")).toHaveCount(4);
  });

  test("カテゴリの記事件数が表示される", async ({ page }) => {
    await page.goto("/categories", { waitUntil: "domcontentloaded" });
    await expect(page.locator("ul li").first().getByText(/件/)).toBeVisible();
  });

  test("カテゴリをクリックすると絞り込みページに遷移する", async ({ page }) => {
    await page.goto("/categories", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /クライミング/ }).click();
    await expect(page).toHaveURL("/categories/climbing");
  });

  test("クライミングカテゴリに4件の記事が表示される", async ({ page }) => {
    await page.goto("/categories/climbing", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("クライミング");
    await expect(page.locator("ul li")).toHaveCount(4);
    await expect(page.getByText("DRAFT")).not.toBeVisible();
  });

  test("ギアカテゴリに2件の記事が表示される", async ({ page }) => {
    await page.goto("/categories/gear", { waitUntil: "domcontentloaded" });
    await expect(page.locator("ul li")).toHaveCount(2);
    await expect(page.getByText("スクワマ")).toBeVisible();
  });

  test("存在しないカテゴリで404", async ({ page }) => {
    const response = await page.goto("/categories/unknown-category", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
  });
});
