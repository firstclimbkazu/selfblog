"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Category = { id: string; name: string };
type Tag = { id: string; name: string };

type Props = {
  action: (formData: FormData) => Promise<void>;
  categories: Category[];
  tags: Tag[];
  defaultValues?: {
    title?: string;
    body?: string;
    categoryId?: string | null;
    tagIds?: string[];
    thumbnailUrl?: string | null;
    featuredOrder?: number | null;
  };
};

export default function ArticleForm({
  action,
  categories,
  tags,
  defaultValues = {},
}: Props) {
  const [body, setBody] = useState(defaultValues.body ?? "");
  const [preview, setPreview] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState(defaultValues.thumbnailUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("5MB を超えるファイルはアップロードできません");
      return;
    }

    setUploadError("");
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();

    setUploading(false);

    if (!res.ok) {
      setUploadError(json.error ?? "アップロードに失敗しました");
      return;
    }

    setThumbnailUrl(json.url);
  }

  return (
    <form action={action} className="space-y-6">
      {/* タイトル */}
      <div>
        <label className="block text-sm font-medium text-[var(--sotw-text)] mb-1">
          タイトル
        </label>
        <input
          name="title"
          type="text"
          required
          defaultValue={defaultValues.title ?? ""}
          className="w-full px-3 py-2 border border-[var(--sotw-border)] rounded-lg text-[var(--sotw-text)] bg-[var(--sotw-bg)] focus:outline-none focus:border-[var(--sotw-moss)]"
          placeholder="記事タイトルを入力"
        />
      </div>

      {/* サムネイル */}
      <div>
        <label className="block text-sm font-medium text-[var(--sotw-text)] mb-2">
          サムネイル画像
        </label>
        <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />

        <div className="flex items-start gap-4">
          {thumbnailUrl ? (
            <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-[var(--sotw-border)] flex-shrink-0">
              <Image src={thumbnailUrl} alt="サムネイル" fill className="object-cover" />
            </div>
          ) : (
            <div className="w-32 h-20 rounded-lg border border-dashed border-[var(--sotw-border)] bg-[var(--sotw-surface-alt)] flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-[var(--sotw-text-3)]">未設定</span>
            </div>
          )}

          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-4 py-2 text-sm border border-[var(--sotw-border)] rounded-lg text-[var(--sotw-text-2)] hover:border-[var(--sotw-moss)] hover:text-[var(--sotw-moss)] transition-colors disabled:opacity-50"
            >
              {uploading ? "アップロード中…" : "画像を選択"}
            </button>
            {thumbnailUrl && (
              <button
                type="button"
                onClick={() => setThumbnailUrl("")}
                className="block text-xs text-red-400 hover:text-red-600"
              >
                削除
              </button>
            )}
            {uploadError && (
              <p className="text-xs text-red-500">{uploadError}</p>
            )}
            <p className="text-xs text-[var(--sotw-text-3)]">最大 5MB / JPG・PNG・WebP</p>
          </div>
        </div>
      </div>

      {/* 注目記事スロット */}
      <div>
        <label className="block text-sm font-medium text-[var(--sotw-text)] mb-1">
          注目記事スロット
        </label>
        <select
          name="featuredOrder"
          defaultValue={defaultValues.featuredOrder ?? ""}
          className="w-full px-3 py-2 border border-[var(--sotw-border)] rounded-lg text-[var(--sotw-text)] bg-[var(--sotw-bg)] focus:outline-none focus:border-[var(--sotw-moss)]"
        >
          <option value="">— なし —</option>
          <option value="1">1: メイン（左大カード）</option>
          <option value="2">2: 右上カード</option>
          <option value="3">3: 右下カード</option>
        </select>
        <p className="mt-1 text-xs text-[var(--sotw-text-3)]">
          既に同じスロットに別の記事が設定されている場合、自動で外されます。
        </p>
      </div>

      {/* カテゴリ */}
      <div>
        <label className="block text-sm font-medium text-[var(--sotw-text)] mb-1">
          カテゴリ
        </label>
        <select
          name="categoryId"
          defaultValue={defaultValues.categoryId ?? ""}
          className="w-full px-3 py-2 border border-[var(--sotw-border)] rounded-lg text-[var(--sotw-text)] bg-[var(--sotw-bg)] focus:outline-none focus:border-[var(--sotw-moss)]"
        >
          <option value="">— 未分類 —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* タグ */}
      <div>
        <label className="block text-sm font-medium text-[var(--sotw-text)] mb-2">
          タグ
        </label>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-1.5 text-sm text-[var(--sotw-text-2)] cursor-pointer">
              <input
                type="checkbox"
                name="tagIds"
                value={tag.id}
                defaultChecked={defaultValues.tagIds?.includes(tag.id)}
                className="accent-[var(--sotw-moss)]"
              />
              #{tag.name}
            </label>
          ))}
        </div>
      </div>

      {/* 本文エディタ */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-[var(--sotw-text)]">
            本文（Markdown）
          </label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="text-xs text-[var(--sotw-moss)] hover:underline"
          >
            {preview ? "エディタに戻る" : "プレビュー表示"}
          </button>
        </div>

        {preview ? (
          <div className="w-full min-h-64 p-4 border border-[var(--sotw-border)] rounded-lg bg-[var(--sotw-surface)] prose prose-stone max-w-none">
            {body ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
            ) : (
              <p className="text-[var(--sotw-text-3)]">本文がまだありません。</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <textarea
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={20}
              className="w-full px-3 py-2 border border-[var(--sotw-border)] rounded-lg text-sm text-[var(--sotw-text)] bg-[var(--sotw-bg)] font-mono resize-y focus:outline-none focus:border-[var(--sotw-moss)]"
              placeholder="Markdownで本文を入力..."
            />
            <div className="min-h-64 p-4 border border-[var(--sotw-border)] rounded-lg bg-[var(--sotw-surface-alt)] prose prose-stone max-w-none overflow-auto">
              {body ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
              ) : (
                <p className="text-[var(--sotw-text-3)] text-sm">プレビューがここに表示されます。</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* アクションボタン */}
      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          name="intent"
          value="draft"
          className="px-6 py-2 border border-[var(--sotw-border)] rounded-lg text-sm text-[var(--sotw-text-2)] hover:border-[var(--sotw-moss)] hover:text-[var(--sotw-moss)] transition-colors"
        >
          下書き保存
        </button>
        <button
          type="submit"
          name="intent"
          value="publish"
          className="px-6 py-2 bg-[var(--sotw-moss)] text-white rounded-lg text-sm hover:bg-[var(--sotw-moss-hover)] transition-colors"
        >
          公開
        </button>
      </div>
    </form>
  );
}
