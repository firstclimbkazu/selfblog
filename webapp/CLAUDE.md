@AGENTS.md

## Reactコンポーネント設計方針

### page.tsxの役割
- **データフェッチのみ**を行い、JSXはコンポーネントに委譲する
- `generateMetadata` / `notFound` / `redirect` はpage.tsxに残してよい
- JSXの直書きは禁止。必ずnamed componentに抽出する

### ファイル分割の基準
- JSXが50行超 → 子コンポーネントへ分割
- `useState` が5個超 → カスタムフックへ抽出
- 外部ライブラリへの依存 → 専用コンポーネントに閉じ込める（例: `PostBody.tsx` に react-markdown を隔離）
- propsのバケツリレー2段以上 → Contextまたは設計見直し

### 命名・配置
- ページ固有コンポーネントはpage.tsxと**同階層**に配置
- 複数ページで使うものだけ `app/components/` に昇格
- 'use client' はインタラクションが必要な末端コンポーネントのみに付ける（Server/Client境界を最小化）

### Prismaの型
- `Prisma.XxxGetPayload<{ include: {...} }>` を使い、インラインany型を避ける
