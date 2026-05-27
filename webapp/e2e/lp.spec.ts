import { test, expect } from "@playwright/test";

test.describe("LP公開ページ", () => {
  test("公開LPが表示される", async ({ page }) => {
    const response = await page.goto("/lp/test-lp", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText("テストLPタイトル");
  });

  test("下書きLPは404を返す", async ({ page }) => {
    const response = await page.goto("/lp/test-lp-draft", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
  });

  test("存在しないslugで404", async ({ page }) => {
    const response = await page.goto("/lp/no-such-lp", { waitUntil: "domcontentloaded" });
    expect(response?.status()).toBe(404);
  });

  test("GTMスニペットが自動注入されている", async ({ page }) => {
    await page.goto("/lp/test-lp", { waitUntil: "domcontentloaded" });
    const content = await page.content();
    expect(content).toContain("googletagmanager.com/gtm.js");
  });

  test("CTAクリックトラッキングスクリプトが注入されている", async ({ page }) => {
    await page.goto("/lp/test-lp", { waitUntil: "domcontentloaded" });
    const content = await page.content();
    expect(content).toContain("lp_cta_click");
    expect(content).toContain("lp_slug");
  });

  test("リンククリックでdataLayerにlp_cta_clickが積まれる", async ({ page }) => {
    await page.goto("/lp/test-lp", { waitUntil: "domcontentloaded" });

    // クリック前にdataLayerを初期化済みか確認
    await page.evaluate(() => { window.dataLayer = window.dataLayer || []; });

    // リンクをクリック（別タブ遷移を防ぐ）
    await page.locator("a.btn-primary").click({ modifiers: ["Meta"] }).catch(() =>
      page.locator("a.btn-primary").dispatchEvent("click")
    );

    const events = await page.evaluate(() =>
      (window.dataLayer as Record<string, unknown>[]).filter(
        (e) => e["event"] === "lp_cta_click"
      )
    );

    expect(events.length).toBeGreaterThan(0);
    expect(events[0]["lp_slug"]).toBe("test-lp");
    expect(events[0]["element_text"]).toContain("今すぐ登録する");
  });

  test("ボタンクリックでdataLayerにlp_cta_clickが積まれる", async ({ page }) => {
    await page.goto("/lp/test-lp", { waitUntil: "domcontentloaded" });

    await page.evaluate(() => { window.dataLayer = window.dataLayer || []; });
    await page.locator("button.btn-secondary").click();

    const events = await page.evaluate(() =>
      (window.dataLayer as Record<string, unknown>[]).filter(
        (e) => e["event"] === "lp_cta_click"
      )
    );

    expect(events.length).toBeGreaterThan(0);
    expect(events[0]["lp_slug"]).toBe("test-lp");
    expect(events[0]["element_text"]).toContain("詳しく見る");
  });

  test("metaタグが正しく設定されている", async ({ page }) => {
    await page.goto("/lp/test-lp", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle("テストLP | E2E");
    const desc = await page.locator('meta[name="description"]').getAttribute("content");
    expect(desc).toBe("e2eテスト用のLP");
  });
});
