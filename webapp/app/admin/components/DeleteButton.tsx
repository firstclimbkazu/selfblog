"use client";

import { deleteArticle } from "../actions";

export default function DeleteButton({ id, title }: { id: string; title: string }) {
  async function handleDelete() {
    if (!confirm(`「${title}」を削除しますか？この操作は取り消せません。`)) return;
    await deleteArticle(id);
    window.location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-red-500 hover:text-red-700 transition-colors"
    >
      削除
    </button>
  );
}
