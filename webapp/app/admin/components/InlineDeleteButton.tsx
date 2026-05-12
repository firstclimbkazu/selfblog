"use client";

type Props = {
  label: string;
  action: () => Promise<void>;
};

export default function InlineDeleteButton({ label, action }: Props) {
  async function handleClick() {
    if (!confirm(`「${label}」を削除しますか？`)) return;
    await action();
    window.location.reload();
  }

  return (
    <button
      onClick={handleClick}
      className="text-xs text-red-500 hover:text-red-700 transition-colors"
    >
      削除
    </button>
  );
}
