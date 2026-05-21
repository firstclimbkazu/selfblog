"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { addLpImage, deleteLpImage } from "../../actions";
import type { LpImageDto } from "./types";

type Props = {
  lpId: string;
  images: LpImageDto[];
  setImages: React.Dispatch<React.SetStateAction<LpImageDto[]>>;
};

export default function ImagesPanel({ lpId, images, setImages }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("lpId", lpId);

      const res = await fetch("/api/upload/lp", { method: "POST", body: fd });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "アップロードに失敗しました");
        continue;
      }

      const saved = await addLpImage(lpId, {
        publicUrl: json.url,
        fileName: json.fileName,
        fileSize: json.fileSize ?? null,
      });
      setImages((prev) => [
        {
          id: saved.id,
          publicUrl: saved.publicUrl,
          fileName: saved.fileName,
          fileSize: saved.fileSize,
        },
        ...prev,
      ]);
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleCopy(id: string, url: string) {
    const absolute = url.startsWith("http")
      ? url
      : `${window.location.origin}${url}`;
    await navigator.clipboard.writeText(absolute);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  async function handleDelete(id: string, fileName: string) {
    if (!confirm(`「${fileName}」を削除しますか？`)) return;
    await deleteLpImage(id);
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full px-4 py-2 bg-[var(--sotw-moss)] text-white rounded-lg text-sm hover:bg-[var(--sotw-moss-hover)] transition-colors disabled:opacity-50"
      >
        {uploading ? "アップロード中…" : "画像をアップロード"}
      </button>

      <p className="text-xs text-[var(--sotw-text-3)]">
        URLをコピーしてHTMLに <code className="font-mono">&lt;img src=&quot;...&quot;&gt;</code> として貼り付けて使います。最大5MB / JPEG・PNG・WebP・GIF。
      </p>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {images.length === 0 ? (
        <p className="text-xs text-[var(--sotw-text-3)] py-8 text-center border border-dashed border-[var(--sotw-border)] rounded-lg">
          画像はまだありません
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {images.map((img) => (
            <ImageCell
              key={img.id}
              img={img}
              copied={copiedId === img.id}
              onCopy={() => handleCopy(img.id, img.publicUrl)}
              onDelete={() => handleDelete(img.id, img.fileName)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ImageCell({
  img,
  copied,
  onCopy,
  onDelete,
}: {
  img: LpImageDto;
  copied: boolean;
  onCopy: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="group relative border border-[var(--sotw-border)] rounded overflow-hidden bg-[var(--sotw-bg)]">
      <div className="relative aspect-square">
        <Image
          src={img.publicUrl}
          alt={img.fileName}
          fill
          sizes="120px"
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5">
          <button
            type="button"
            onClick={onCopy}
            className="px-2 py-1 bg-white text-[var(--sotw-text)] text-[10px] rounded font-medium hover:bg-[var(--sotw-moss)] hover:text-white transition-colors"
          >
            {copied ? "コピー済み" : "URLコピー"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="px-2 py-1 bg-white text-red-600 text-[10px] rounded font-medium hover:bg-red-600 hover:text-white transition-colors"
          >
            削除
          </button>
        </div>
      </div>
      <div className="px-1.5 py-1">
        <p className="text-[10px] truncate text-[var(--sotw-text-2)]">{img.fileName}</p>
        {img.fileSize != null && (
          <p className="text-[10px] text-[var(--sotw-text-3)]">
            {(img.fileSize / 1024).toFixed(0)} KB
          </p>
        )}
      </div>
    </div>
  );
}
