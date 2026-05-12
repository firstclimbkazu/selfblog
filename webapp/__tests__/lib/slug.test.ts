import { articleSlug, taxonomySlug, ensureUniqueSlug } from "@/lib/slug";

describe("articleSlug", () => {
  it("英数字タイトルをケバブケースに変換する", () => {
    expect(articleSlug("Hello World")).toBe("hello-world");
  });

  it("連続スペースをハイフン1つにまとめる", () => {
    expect(articleSlug("foo   bar")).toBe("foo-bar");
  });

  it("先頭・末尾のハイフンを除去する", () => {
    expect(articleSlug("  hello  ")).toBe("hello");
  });

  it("記号を除去する", () => {
    expect(articleSlug("Rock & Roll!")).toBe("rock-roll");
  });

  it("ハイフンはそのまま保持する", () => {
    expect(articleSlug("bouldering-one-year")).toBe("bouldering-one-year");
  });

  it("60文字を超える部分は切り詰める", () => {
    const long = "a".repeat(80);
    expect(articleSlug(long).length).toBeLessThanOrEqual(60);
  });

  it("日本語のみの場合は post-{timestamp} フォールバックを返す", () => {
    expect(articleSlug("日本語タイトル")).toMatch(/^post-\d+$/);
  });

  it("空文字列の場合は post-{timestamp} フォールバックを返す", () => {
    expect(articleSlug("")).toMatch(/^post-\d+$/);
  });

  it("記号のみの場合は post-{timestamp} フォールバックを返す", () => {
    expect(articleSlug("!!!")).toMatch(/^post-\d+$/);
  });
});

describe("taxonomySlug", () => {
  it("英語名をスラッグに変換する", () => {
    expect(taxonomySlug("Rock Climbing")).toBe("rock-climbing");
  });

  it("記号を除去する", () => {
    expect(taxonomySlug("Gear & Equipment")).toBe("gear-equipment");
  });

  it("60文字を超える部分は切り詰める", () => {
    const long = "a".repeat(80);
    expect(taxonomySlug(long).length).toBeLessThanOrEqual(60);
  });

  it("先頭・末尾のハイフンを除去する", () => {
    expect(taxonomySlug("  climbing  ")).toBe("climbing");
  });

  it("2文字未満になる場合は8文字のランダム文字列を返す", () => {
    const slug = taxonomySlug("日");
    expect(slug).toHaveLength(8);
    expect(slug).toMatch(/^[0-9a-f]{8}$/);
  });

  it("空文字列の場合は8文字のランダム文字列を返す", () => {
    const slug = taxonomySlug("");
    expect(slug).toHaveLength(8);
    expect(slug).toMatch(/^[0-9a-f]{8}$/);
  });
});

describe("ensureUniqueSlug", () => {
  it("競合なしの場合はそのまま返す", () => {
    expect(ensureUniqueSlug("hello", [])).toBe("hello");
    expect(ensureUniqueSlug("hello", ["world", "foo"])).toBe("hello");
  });

  it("第2引数省略時はそのまま返す", () => {
    expect(ensureUniqueSlug("test")).toBe("test");
  });

  it("競合がある場合は -2 を付ける", () => {
    expect(ensureUniqueSlug("hello", ["hello"])).toBe("hello-2");
  });

  it("hello と hello-2 が競合する場合は hello-3 を返す", () => {
    expect(ensureUniqueSlug("hello", ["hello", "hello-2"])).toBe("hello-3");
  });

  it("連続する競合を飛ばして連番を増やす", () => {
    const existing = ["hello", "hello-2", "hello-3", "hello-4"];
    expect(ensureUniqueSlug("hello", existing)).toBe("hello-5");
  });
});
