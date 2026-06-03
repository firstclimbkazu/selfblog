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

  test("クライミングカテゴリ1ページ目に6件の記事が表示される", async ({ page }) => {
    await page.goto("/categories/climbing", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("クライミング");
    await expect(page.getByRole("list", { name: "記事リスト" }).locator("li")).toHaveCount(6);
    await expect(page.getByText("DRAFT")).not.toBeVisible();
  });

  test("ギアカテゴリに2件の記事が表示される", async ({ page }) => {
    await page.goto("/categories/gear", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("list", { name: "記事リスト" }).locator("li")).toHaveCount(2);
    await expect(page.getByText("スクワマ")).toBeVisible();
  });

  test("クライミングカテゴリにページネーションが表示される", async ({ page }) => {
    await page.goto("/categories/climbing", { waitUntil: "domcontentloaded" });
    const pagination = page.getByRole("navigation", { name: "ページネーション" });
    await expect(pagination).toBeVisible();
    await expect(pagination.getByText("1", { exact: true })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("クライミングカテゴリの2ページ目で残り記事が表示される", async ({ page }) => {
    await page.goto("/categories/climbing?page=2", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("list", { name: "記事リスト" }).locator("li")).toHaveCount(2);
    const pagination = page.getByRole("navigation", { name: "ページネーション" });
    await expect(pagination.getByText("2", { exact: true })).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  test("ギアカテゴリは1ページに収まるためページネーション非表示", async ({ page }) => {
    await page.goto("/categories/gear", { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("navigation", { name: "ページネーション" })
    ).not.toBeVisible();
  });

  test("存在しないカテゴリで404", async ({ page }) => {
    const response = await page.goto("/categories/unknown-category", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
  });
});
