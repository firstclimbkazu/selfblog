import { test, expect } from "@playwright/test";

test.describe("ダークモード", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.evaluate(() => localStorage.removeItem("theme"));
    await page.reload({ waitUntil: "load" });
  });

  test("トグルをクリックするとdarkクラスが付与される", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "ダークモードに切り替え" }).first();
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("ダークモード時に再クリックするとdarkクラスが外れる", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "ダークモードに切り替え" }).first();
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    const toggleBack = page.getByRole("button", { name: "ライトモードに切り替え" }).first();
    await toggleBack.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("ダークモード設定がlocalStorageに保存される", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "ダークモードに切り替え" }).first();
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    const theme = await page.evaluate(() => localStorage.getItem("theme"));
    expect(theme).toBe("dark");
  });

  test("ページ遷移後もダークモードが維持される", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "ダークモードに切り替え" }).first();
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.goto("/categories", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("アンチフラッシュ: リロード後も設定が引き継がれる", async ({ page }) => {
    await page.evaluate(() => localStorage.setItem("theme", "dark"));
    await page.reload({ waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
