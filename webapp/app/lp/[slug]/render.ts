type RenderInput = {
  title: string;
  description: string | null;
  ogImage: string | null;
  headHtml: string | null;
  css: string | null;
  js: string | null;
  body: string;
};

const HTML_ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
};

function escapeAttr(value: string): string {
  return value.replace(/[&<>"]/g, (ch) => HTML_ESCAPE[ch] ?? ch);
}

function escapeText(value: string): string {
  return value.replace(/[&<>]/g, (ch) => HTML_ESCAPE[ch] ?? ch);
}

export function renderLandingPage(input: RenderInput): string {
  const parts: string[] = [];

  parts.push("<!DOCTYPE html>");
  parts.push('<html lang="ja">');
  parts.push("<head>");
  parts.push('<meta charset="UTF-8">');
  parts.push(
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
  );
  parts.push(`<title>${escapeText(input.title)}</title>`);

  if (input.description) {
    parts.push(
      `<meta name="description" content="${escapeAttr(input.description)}">`
    );
  }

  parts.push(`<meta property="og:title" content="${escapeAttr(input.title)}">`);
  if (input.description) {
    parts.push(
      `<meta property="og:description" content="${escapeAttr(input.description)}">`
    );
  }
  if (input.ogImage) {
    parts.push(
      `<meta property="og:image" content="${escapeAttr(input.ogImage)}">`
    );
  }

  if (input.headHtml) {
    parts.push(input.headHtml);
  }

  if (input.css) {
    parts.push(`<style>${input.css}</style>`);
  }

  parts.push("</head>");
  parts.push("<body>");
  parts.push(input.body);

  if (input.js) {
    parts.push(`<script defer>${input.js}</script>`);
  }

  parts.push("</body>");
  parts.push("</html>");

  return parts.join("\n");
}
