import Link from "next/link";

export default function ProfileView() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-20 h-20 rounded-full bg-[var(--sotw-moss-bg)] flex items-center justify-center flex-shrink-0">
          <div className="w-8 h-8 bg-[var(--sotw-moss)] rounded-sm" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--sotw-text)] tracking-tight">
            firstclimb kazu
          </h1>
          <p className="text-sm text-[var(--sotw-text-2)] mt-0.5">Still On The Wall</p>
        </div>
      </div>

      <div className="h-px bg-[var(--sotw-border)] mb-8" />

      <div className="prose prose-stone max-w-none mb-10">
        <p>都市に生き、岩壁を登る。そのどちらも手放せないアラフィフ。</p>
        <p>
          平日は東京のオフィス街を歩き、週末は岩場やジムで壁に向かう。
          建築・都市・テクノロジーと、クライミング・登山・自然——
          一見かけ離れたふたつの世界を往復しながら、そこに共通する何かを探している。
        </p>
        <p>
          「Still On The Wall」は、壁から降りずにいること、
          そして思考し続けることへの、静かな宣言です。
        </p>
        <hr />
        <h3>エンジニアとして</h3>
        <p>
          TypeScript / React / Next.js を軸に、フロントエンド開発を専門とするフリーランスエンジニア。
          SIer出身で20年超の開発経験を持ち、現在はAI（Claude Code）を活用した開発プロセスの
          自動化にも取り組んでいます。案件・相談はお気軽にどうぞ。
        </p>
        <p>スキル: TypeScript / React / Next.js / PHP / Laravel / Claude Code</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href="https://github.com/firstclimbkazu"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--sotw-border)] rounded-full text-sm text-[var(--sotw-text-2)] hover:border-[var(--sotw-moss)] hover:text-[var(--sotw-moss)] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          GitHub
        </a>
        <a
          href="https://x.com/Stillonthewall"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--sotw-border)] rounded-full text-sm text-[var(--sotw-text-2)] hover:border-[var(--sotw-moss)] hover:text-[var(--sotw-moss)] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          @Stillonthewall
        </a>
        <a
          href="mailto:still-on-the-wall@firstclimb.net"
          className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--sotw-border)] rounded-full text-sm text-[var(--sotw-text-2)] hover:border-[var(--sotw-moss)] hover:text-[var(--sotw-moss)] transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          Contact
        </a>
      </div>

      <div className="mt-10 pt-8 border-t border-[var(--sotw-border)]">
        <Link href="/" className="text-sm text-[var(--sotw-text-2)] hover:text-[var(--sotw-moss)] transition-colors">
          ← 記事一覧へ
        </Link>
      </div>
    </div>
  );
}
