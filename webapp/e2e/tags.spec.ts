import { test, expect } from "@playwright/test";

test.describe("タグページ", () => {
  test("タグ一覧に5件表示される", async ({ page }) => {
    await page.goto("/tags", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("タグ");
    await expect(page.getByRole("link", { name: /^#/ })).toHaveCount(5);
  });

  test("タグに記事件数が表示される", async ({ page }) => {
    await page.goto("/tags", { waitUntil: "domcontentloaded" });
    const trainingTag = page.getByRole("link", { name: /#トレーニング/ });
    await expect(trainingTag).toBeVisible();
    await expect(trainingTag.locator("span").last()).toContainText("3");
  });

  test("タグをクリックすると絞り込みページに遷移する", async ({ page }) => {
    await page.goto("/tags", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /#岩場/ }).click();
    await expect(page).toHaveURL("/tags/crag");
  });

  test("トレーニングタグに3件の記事が表示される", async ({ page }) => {
    await page.goto("/tags/training", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("#トレーニング");
    await expect(page.locator("ul li")).toHaveCount(3);
  });

  test("東京タグに2件の記事が表示される", async ({ page }) => {
    await page.goto("/tags/tokyo", { waitUntil: "domcontentloaded" });
    await expect(page.locator("ul li")).toHaveCount(2);
    await expect(page.getByText("丸の内")).toBeVisible();
  });

  test("存在しないタグで404", async ({ page }) => {
    const response = await page.goto("/tags/unknown-tag", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
  });
});
