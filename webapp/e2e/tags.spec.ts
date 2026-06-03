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
    await expect(trainingTag.locator("span").last()).toContainText("7");
  });

  test("タグをクリックすると絞り込みページに遷移する", async ({ page }) => {
    await page.goto("/tags", { waitUntil: "domcontentloaded" });
    await page.getByRole("link", { name: /#岩場/ }).click();
    await expect(page).toHaveURL("/tags/crag");
  });

  test("トレーニングタグ1ページ目に6件の記事が表示される", async ({ page }) => {
    await page.goto("/tags/training", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("#トレーニング");
    await expect(page.getByRole("list", { name: "記事リスト" }).locator("li")).toHaveCount(6);
  });

  test("東京タグに2件の記事が表示される", async ({ page }) => {
    await page.goto("/tags/tokyo", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("list", { name: "記事リスト" }).locator("li")).toHaveCount(2);
    await expect(page.getByText("丸の内")).toBeVisible();
  });

  test("トレーニングタグにページネーションが表示される", async ({ page }) => {
    await page.goto("/tags/training", { waitUntil: "domcontentloaded" });
    const pagination = page.getByRole("navigation", { name: "ページネーション" });
    await expect(pagination).toBeVisible();
    await expect(pagination.getByText("1", { exact: true })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("トレーニングタグの2ページ目で残り記事が表示される", async ({ page }) => {
    await page.goto("/tags/training?page=2", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("list", { name: "記事リスト" }).locator("li")).toHaveCount(1);
    const pagination = page.getByRole("navigation", { name: "ページネーション" });
    await expect(pagination.getByText("2", { exact: true })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("東京タグは1ページに収まるためページネーション非表示", async ({ page }) => {
    await page.goto("/tags/tokyo", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("navigation", { name: "ページネーション" })
    ).not.toBeVisible();
  });

  test("存在しないタグで404", async ({ page }) => {
    const response = await page.goto("/tags/unknown-tag", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
  });
});
