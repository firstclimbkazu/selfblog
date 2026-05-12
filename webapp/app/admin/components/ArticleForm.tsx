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
        <label className="block text-sm font-medium text-[#1E1610] mb-1">
          タイトル
        </label>
        <input
          name="title"
          type="text"
          required
          defaultValue={defaultValues.title ?? ""}
          className="w-full px-3 py-2 border border-[#E8E2DA] rounded-lg text-[#1E1610] focus:outline-none focus:border-[#2D6B52]"
          placeholder="記事タイトルを入力"
        />
      </div>

      {/* サムネイル */}
      <div>
        <label className="block text-sm font-medium text-[#1E1610] mb-2">
          サムネイル画像
        </label>
        <input type="hidden" name="thumbnailUrl" value={thumbnailUrl} />

        <div className="flex items-start gap-4">
          {thumbnailUrl ? (
            <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-[#E8E2DA] flex-shrink-0">
              <Image src={thumbnailUrl} alt="サムネイル" fill className="object-cover" />
            </div>
          ) : (
            <div className="w-32 h-20 rounded-lg border border-dashed border-[#E8E2DA] bg-[#F9F7F4] flex items-center justify-center flex-shrink-0">
              <span className="text-xs text-[#B8A99A]">未設定</span>
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
              className="px-4 py-2 text-sm border border-[#E8E2DA] rounded-lg text-[#6B5E52] hover:border-[#2D6B52] hover:text-[#2D6B52] transition-colors disabled:opacity-50"
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
            <p className="text-xs text-[#B8A99A]">最大 5MB / JPG・PNG・WebP</p>
          </div>
        </div>
      </div>

      {/* カテゴリ */}
      <div>
        <label className="block text-sm font-medium text-[#1E1610] mb-1">
          カテゴリ
        </label>
        <select
          name="categoryId"
          defaultValue={defaultValues.categoryId ?? ""}
          className="w-full px-3 py-2 border border-[#E8E2DA] rounded-lg text-[#1E1610] bg-white focus:outline-none focus:border-[#2D6B52]"
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
        <label className="block text-sm font-medium text-[#1E1610] mb-2">
          タグ
        </label>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-1.5 text-sm text-[#6B5E52] cursor-pointer">
              <input
                type="checkbox"
                name="tagIds"
                value={tag.id}
                defaultChecked={defaultValues.tagIds?.includes(tag.id)}
                className="accent-[#2D6B52]"
              />
              #{tag.name}
            </label>
          ))}
        </div>
      </div>

      {/* 本文エディタ */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-[#1E1610]">
            本文（Markdown）
          </label>
          <button
            type="button"
            onClick={() => setPreview(!preview)}
            className="text-xs text-[#2D6B52] hover:underline"
          >
            {preview ? "エディタに戻る" : "プレビュー表示"}
          </button>
        </div>

        {preview ? (
          <div className="w-full min-h-64 p-4 border border-[#E8E2DA] rounded-lg bg-white prose prose-stone max-w-none">
            {body ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
            ) : (
              <p className="text-[#B8A99A]">本文がまだありません。</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <textarea
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={20}
              className="w-full px-3 py-2 border border-[#E8E2DA] rounded-lg text-sm text-[#1E1610] font-mono resize-y focus:outline-none focus:border-[#2D6B52]"
              placeholder="Markdownで本文を入力..."
            />
            <div className="min-h-64 p-4 border border-[#E8E2DA] rounded-lg bg-[#FAFAF9] prose prose-stone max-w-none overflow-auto">
              {body ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
              ) : (
                <p className="text-[#B8A99A] text-sm">プレビューがここに表示されます。</p>
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
          className="px-6 py-2 border border-[#E8E2DA] rounded-lg text-sm text-[#6B5E52] hover:border-[#2D6B52] hover:text-[#2D6B52] transition-colors"
        >
          下書き保存
        </button>
        <button
          type="submit"
          name="intent"
          value="publish"
          className="px-6 py-2 bg-[#2D6B52] text-white rounded-lg text-sm hover:bg-[#245840] transition-colors"
        >
          公開
        </button>
      </div>
    </form>
  );
}
