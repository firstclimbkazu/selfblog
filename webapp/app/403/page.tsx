import Link from "next/link";

export const metadata = { title: "403 — Still On The Wall" };

export default function ForbiddenPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center">
      <p className="text-6xl font-bold text-[var(--sotw-moss)] mb-4">403</p>
      <h1 className="text-xl font-bold text-[var(--sotw-text)] mb-2">アクセス権限がありません</h1>
      <p className="text-[var(--sotw-text-2)] mb-8">
        このページにアクセスするには管理者アカウントが必要です。
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-2 bg-[var(--sotw-moss)] text-white rounded-lg text-sm hover:bg-[var(--sotw-moss-hover)] transition-colors"
      >
        トップページへ戻る
      </Link>
    </div>
  );
}
