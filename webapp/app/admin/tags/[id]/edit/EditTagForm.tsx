import Link from "next/link";
import type { Tag } from "@prisma/client";

type Props = {
  tag: Tag;
  action: (formData: FormData) => Promise<void>;
};

export default function EditTagForm({ tag, action }: Props) {
  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--sotw-text)] tracking-tight mb-1">
          タグ編集
        </h1>
        <Link href="/admin/tags" className="text-sm text-[var(--sotw-text-2)] hover:text-[var(--sotw-moss)]">
          ← タグ一覧へ
        </Link>
      </div>

      <div className="bg-[var(--sotw-surface)] border border-[var(--sotw-border)] rounded-lg p-6">
        <form action={action} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--sotw-text)] mb-1">
              タグ名
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={tag.name}
              className="w-full px-3 py-2 border border-[var(--sotw-border)] rounded-lg text-[var(--sotw-text)] bg-[var(--sotw-bg)] focus:outline-none focus:border-[var(--sotw-moss)]"
            />
          </div>
          <p className="text-xs text-[var(--sotw-text-2)]">
            現在の slug: <span className="font-mono">{tag.slug}</span>
            　（名前変更時は自動更新されます）
          </p>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-[var(--sotw-moss)] text-white rounded-lg text-sm hover:bg-[var(--sotw-moss-hover)] transition-colors"
            >
              保存
            </button>
            <Link
              href="/admin/tags"
              className="px-5 py-2 border border-[var(--sotw-border)] rounded-lg text-sm text-[var(--sotw-text-2)] hover:border-[var(--sotw-moss)] transition-colors"
            >
              キャンセル
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
