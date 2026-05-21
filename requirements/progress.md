# 進捗記録

## Sprint 11: LP（ランディングページ）管理機能
**ステータス:** 実装完了 - 評価待ち
**実装日:** 2026-05-21

### 実装内容

#### データ層
- `prisma/schema.prisma` に `LandingPage` モデル / `LpImage` モデル / `LpStatus` enum を追加
- マイグレーション `20260521094055_add_landing_pages` を作成・適用
- `LpImage.lp_id` は `onDelete: Cascade` を設定（LP削除時に DB レコードを自動削除）

#### 公開LP `/lp/[slug]`
- `app/lp/[slug]/route.ts` — **Route Handler** で実装し、ブログの RootLayout を完全に回避して独立 HTML を返却
- `app/lp/[slug]/render.ts` — `<!DOCTYPE html>` から組み立てる純粋関数。XSS対策として title / description / og:image 等の属性値はエスケープ。HTML / CSS / JS / headHtml は仕様通りそのまま注入
- DRAFT 状態の LP は 404 Not Found を返却
- `Cache-Control: no-store` で常に最新を返す（編集→即反映を担保）

#### 管理画面
- `app/admin/lps/page.tsx` + `LpsTable.tsx` — LP 一覧（タイトル / スラッグ / 状態バッジ / 更新日 / プレビュー・編集・削除）
- `app/admin/lps/new/page.tsx` + `NewLpForm.tsx` — 新規作成（タイトル＋任意スラッグのみ。作成直後に編集画面へ遷移）
- `app/admin/lps/[id]/edit/page.tsx` + 以下のクライアントコンポーネント:
  - `LpEditor.tsx` — 2カラム（左7/右3）レイアウトのコンテナ。Server Action と useTransition で保存
  - `CodeTabsPanel.tsx` — `HTML / CSS / JS / <head>` の4タブ切り替え。`<textarea>` ＋ font-mono ＋ h-[60vh]
  - `SettingsPanel.tsx` — タイトル・スラッグ・ステータストグル・meta 折りたたみ・保存・プレビュー
  - `ImagesPanel.tsx` — 複数アップロード／3列サムネイルグリッド／ホバーでURLコピー・削除
- `AdminDashboard.tsx` に「LPを管理する」リンクを追加

#### 画像アップロード
- `app/api/upload/lp/route.ts` — Storage パス `lp/{lpId}/{uuid}.{ext}` を採用（仕様通り）
  - 既存の `/api/upload` と同じパターン（Vercel Blob 本番 / ローカル `public/uploads` フォールバック）
  - 5MB 上限・MIME ホワイトリスト（JPEG/PNG/WebP/GIF）
- `app/admin/lps/actions.ts` — `createLp` / `updateLp` / `deleteLp` / `addLpImage` / `deleteLpImage` Server Actions
- `lib/lp-storage.ts` — Storage（Vercel Blob OR ローカルファイル）からの一括削除ヘルパー
- LP 削除時は `LpImage` 経由で全画像 URL を取得 → DB Cascade 削除 → Storage 削除を実行

#### テスト
- `__tests__/lib/lp-render.test.ts` — 8 ケース（DOCTYPE / meta / エスケープ / body生注入 / CSS / JS / headHtml / null時の省略）
- 全 7 スイート / 58 テスト パス

### 自己評価

| 基準 | スコア (1-5) | コメント |
|------|-------------|---------|
| 機能完全性 | 5 | 受け入れ基準14項目すべてを満たす実装。公開LP・DRAFT 404・画像アップロード/削除・LP削除時のStorage一括削除まで対応 |
| コード品質 | 5 | 大きなクライアントコンポーネントは `LpEditor` → `CodeTabsPanel` / `SettingsPanel` / `ImagesPanel` に分割。`Prisma.LandingPageGetPayload` を使い `any` 型ゼロ。typecheck・lint エラーゼロ |
| UI/UX | 4 | 2カラム＋4タブ＋設定/画像トグル＋ホバーURLコピーまで仕様準拠。CodeMirror等の本格的なエディタは導入しなかったが、`<textarea>` + font-mono で十分実用的 |
| エラーハンドリング | 4 | 必須項目検証・5MB制限・MIMEホワイトリスト・存在しないLP/画像のエラー・Storage削除失敗時の握りつぶしを実装。クリップボード未対応ブラウザのフォールバックは未実装（最近のブラウザでは問題なし） |
| 既存機能との統合 | 5 | 既存記事・カテゴリ・タグ・認証フローに変更なし。/admin/posts /admin/categories などの既存ルートが200/307を返すことを確認。既存テスト58件すべてパス |

### 技術的な判断

1. **`/lp/[slug]` は Page ではなく Route Handler（`route.ts`）で実装**  
   Next.js App Router では `app/layout.tsx`（root layout）が必ず全 Page を `<html><body>` で包んでしまうため、Page で完全独立 HTML を返すことは不可能。  
   Route Handler は raw `Response` を返すため Layout ツリーを通らず、これがブログレイアウト外で完全独立 HTML を返す最も筋の良い解。  
   （別解: ルートグループで複数 root layout 化する案もあったが、既存ファイル構造への影響が大きすぎるため不採用）

2. **Storage バックエンド**  
   仕様には「Supabase Storage」と記載されているが、既存の `app/api/upload/route.ts` は実際には `@vercel/blob` ＋ ローカルファイル fallback で実装されている（プロジェクトに Supabase Storage クライアントの導入実績なし）。  
   既存パターンとの整合性を最優先し、同じ `@vercel/blob` ＋ローカル fallback で実装。**パス命名 `lp/{lpId}/{uuid}.{ext}` だけは仕様通り**に踏襲し、将来 Supabase Storage へ移行する際もパス互換となるようにした。

3. **「公開」「下書き」の保存と即時切り替え**  
   ステータスはトグル UI（DRAFT/PUBLISHED）で、保存ボタン押下時にまとめて反映する方式を採用。専用 toggle Server Action を作るより、フォーム送信1本に集約した方が状態管理がシンプル。

4. **HTML/CSS/JS のサニタイズなし**  
   このLP管理機能の利用者は管理者本人のみ（`ADMIN_EMAIL` で1人に絞られている）。仕様の意図は「Webポートフォリオを任意の HTML/CSS/JS で組み立てる」ことなので、サニタイズは行わない。  
   一方で **meta_title / meta_description / meta_og_image** はユーザー由来文字列でも属性値として安全に出力する必要があるため、`render.ts` で属性エスケープを実装。

5. **画像 `<Image>` に `unoptimized`**  
   ローカル `/uploads/...` パスや任意のリモート URL を `next/image` に渡すと domain 制限に引っかかるため、管理画面のサムネイルは `unoptimized` で素直に出す（管理画面サイズなのでパフォーマンス影響は無視できる）。

### 既知の課題

- **TopページなどブログUIに LP 一覧導線はない**: 仕様にも要件として書かれていない（管理画面からのみ作成・公開ができる前提）。
- **画像の最適化**: `next/image` の `unoptimized` を使っているため、本番でも管理画面サムネイルは最適化されない（ただし管理画面のみなので影響軽微）。
- **クリップボード API**: `navigator.clipboard.writeText` は HTTPS / localhost でのみ動作。本番想定では問題ないが、IP直アクセス等では失敗する可能性がある。

### エバリュエーターへの引き渡し

- **起動方法**: `docker exec blog-webapp-1 sh -c "cd /app && npm run dev"`（コンテナ `blog-webapp-1` は既に dev server 起動済み）
- **テスト対象URL**:
  - 管理画面: `http://localhost:3000/admin/lps`（Google OAuth 認証が必要）
  - 新規作成: `http://localhost:3000/admin/lps/new`
  - 編集: `http://localhost:3000/admin/lps/{id}/edit`
  - 公開LP: `http://localhost:3000/lp/{slug}`

- **テストシナリオ**:
  1. 管理ダッシュボード（`/admin`）に「LPを管理する」ボタンが出る → クリックで `/admin/lps` に遷移
  2. `/admin/lps` 右上の「新規作成」をクリック → タイトル「Demo」を入力して「作成して編集へ」
  3. 編集画面の HTML タブにテンプレートが入っていることを確認。CSS / JS / `<head>` タブに切り替えて入力可能なことを確認
  4. 右パネル「設定」タブで、ステータスを「公開」にし、「保存」をクリック
  5. 「プレビュー（別タブ）」リンクから `/lp/demo` が開き、入力した HTML/CSS がブログレイアウト**なし**で表示されることを確認
  6. 右パネル「画像」タブに切り替え、JPG/PNG/WebP を複数選択してアップロード → サムネイルが並ぶことを確認
  7. サムネイルにホバー → 「URLコピー」をクリック → クリップボードに完全URLが入る
  8. HTML タブで `<img src="（コピーしたURL）" alt="test">` を入れて保存 → プレビューに画像が表示される
  9. サムネイルにホバー → 「削除」 → 確認ダイアログ → 削除（DB と Storage 両方から消える）
  10. ステータスを「下書き」に戻して保存 → `/lp/demo` が **404 Not Found** になる
  11. `/admin/lps` に戻り、LP の「削除」をクリック → DB の LpImage および Storage の画像も全て削除されることを確認
  12. 既存機能の回帰確認: `/`, `/posts/{slug}`, `/categories`, `/admin/posts` が正常表示されること
- **引き渡し前チェック結果**:
  - `npx tsc --noEmit` → エラーゼロ
  - `npx eslint app/ lib/ --ext .ts,.tsx` → エラーゼロ
  - `npx jest` → 7 suites / 58 tests pass
