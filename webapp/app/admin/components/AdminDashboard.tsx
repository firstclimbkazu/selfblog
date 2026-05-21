import Link from "next/link";
import { signOut } from "@/auth";

type Props = {
  email: string | null | undefined;
  publishedCount: number;
  draftCount: number;
};

export default function AdminDashboard({ email, publishedCount, draftCount }: Props) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-bold text-[var(--sotw-text)] tracking-tight mb-1">
            管理画面
          </h1>
          <p className="text-sm text-[var(--sotw-text-2)]">{email}</p>
        </div>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="px-4 py-2 text-sm border border-[var(--sotw-border)] rounded-lg text-[var(--sotw-text-2)] hover:border-[var(--sotw-moss)] hover:text-[var(--sotw-moss)] transition-colors"
          >
            ログアウト
          </button>
        </form>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="p-6 bg-[var(--sotw-surface)] border border-[var(--sotw-border)] rounded-lg">
          <p className="text-sm text-[var(--sotw-text-2)] mb-1">公開済み記事</p>
          <p className="text-3xl font-bold text-[var(--sotw-text)]">{publishedCount}</p>
        </div>
        <div className="p-6 bg-[var(--sotw-surface)] border border-[var(--sotw-border)] rounded-lg">
          <p className="text-sm text-[var(--sotw-text-2)] mb-1">下書き</p>
          <p className="text-3xl font-bold text-[var(--sotw-text)]">{draftCount}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/posts"
          className="px-6 py-3 bg-[var(--sotw-moss)] text-white rounded-lg text-sm hover:bg-[var(--sotw-moss-hover)] transition-colors"
        >
          記事を管理する
        </Link>
        <Link
          href="/admin/categories"
          className="px-6 py-3 border border-[var(--sotw-border)] rounded-lg text-sm text-[var(--sotw-text-2)] hover:border-[var(--sotw-moss)] hover:text-[var(--sotw-moss)] transition-colors"
        >
          カテゴリを管理する
        </Link>
        <Link
          href="/admin/tags"
          className="px-6 py-3 border border-[var(--sotw-border)] rounded-lg text-sm text-[var(--sotw-text-2)] hover:border-[var(--sotw-moss)] hover:text-[var(--sotw-moss)] transition-colors"
        >
          タグを管理する
        </Link>
        <Link
          href="/admin/lps"
          className="px-6 py-3 border border-[var(--sotw-border)] rounded-lg text-sm text-[var(--sotw-text-2)] hover:border-[var(--sotw-moss)] hover:text-[var(--sotw-moss)] transition-colors"
        >
          LPを管理する
        </Link>
      </div>
    </div>
  );
}
