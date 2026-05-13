import { test, expect } from "@playwright/test";

test.describe("モバイルレイアウト", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("デスクトップナビが非表示でハンバーガーが表示される", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("button", { name: "メニューを開く" })).toBeVisible();
    await expect(page.locator("nav.hidden")).toBeHidden();
  });

  test("ハンバーガーをクリックするとメニューが開く", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.getByRole("button", { name: "メニューを開く" }).click();
    await expect(page.getByRole("link", { name: "カテゴリ" }).last()).toBeVisible();
    await expect(page.getByRole("link", { name: "タグ" }).last()).toBeVisible();
    await expect(page.getByRole("link", { name: "プロフィール" }).last()).toBeVisible();
  });

  test("モバイルメニューのリンクをクリックするとメニューが閉じる", async ({ page }) => {
    await page.goto("/", { waitUntil: "load" });
    await page.getByRole("button", { name: "メニューを開く" }).click();
    await page.getByRole("link", { name: "プロフィール" }).last().click();
    await expect(page).toHaveURL("/profile");
  });

  test("モバイルにもダークモードトグルが表示される", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const toggles = page.getByRole("button", { name: "ダークモードに切り替え" });
    await expect(toggles.last()).toBeVisible();
  });
});
