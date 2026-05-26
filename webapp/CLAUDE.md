@AGENTS.md

## Git・デプロイルール

- `.gitignore` に含まれないファイルを変更する場合は、**必ずPRを作成してmainにマージ**する
- mainへの直接コミット・プッシュは禁止
- PRのチェックリスト: TypeScriptエラーなし・ESLintエラーなし・e2eテスト全パス

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

## 本番サイト更新フロー

### コンテンツ（記事・LP）をSQL経由で本番DBに投入する手順

1. **ローカルDockerDBからSQL生成**
   ```bash
   docker exec blog-db-1 bash -c 'psql -U postgres -d sotw_dev -tA -c "SELECT ..." > /tmp/output.sql'
   docker cp blog-db-1:/tmp/output.sql /tmp/output.sql
   ```

2. **Supabase SQL Editor に貼り付けてRUN**
   - supabase.com → プロジェクト → SQL Editor

3. **キャッシュ更新**
   - SQLで直接INSERTするとNext.jsキャッシュが更新されない
   - 本番の管理画面で対象レコードを開き「保存」を押してrevalidatePathを発火させる
   - 直接URLでアクセス可能: `/admin/lps/{id}/edit` や `/admin/posts/{id}/edit`

4. **画像がある場合**
   - 管理画面の画像タブからアップロード → Vercel Blob URLを取得
   - SQL EDITORでCSS/HTML内のローカルパスを`REPLACE()`で本番URLに更新

### SQLを生成する際の注意
- 記事・LPのstatusは必ず `'DRAFT'` で生成する（誤って本番公開しないため）
- 公開する場合は管理画面から手動でステータス変更する
