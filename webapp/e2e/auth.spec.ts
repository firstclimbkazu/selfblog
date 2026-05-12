import { test, expect } from "@playwright/test";

test.describe("認証・アクセス制御", () => {
  test("/admin にアクセスすると /signin にリダイレクトされる", async ({ page }) => {
    await page.goto("/admin", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/signin/);
  });

  test("/admin/posts にアクセスすると /signin にリダイレクトされる", async ({ page }) => {
    await page.goto("/admin/posts", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/signin/);
  });

  test("/admin/categories にアクセスすると /signin にリダイレクトされる", async ({ page }) => {
    await page.goto("/admin/categories", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/signin/);
  });

  test("403ページが表示される", async ({ page }) => {
    await page.goto("/403", { waitUntil: "domcontentloaded" });
    await expect(page.getByText("403")).toBeVisible();
    await expect(page.getByText("アクセス権限がありません")).toBeVisible();
    await expect(page.getByRole("link", { name: "トップページへ戻る" })).toBeVisible();
  });
});
