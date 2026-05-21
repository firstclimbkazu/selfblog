const DEFAULT_HTML = `<main style="max-width:720px;margin:64px auto;padding:24px;font-family:system-ui,sans-serif;">
  <h1>New Landing Page</h1>
  <p>編集画面で HTML / CSS / JS を自由に書き換えてください。</p>
</main>
`;

type Props = {
  action: (formData: FormData) => Promise<void>;
};

export default function NewLpForm({ action }: Props) {
  return (
    <form action={action} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[var(--sotw-text)] mb-1">
          タイトル（管理用）
        </label>
        <input
          name="title"
          type="text"
          required
          className="w-full px-3 py-2 border border-[var(--sotw-border)] rounded-lg text-[var(--sotw-text)] bg-[var(--sotw-bg)] focus:outline-none focus:border-[var(--sotw-moss)]"
          placeholder="例: 案件Aの提案ページ"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--sotw-text)] mb-1">
          スラッグ（任意 / 未入力ならタイトルから生成）
        </label>
        <div className="flex items-stretch">
          <span className="px-3 py-2 border border-r-0 border-[var(--sotw-border)] rounded-l-lg bg-[var(--sotw-surface-alt)] text-sm text-[var(--sotw-text-2)] font-mono">
            /lp/
          </span>
          <input
            name="slug"
            type="text"
            className="flex-1 px-3 py-2 border border-[var(--sotw-border)] rounded-r-lg text-[var(--sotw-text)] bg-[var(--sotw-bg)] font-mono text-sm focus:outline-none focus:border-[var(--sotw-moss)]"
            placeholder="example-page"
          />
        </div>
      </div>

      <input type="hidden" name="html" value={DEFAULT_HTML} />
      <input type="hidden" name="status" value="DRAFT" />

      <div className="pt-2 flex items-center gap-4">
        <button
          type="submit"
          className="px-6 py-2 bg-[var(--sotw-moss)] text-white rounded-lg text-sm hover:bg-[var(--sotw-moss-hover)] transition-colors"
        >
          作成して編集へ
        </button>
      </div>
    </form>
  );
}
