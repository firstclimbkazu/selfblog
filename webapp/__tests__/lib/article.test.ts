import { resolvePublishedAt } from "@/lib/article";

describe("resolvePublishedAt", () => {
  it("publish=true かつ publishedAt が null なら新しい Date を返す", () => {
    const before = Date.now();
    const result = resolvePublishedAt(true, null);
    expect(result).not.toBeNull();
    expect(result!.getTime()).toBeGreaterThanOrEqual(before);
    expect(result!.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it("publish=false かつ publishedAt が null なら null を返す", () => {
    expect(resolvePublishedAt(false, null)).toBeNull();
  });

  it("publish=true かつ publishedAt が既にある場合は変更しない", () => {
    const existing = new Date("2026-01-01T00:00:00.000Z");
    expect(resolvePublishedAt(true, existing)).toBe(existing);
  });

  it("publish=false かつ publishedAt が既にある場合も変更しない", () => {
    const existing = new Date("2026-01-01T00:00:00.000Z");
    expect(resolvePublishedAt(false, existing)).toBe(existing);
  });
});
