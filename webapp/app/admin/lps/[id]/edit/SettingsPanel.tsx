"use client";

import { useState } from "react";

type Props = {
  title: string;
  setTitle: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  status: "DRAFT" | "PUBLISHED";
  setStatus: (v: "DRAFT" | "PUBLISHED") => void;
  metaTitle: string;
  setMetaTitle: (v: string) => void;
  metaDescription: string;
  setMetaDescription: (v: string) => void;
  metaOgImage: string;
  setMetaOgImage: (v: string) => void;
  previewSlug: string;
  isPending: boolean;
  saveMessage: string | null;
};

export default function SettingsPanel({
  title,
  setTitle,
  slug,
  setSlug,
  status,
  setStatus,
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  metaOgImage,
  setMetaOgImage,
  previewSlug,
  isPending,
  saveMessage,
}: Props) {
  const [metaOpen, setMetaOpen] = useState(false);

  return (
    <div className="space-y-4">
      <Field label="タイトル（管理用）">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-[var(--sotw-border)] rounded-lg text-[var(--sotw-text)] bg-[var(--sotw-bg)] focus:outline-none focus:border-[var(--sotw-moss)]"
        />
      </Field>

      <Field label="スラッグ">
        <div className="flex items-stretch">
          <span className="px-2 py-2 border border-r-0 border-[var(--sotw-border)] rounded-l-lg bg-[var(--sotw-surface-alt)] text-xs text-[var(--sotw-text-2)] font-mono whitespace-nowrap">
            /lp/
          </span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="flex-1 px-3 py-2 border border-[var(--sotw-border)] rounded-r-lg text-[var(--sotw-text)] bg-[var(--sotw-bg)] font-mono text-sm focus:outline-none focus:border-[var(--sotw-moss)]"
          />
        </div>
      </Field>

      <Field label="ステータス">
        <div className="flex gap-2">
          <StatusOption
            active={status === "DRAFT"}
            onClick={() => setStatus("DRAFT")}
          >
            下書き
          </StatusOption>
          <StatusOption
            active={status === "PUBLISHED"}
            onClick={() => setStatus("PUBLISHED")}
          >
            公開
          </StatusOption>
        </div>
      </Field>

      <details open={metaOpen} onToggle={(e) => setMetaOpen(e.currentTarget.open)}>
        <summary className="cursor-pointer text-sm font-medium text-[var(--sotw-text)] py-2 select-none">
          meta 情報
        </summary>
        <div className="space-y-3 pt-2">
          <Field label="meta title">
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--sotw-border)] rounded-lg text-[var(--sotw-text)] bg-[var(--sotw-bg)] text-sm focus:outline-none focus:border-[var(--sotw-moss)]"
            />
          </Field>
          <Field label="meta description">
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-[var(--sotw-border)] rounded-lg text-[var(--sotw-text)] bg-[var(--sotw-bg)] text-sm resize-y focus:outline-none focus:border-[var(--sotw-moss)]"
            />
          </Field>
          <Field label="OG画像URL">
            <input
              type="url"
              value={metaOgImage}
              onChange={(e) => setMetaOgImage(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--sotw-border)] rounded-lg text-[var(--sotw-text)] bg-[var(--sotw-bg)] text-sm font-mono focus:outline-none focus:border-[var(--sotw-moss)]"
              placeholder="https://..."
            />
          </Field>
        </div>
      </details>

      <div className="flex flex-col gap-2 pt-4 border-t border-[var(--sotw-border)]">
        <button
          type="submit"
          disabled={isPending}
          className="w-full px-4 py-2 bg-[var(--sotw-moss)] text-white rounded-lg text-sm hover:bg-[var(--sotw-moss-hover)] transition-colors disabled:opacity-50"
        >
          {isPending ? "保存中…" : "保存"}
        </button>
        <a
          href={`/lp/${previewSlug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2 border border-[var(--sotw-border)] rounded-lg text-sm text-[var(--sotw-text-2)] hover:border-[var(--sotw-moss)] hover:text-[var(--sotw-moss)] transition-colors"
        >
          プレビュー（別タブ）
        </a>
        {saveMessage && (
          <p className="text-xs text-[var(--sotw-moss)] text-center">
            {saveMessage}
          </p>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-[var(--sotw-text-2)] mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function StatusOption({
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
      className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
        active
          ? "border-[var(--sotw-moss)] bg-[var(--sotw-moss-bg)] text-[var(--sotw-moss)] font-medium"
          : "border-[var(--sotw-border)] text-[var(--sotw-text-2)] hover:border-[var(--sotw-text-2)]"
      }`}
    >
      {children}
    </button>
  );
}
