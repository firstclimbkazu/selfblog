"use client";

import { useState } from "react";

type Lang = "html" | "css" | "js" | "head";

type Props = {
  html: string;
  setHtml: (v: string) => void;
  css: string;
  setCss: (v: string) => void;
  js: string;
  setJs: (v: string) => void;
  headHtml: string;
  setHeadHtml: (v: string) => void;
};

const PLACEHOLDERS: Record<Lang, string> = {
  html: "<section>...</section>",
  css: "body { background: #fff; }",
  js: "console.log('hello');",
  head: `<!-- 例: Bootstrap CDN / Google Fonts / GSAP など -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<script src="https://cdn.jsdelivr.net/npm/gsap@3.12.0/dist/gsap.min.js"></script>`,
};

export default function CodeTabsPanel({
  html,
  setHtml,
  css,
  setCss,
  js,
  setJs,
  headHtml,
  setHeadHtml,
}: Props) {
  const [tab, setTab] = useState<Lang>("html");

  const value =
    tab === "html" ? html : tab === "css" ? css : tab === "js" ? js : headHtml;
  const onChange =
    tab === "html"
      ? setHtml
      : tab === "css"
        ? setCss
        : tab === "js"
          ? setJs
          : setHeadHtml;

  return (
    <div className="border border-[var(--sotw-border)] rounded-lg overflow-hidden bg-[var(--sotw-surface)]">
      <div className="flex bg-[var(--sotw-bg)] border-b border-[var(--sotw-border)]">
        <CodeTabButton active={tab === "html"} onClick={() => setTab("html")}>
          HTML
        </CodeTabButton>
        <CodeTabButton active={tab === "css"} onClick={() => setTab("css")}>
          CSS
        </CodeTabButton>
        <CodeTabButton active={tab === "js"} onClick={() => setTab("js")}>
          JS
        </CodeTabButton>
        <CodeTabButton active={tab === "head"} onClick={() => setTab("head")}>
          &lt;head&gt;
        </CodeTabButton>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={PLACEHOLDERS[tab]}
        spellCheck={false}
        className="block w-full h-[60vh] p-4 bg-[var(--sotw-surface)] text-[var(--sotw-text)] font-mono text-sm leading-6 resize-y focus:outline-none"
      />

      {tab === "head" && (
        <p className="px-4 py-2 text-xs text-[var(--sotw-text-3)] border-t border-[var(--sotw-border)] bg-[var(--sotw-surface-alt)]">
          外部CSS/JS の link / script タグをここに記述すると、LP の &lt;head&gt; にそのまま注入されます。
        </p>
      )}
    </div>
  );
}

function CodeTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-xs font-mono transition-colors border-r border-[var(--sotw-border)] ${
        active
          ? "bg-[var(--sotw-surface)] text-[var(--sotw-moss)] font-semibold"
          : "text-[var(--sotw-text-2)] hover:bg-[var(--sotw-surface)]"
      }`}
    >
      {children}
    </button>
  );
}
