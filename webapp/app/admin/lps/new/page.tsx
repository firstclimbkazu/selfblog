import Link from "next/link";
import { createLp } from "../actions";
import NewLpForm from "./NewLpForm";

export const metadata = { title: "新規LP作成 — Still On The Wall" };

export default function NewLpPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--sotw-text)] tracking-tight mb-1">
          新規LP作成
        </h1>
        <Link
          href="/admin/lps"
          className="text-sm text-[var(--sotw-text-2)] hover:text-[var(--sotw-moss)]"
        >
          ← LP一覧へ
        </Link>
      </div>
      <NewLpForm action={createLp} />
    </div>
  );
}
