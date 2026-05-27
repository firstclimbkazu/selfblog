const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-MTT7QG3S";

type RenderInput = {
  slug: string;
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
  // GTM
  parts.push(`<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${escapeAttr(GTM_ID)}');</script>`);

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
  parts.push(`<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${escapeAttr(GTM_ID)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`);
  parts.push(input.body);

  if (input.js) {
    parts.push(`<script defer>${input.js}</script>`);
  }

  // CTA クリックトラッキング
  parts.push(`<script>
(function(){
  var slug=${JSON.stringify(input.slug)};
  document.addEventListener('click',function(e){
    var el=e.target.closest('a[href],button,[data-cta]');
    if(!el)return;
    window.dataLayer=window.dataLayer||[];
    window.dataLayer.push({
      event:'lp_cta_click',
      lp_slug:slug,
      element_text:(el.innerText||el.textContent||'').trim().slice(0,100),
      element_url:el.href||''
    });
  });
})();
</script>`);

  parts.push("</body>");
  parts.push("</html>");

  return parts.join("\n");
}
