import { test, expect } from "@playwright/test";

test.describe("プロフィールページ", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/profile", { waitUntil: "domcontentloaded" });
  });

  test("プロフィール情報が表示される", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "firstclimb kazu" })).toBeVisible();
    await expect(page.locator("p.text-sm", { hasText: "Still On The Wall" })).toBeVisible();
  });

  test("自己紹介文が表示される", async ({ page }) => {
    await expect(page.getByText("都市に生き、岩壁を登る")).toBeVisible();
  });

  test("GitHubリンクが存在する", async ({ page }) => {
    const githubLink = page.getByRole("link", { name: /GitHub/ });
    await expect(githubLink).toBeVisible();
    await expect(githubLink).toHaveAttribute("href", /github\.com/);
    await expect(githubLink).toHaveAttribute("target", "_blank");
  });

  test("Xリンクが存在する", async ({ page }) => {
    const xLink = page.getByRole("link", { name: /X \(Twitter\)/ });
    await expect(xLink).toBeVisible();
    await expect(xLink).toHaveAttribute("href", /x\.com/);
  });

  test("「記事一覧へ」リンクでトップページに戻れる", async ({ page }) => {
    await page.getByRole("link", { name: "← 記事一覧へ" }).click();
    await expect(page).toHaveURL("/");
  });
});
