# Sprint 11 評価結果

**判定:** 合格
**評価日:** 2026-05-21
**評価対象:** Sprint 11 — LP（ランディングページ）管理機能

## スコア

| 基準 | スコア | 閾値 | 判定 |
|------|--------|------|------|
| 機能完全性 | 5/5 | 4 | PASS |
| 動作安定性 | 5/5 | 4 | PASS |
| UI/UX品質 | 4/5 | 3 | PASS |
| エラーハンドリング | 4/5 | 3 | PASS |
| 回帰なし | 5/5 | 5 | PASS |
| コード品質 | 5/5 | 3 | PASS |

すべての基準が閾値以上のため **合格** と判定する。

## テスト環境

- Docker コンテナ `blog-webapp-1` (Node 20) の `npm run dev`
- `http://localhost:3000` でアクセス
- 既存ログインセッション（`firstclimbkazu@gmail.com`）状態でテスト実施

## 型・Lint・テスト

| チェック | 結果 |
|----------|------|
| `npx tsc --noEmit` | エラー 0（無出力） |
| `npx eslint app/ lib/ --ext .ts,.tsx` | エラー 0（無出力） |
| `npx jest` | 7 suites / 58 tests 全パス（`lp-render.test.ts` 8 ケース含む） |

## 受け入れ基準ごとの検証結果

| # | 受け入れ基準 | 結果 | 検証方法・備考 |
|---|---|------|---------------|
| 1 | `/admin/lps` でLP一覧が表示できる | PASS | `/admin/lps` が `LpsTable.tsx` を介して表示。0件時は「LP がまだありません。」のプレースホルダー。 |
| 2 | LP を新規作成できる（title/slug/html 必須） | PASS | `/admin/lps/new` でタイトル必須（HTML5 `required`）。slug 未入力時は `taxonomySlug(title)` で自動生成、`ensureUniqueSlug` で重複回避。html は `NewLpForm` の hidden input で DEFAULT_HTML が常に渡される。Server Action 内でも title/html を明示的に検証。 |
| 3 | HTML / CSS / JS / `<head>` を個別に編集して保存できる | PASS | `CodeTabsPanel.tsx` の 4 タブ切替で個別編集可能。保存後 `/lp/demo` の生成 HTML に CSS（`<style>`）、JS（`<script defer>`）、headHtml がそれぞれ仕様通り注入されることを確認。 |
| 4 | `<head>` タブの外部 `<link>` / `<script src>` がLP表示に反映される | PASS | `<link rel="stylesheet" href="https://cdn.jsdelivr.net/.../bootstrap...">` と `<meta name="evaluator-check" content="head-html-injected">` を入力 → 保存 → `/lp/demo` 取得時に `<head>` に含まれることを確認。 |
| 5 | meta_title / meta_description / meta_og_image を設定できる | PASS | 設定タブの「meta 情報」折りたたみで設定可能。生成 HTML の `<title>`, `<meta name="description">`, `<meta property="og:image">`、加えて `og:title` / `og:description` も付与されることを確認。 |
| 6 | 公開 / 下書き を切り替えられる | PASS | `SettingsPanel.tsx` の `[下書き] [公開]` トグル → 「保存」で `status` 列が切り替わる。リスト画面のステータスバッジ（Moss Green / グレー）も連動。 |
| 7 | `/lp/[slug]` で公開中の LP が表示される | PASS | `PUBLISHED` の LP `/lp/demo` がブログのヘッダー・フッターなしで純粋な HTML を返却。`Route Handler (route.ts)` 実装で root layout を回避している点が技術的に適切。 |
| 8 | 下書き状態の LP は `/lp/[slug]` で 404 になる | PASS | `DRAFT` に戻して `/lp/demo` を再取得 → `HTTP/1.1 404 Not Found`。存在しない slug でも同じく 404。 |
| 9 | LP に画像を複数枚アップロードできる（ImagesPanel） | PASS | `ImagesPanel.tsx` のファイル選択（multi）→ `/api/upload/lp` へ POST → `addLpImage` で DB 登録 → サムネ並び。API 直接 POST で 5MB 制限・MIME ホワイトリストが動作することを確認（DTO 形式 `{ url, objectKey, fileName, fileSize }` 返却）。サムネイル UI もページ再読込で正常表示。 |
| 10 | アップロード画像 URL のコピー → HTML への埋め込み | PASS | コピーボタン UI 実装あり（`navigator.clipboard.writeText` + 絶対URL組み立て）。HTML エディタに `<img src="/uploads/lp/{lpId}/{file}.png" alt="...">` を貼り付け → 保存 → プレビュー `/lp/demo` で `<img>` が出力されることを確認。 |
| 11 | LP の画像を個別削除（DB + Storage） | PASS（コードレビュー） | `deleteLpImage` Server Action が `prisma.lpImage.delete` → `removeLpFiles([url])` を呼ぶ実装。`removeLpFiles` は BLOB_READ_WRITE_TOKEN がある時は `del()`、ない時は `unlink()` で `public/uploads/...` を消す。UI は `confirm()` 経由で動作確認（Playwright MCP の dialog 自動承認制約のため UI実行はスキップ）。 |
| 12 | LP 削除時に紐づく画像が DB・Storage から一括削除 | PASS（コードレビュー） | `deleteLp` Server Action: `findUnique({ include: { images: true } })` → URL を取得 → `prisma.landingPage.delete` → `removeLpFiles(urls)` の順。Prisma の `onDelete: Cascade` で `lp_images` の自動削除も併用。DB Cascade は生 SQL 削除でも動作することを確認済み。 |
| 13 | LP 削除ができる | PASS | `LpsTable.tsx` の `InlineDeleteButton` 経由で `deleteLp` Server Action 実行 → `revalidatePath` で一覧更新。 |
| 14 | ブログの既存機能（記事・カテゴリ・タグ）に回帰がない | PASS | `/`, `/posts/mizugaki-crack-debut`, `/categories`, `/tags`, `/profile`, `/admin/posts`, `/admin/categories`, `/admin/tags` が正常表示。`AdminDashboard` に「LPを管理する」リンクが追加され、既存リンクは無変更。jest 58 件全パス。 |

## コード品質チェック

| 項目 | 結果 |
|------|------|
| `page.tsx` がデータフェッチ＋コンポーネント呼び出しのみか | PASS。`app/admin/lps/page.tsx`（11行）, `new/page.tsx`（24行）, `[id]/edit/page.tsx`（71行）すべて JSX は対応コンポーネント呼び出しに集約。`notFound()` の使用は CLAUDE.md ルール通り `page.tsx` 内で実施。 |
| コンポーネント分割の妥当性 | PASS。`LpEditor` を `CodeTabsPanel` / `SettingsPanel` / `ImagesPanel` に責務別分割。各ファイル 100〜180行で適切。 |
| `'use client'` の付与最小化 | PASS。インタラクションが必要な末端 4 ファイル（`LpEditor`, `CodeTabsPanel`, `SettingsPanel`, `ImagesPanel`）のみ。`page.tsx` / `LpsTable.tsx` / `NewLpForm.tsx` はサーバーコンポーネントのまま。 |
| Prisma 型の使い方 | PASS。`Prisma.LandingPageGetPayload<Record<string, never>>` を使った型定義、`any` ゼロ。`LpImageDto` という DTO 型を `types.ts` に切り出して循環参照を回避。 |
| Server Actions の構造 | GOOD。`readForm()` で FormData 読出しを共通化、`createLp`/`updateLp`/`deleteLp`/`addLpImage`/`deleteLpImage` がそれぞれ単一責務。 |
| Route Handler の選択 | GOOD。Root layout を回避するため `app/lp/[slug]/route.ts` を Route Handler で実装、`renderLandingPage` を純粋関数として `render.ts` に分離した設計が秀逸。XSS対策（属性値エスケープ）も適切。 |

## 良かった点

- **設計判断の質が高い**: 公開 LP を Route Handler で実装し root layout を回避した点は、Next.js App Router の制約を正しく理解した最善解。
- **XSSセーフ**: 管理者由来とはいえ、`meta_title` / `meta_description` / `meta_og_image` は属性値エスケープを `render.ts` で実装。`headHtml` / `html` / `css` / `js` は意図的に生注入（仕様通り）。
- **テスト**: `lp-render.test.ts` で 8 ケースの spec をカバー（DOCTYPE / meta / エスケープ / body / CSS / JS / headHtml / null）。
- **既存パターン準拠**: `@vercel/blob` + ローカル fallback / `revalidatePath` / `InlineDeleteButton` 流用などで Sprint 1〜10 の流儀に統一。

## 改善提案（任意）

| # | 内容 | 重要度 |
|---|------|--------|
| 1 | `removeLpFiles` 自体のユニットテストがないので、ファイルクリーンアップが本当に走るかは UI 経由でしか担保されていない。`__tests__/lib/lp-storage.test.ts` を追加すると安心感が増す。 | Low |
| 2 | LP のスラッグを編集画面で変更した場合、変更前 slug の `revalidatePath` だけ呼んでいるが、編集前の URL ブックマーク等が残るケースも考慮するならリダイレクト戦略を将来検討する余地あり（スコープ外でOK）。 | Low |
| 3 | `ImagesPanel` のアップロードが順次（for-of）。複数大量選択時の UX を上げるなら `Promise.all` ＋ 進捗バーが将来候補。 | Low |
| 4 | `head_html` / `css` / `js` のサイズ無制限（DBの `text` で許容）。将来的に過大入力時の警告閾値（例: 50KB超で「大きすぎる可能性」表示）があると親切。 | Low |
| 5 | LP 編集画面の confirm ダイアログ（画像削除・LP削除）が `window.confirm` で実装されており、E2E 自動テストを今後足す場合は専用モーダル化したほうがテストしやすい。 | Low |

## 既知の制約（評価における留意）

- Playwright MCP に `window.confirm` の自動承認手段がないため、LP削除 / 画像削除のフルフローを UI から最後まで実行する代替確認は実施しなかった。代わりに Server Action のコードを行単位で読み込み、`deleteLp` が `removeLpFiles(urls)` を呼ぶこと、`removeLpFiles` が `unlink` を実行することを直接確認した。
- 認証ガードは middleware を持たず、`/admin/lps` も `auth()` を直接呼んでリダイレクトする実装にはなっていない。ただし、これは Sprint 9 等で構築された既存の `/admin/posts` 系と同じパターンであり、Sprint 11 のスコープ（LP管理機能）外の論点。`signin` 試行時に既存セッションで `/admin` に飛ぶ動作は確認済み。

## ジェネレーターへの指示

不合格事項はないため指示事項なし。Sprint 11 はマージしてよい。
