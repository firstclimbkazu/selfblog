import { renderLandingPage } from "@/app/lp/[slug]/render";

describe("renderLandingPage", () => {
  const baseInput = {
    title: "Demo LP",
    description: null,
    ogImage: null,
    headHtml: null,
    css: null,
    js: null,
    body: "<h1>Hi</h1>",
  };

  it("DOCTYPE と html 構造を含む", () => {
    const html = renderLandingPage(baseInput);
    expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
    expect(html).toContain('<html lang="ja">');
    expect(html).toContain("</html>");
  });

  it("title と meta タグを注入する", () => {
    const html = renderLandingPage({
      ...baseInput,
      title: "Page Title",
      description: "page description",
      ogImage: "https://example.com/og.png",
    });
    expect(html).toContain("<title>Page Title</title>");
    expect(html).toContain('<meta name="description" content="page description">');
    expect(html).toContain(
      '<meta property="og:image" content="https://example.com/og.png">'
    );
  });

  it("title の < > & をエスケープする", () => {
    const html = renderLandingPage({ ...baseInput, title: "A & B <c>" });
    expect(html).toContain("<title>A &amp; B &lt;c&gt;</title>");
  });

  it("body をエスケープせずそのまま注入する", () => {
    const html = renderLandingPage({
      ...baseInput,
      body: "<section><h1>raw</h1></section>",
    });
    expect(html).toContain("<section><h1>raw</h1></section>");
  });

  it("CSS は <style> でラップされる", () => {
    const html = renderLandingPage({ ...baseInput, css: "body { color: red; }" });
    expect(html).toContain("<style>body { color: red; }</style>");
  });

  it("JS は <script defer> でラップされる", () => {
    const html = renderLandingPage({ ...baseInput, js: "console.log(1);" });
    expect(html).toContain("<script defer>console.log(1);</script>");
  });

  it("headHtml は <head> 内にそのまま注入される", () => {
    const html = renderLandingPage({
      ...baseInput,
      headHtml: '<link rel="stylesheet" href="https://example.com/x.css">',
    });
    expect(html).toContain(
      '<link rel="stylesheet" href="https://example.com/x.css">'
    );
    // headHtml は </head> より前に出る
    expect(html.indexOf("https://example.com/x.css")).toBeLessThan(
      html.indexOf("</head>")
    );
  });

  it("description が null の場合は meta description を出さない", () => {
    const html = renderLandingPage({ ...baseInput, description: null });
    expect(html).not.toContain('name="description"');
  });
});
