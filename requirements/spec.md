# Still On The Wall 製品仕様書

## 概要

「Still On The Wall」は、都市と自然を往復するアラフィフの知的好奇心を発信する個人ブログ。
IT・山・サブカル・ランニング・日々のニュース・日記を多面的に語る。

- **ドメイン**: stillonthewall.com
- **技術スタック**: Next.js（React）/ Vercel / Supabase（PostgreSQL + Storage）/ NextAuth.js（Google OAuth）/ Prisma
- **リポジトリ**: GitHub

---

## コア機能一覧

| # | 機能名 | 説明 | 優先度 |
|---|--------|------|--------|
| 1 | 記事一覧表示 | トップページに公開済み記事をカード形式で表示 | 高 |
| 2 | 記事詳細表示 | Markdownで書かれた記事本文をレンダリング | 高 |
| 3 | カテゴリ分類 | 記事をカテゴリ別に分類・絞り込み | 高 |
| 4 | タグ分類 | 記事に複数タグを付与・絞り込み | 高 |
| 5 | 管理者認証 | Google OAuth（NextAuth.js）で指定 Google アカウントのみ管理画面にアクセス可 | 高 |
| 6 | 記事作成・編集 | Markdownエディタで記事を作成・編集・下書き保存 | 高 |
| 7 | サムネイル画像アップロード | Supabase Storageへ画像をアップロード | 高 |
| 8 | カテゴリ管理 | カテゴリの作成・編集・削除 | 中 |
| 9 | タグ管理 | タグの作成・編集・削除 | 中 |
| 10 | プロフィールページ | ブログ運営者の自己紹介ページ | 中 |
| 11 | ライト／ダークモード | システム設定に連動したカラーテーマ切り替え | 中 |

---

## スプリント計画

### Sprint 0: ローカル開発環境構築

**ゴール:**
Docker Compose で PostgreSQL + Supabase Studio のみを起動し、Next.js から直接 DB に接続できる状態を作る。
GoTrue / PostgREST など Supabase Auth / REST レイヤーは使用しない。

**構成:**
```
Docker Compose
├── db       PostgreSQL 15（ポート 5432）
└── studio   Supabase Studio（ポート 8080）

Next.js dev server（ポート 3000）
└── Prisma（または Drizzle ORM）経由で db に直接接続
```

**機能:**
- [ ] Docker Desktop のインストール確認
- [ ] `docker-compose.yml` を作成し、以下の 2 サービスのみ定義する
  - `db`：PostgreSQL 15（ポート 5432）
  - `studio`：Supabase Studio（ポート 8080、`db` に接続）
- [ ] `docker compose up` で 2 コンテナを起動する
- [ ] Studio（`http://localhost:8080`）でテーブル・データを GUI 管理できることを確認する
- [ ] `create-next-app` で Next.js プロジェクトを初期化する
  - TypeScript、App Router、Tailwind CSS を有効化
- [ ] ORM（Prisma 推奨）をインストールし、ローカル PostgreSQL に接続する
- [ ] `.env.local` に `DATABASE_URL`（PostgreSQL 接続文字列）を設定する
- [ ] Next.js 開発サーバー（`npm run dev`）が起動する
- [ ] Google Cloud Console で OAuth 2.0 クライアントを作成し、`.env.local` に設定する
  - リダイレクト URI：`http://localhost:3000/api/auth/callback/google`

**受け入れ基準:**
- `docker compose up` を実行後、`docker compose ps` で `db` と `studio` が `running` 状態になる
- ブラウザで `http://localhost:8080` にアクセスすると Supabase Studio のダッシュボードが表示される
- `http://localhost:3000` にアクセスすると Hello World ページが表示される（Playwright で確認）
- `npx prisma db pull`（または `prisma migrate dev`）が成功し、DB との接続が確認できる
- Google Cloud Console で OAuth 2.0 クライアントを作成済みで、リダイレクト URI に `http://localhost:3000/api/auth/callback/google` が登録されている

---

### Sprint 1: データ基盤とトップページ（記事一覧）

**ゴール:**
Supabase にテーブルを作成し、サンプル記事をトップページに一覧表示できる状態にする。

**機能:**
- [ ] Supabase Studio でテーブルを作成する（Article / Category / Tag / article_tags）
- [ ] サンプルデータ（カテゴリ3件、記事5件）を投入する
- [ ] トップページ（`/`）に公開済み記事をカード形式で表示する
  - サムネイル画像、タイトル、公開日、カテゴリ名を表示
- [ ] 記事カードをクリックすると記事詳細ページへ遷移する

**受け入れ基準:**
- トップページにアクセスすると記事カードが1件以上表示される（Playwright で確認）
- 各記事カードにタイトル・公開日・カテゴリ名が表示されている
- `status = 'draft'` の記事はトップページに表示されない
- 記事カードをクリックすると `/posts/[slug]` にページ遷移する

---

### Sprint 2: 記事詳細ページ

**ゴール:**
Markdown で書かれた記事本文を整形して表示できる状態にする。

**機能:**
- [ ] 記事詳細ページ（`/posts/[slug]`）を作成する
- [ ] Markdown 本文を HTML にレンダリングして表示する
- [ ] タイトル、サムネイル画像、公開日、カテゴリ、タグを表示する
- [ ] ページ内に「← 一覧へ戻る」リンクを設置する

**受け入れ基準:**
- `/posts/[slug]` にアクセスすると記事本文が表示される（Playwright で確認）
- Markdown の見出し（`#`）が `<h1>〜<h6>` としてレンダリングされる
- 存在しない slug にアクセスすると 404 ページが表示される
- 「← 一覧へ戻る」リンクをクリックするとトップページに戻る

---

### Sprint 3: カテゴリ・タグによる絞り込み

**ゴール:**
カテゴリ別・タグ別の記事一覧ページを作り、読者が興味のある記事を探せるようにする。

**機能:**
- [ ] カテゴリ一覧ページ（`/categories`）を作成する
- [ ] カテゴリ別記事一覧ページ（`/categories/[slug]`）を作成する
- [ ] タグ一覧ページ（`/tags`）を作成する
- [ ] タグ別記事一覧ページ（`/tags/[slug]`）を作成する
- [ ] 記事カードのカテゴリ名・タグ名をクリックすると各一覧ページへ遷移する
- [ ] ナビゲーションバーにカテゴリ一覧へのリンクを追加する

**受け入れ基準:**
- `/categories` にアクセスするとカテゴリ一覧が表示される（Playwright で確認）
- カテゴリをクリックすると `/categories/[slug]` に遷移し、そのカテゴリの記事のみ表示される
- `/tags` にアクセスするとタグ一覧が表示される
- タグをクリックすると `/tags/[slug]` に遷移し、そのタグの記事のみ表示される
- 記事が0件のカテゴリ・タグ一覧ページには「記事がまだありません」と表示される

---

### Sprint 4: 管理者認証（Google OAuth）

**ゴール:**
NextAuth.js（Auth.js v5）+ Google OAuth で管理画面を保護する。
ログインページは作らず、`/admin` へのアクセスで即 Google 認証画面にリダイレクトする。
指定した Google アカウント 1 件のみ管理画面に入れる。

**機能:**
- [ ] `next-auth` をインストールし、Google Provider を設定する
- [ ] Google Cloud Console で OAuth 2.0 クライアントを作成し、クライアント ID / シークレットを取得する
- [ ] `.env.local` に以下を追加する
  - `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`（Google OAuth クライアント情報）
  - `AUTH_SECRET`（NextAuth セッション署名用ランダム文字列）
  - `ADMIN_EMAIL`（許可する Google アカウントのメールアドレス）
- [ ] Next.js middleware（`middleware.ts`）で `/admin/*` を保護する
  - 未認証 → Google 認証画面へリダイレクト（ログインページは作らない）
  - 認証済みだが `ADMIN_EMAIL` と不一致 → 403 ページへ
- [ ] ログアウト機能をナビゲーションに追加する

**受け入れ基準:**
- 未ログイン状態で `/admin` にアクセスすると Google の OAuth 同意画面にリダイレクトされる（Playwright で確認）
- 許可された Google アカウントで認証すると `/admin` ダッシュボードに遷移する
- 許可されていない Google アカウントで認証すると 403 ページが表示される
- ログアウトボタンをクリックするとセッションが破棄され、`/admin` に再アクセスすると Google 認証画面に戻る
- Supabase Auth は一切使用しない（DB・Storage のみ Supabase を利用）

---

### Sprint 5: 記事作成・編集機能

**ゴール:**
管理画面から記事を作成・編集・下書き保存・公開できるようにする。

**機能:**
- [ ] 記事一覧管理ページ（`/admin/posts`）を作成する
- [ ] 記事作成ページ（`/admin/posts/new`）を作成する
  - タイトル入力、Markdown エディタ、カテゴリ選択、タグ選択
  - 「下書き保存」「公開」ボタン
- [ ] 記事編集ページ（`/admin/posts/[id]/edit`）を作成する
- [ ] Markdown プレビューをエディタ横に表示する
- [ ] 記事の削除機能を実装する（確認ダイアログ付き）

**受け入れ基準:**
- 記事作成ページでタイトルと本文を入力して「公開」を押すとトップページに記事が表示される（Playwright で確認）
- 「下書き保存」を押すと `status = 'draft'` で保存され、トップページには表示されない
- 記事編集ページでタイトルを変更して保存すると、詳細ページに反映される
- 削除確認ダイアログで「キャンセル」を押すと記事は削除されない
- 削除確認ダイアログで「削除」を押すと記事が一覧から消える

---

### Sprint 6: サムネイル画像アップロード

**ゴール:**
記事作成・編集時にサムネイル画像を Supabase Storage にアップロードし、記事カードに表示できるようにする。

**機能:**
- [ ] 記事作成・編集ページに画像アップロードフィールドを追加する
- [ ] アップロードした画像を Supabase Storage に保存する
- [ ] 保存した画像の URL を記事の `thumbnail_url` に設定する
- [ ] トップページと記事詳細ページでサムネイル画像を表示する
- [ ] 画像未設定時はデフォルトのプレースホルダー画像を表示する

**受け入れ基準:**
- 記事作成時に画像ファイルを選択してアップロードボタンを押すと、プレビューが表示される（Playwright で確認）
- 記事を公開するとトップページの記事カードにサムネイルが表示される
- 画像が設定されていない記事カードにはプレースホルダー画像が表示される
- 5MB を超えるファイルをアップロードしようとするとエラーメッセージが表示される

---

### Sprint 7: カテゴリ・タグ管理

**ゴール:**
管理画面からカテゴリとタグを自由に追加・編集・削除できるようにする。

**機能:**
- [ ] カテゴリ管理ページ（`/admin/categories`）を作成する
  - カテゴリ一覧表示、作成フォーム、編集・削除機能
- [ ] タグ管理ページ（`/admin/tags`）を作成する
  - タグ一覧表示、作成フォーム、編集・削除機能
- [ ] slug は名前から自動生成する（日本語対応、重複チェック）

**受け入れ基準:**
- カテゴリ管理ページで新しいカテゴリ名を入力して追加ボタンを押すと一覧に表示される（Playwright で確認）
- 同名のカテゴリを作成しようとするとエラーメッセージが表示される
- 記事が紐づいているカテゴリを削除しようとするとエラーメッセージが表示される
- タグについても同様の追加・削除が行える

---

### Sprint 8: プロフィールページとナビゲーション整備

**ゴール:**
プロフィールページを作成し、サイト全体のナビゲーションを整える。

**機能:**
- [ ] プロフィールページ（`/profile`）を作成する
  - 自己紹介テキスト、アイコン画像、SNS リンク
- [ ] グローバルナビゲーションバーを実装する
  - ロゴ（サイト名）、カテゴリ一覧リンク、プロフィールリンク
- [ ] フッターを実装する（サイト名、コピーライト）
- [ ] モバイル表示対応のハンバーガーメニューを実装する

**受け入れ基準:**
- `/profile` にアクセスするとプロフィールページが表示される（Playwright で確認）
- ナビゲーションバーのロゴをクリックするとトップページに遷移する
- モバイル幅（375px）でハンバーガーメニューアイコンが表示される
- ハンバーガーメニューを開くとナビゲーションリンクが縦並びに表示される

---

### Sprint 9: デザインシステム適用とライト／ダークモード

**ゴール:**
Figma デザインシステムに基づいた配色・タイポグラフィを適用し、ライト／ダークモードを実装する。

**機能:**
- [ ] Tailwind CSS に Warm Stone × Moss Green × Warm Amber のカラーパレットを設定する
- [ ] システムの prefersDarkMode に連動したダークモード切り替えを実装する
- [ ] ダークモード切り替えトグルボタンをナビゲーションバーに追加する
- [ ] 全ページにデザインシステムのタイポグラフィ（フォントサイズ・行間）を適用する
- [ ] 記事カード・ボタン・フォームコンポーネントをデザインシステムに合わせてスタイリングする

**受け入れ基準:**
- ダークモードトグルをクリックするとページ全体が dark テーマに切り替わる（Playwright で確認）
- ページをリロードしてもモード設定が保持される
- システムがダークモードに設定されている場合、初期表示がダークモードになる
- トップページがモバイル（375px）・タブレット（768px）・デスクトップ（1280px）いずれも崩れない

---

### Sprint 10: Vercel デプロイと本番環境設定

**ゴール:**
Vercel に本番デプロイし、stillonthewall.com でアクセスできる状態にする。

**機能:**
- [ ] GitHub リポジトリに push し、Vercel と連携する
- [ ] Vercel の環境変数に本番 Supabase の接続情報を設定する
- [ ] カスタムドメイン（stillonthewall.com）を設定する
- [ ] HTTPS が有効であることを確認する
- [ ] 本番環境の Supabase にテーブルと初期データを投入する
- [ ] main ブランチへの push で自動デプロイされることを確認する

**受け入れ基準:**
- `https://stillonthewall.com` にアクセスするとトップページが表示される（Playwright で確認）
- `http://` でアクセスすると `https://` にリダイレクトされる
- トップページの表示が 3 秒以内に完了する（Lighthouse の LCP 基準）
- GitHub の main ブランチに push すると Vercel で自動デプロイが開始される

---

## UI/UX 要件

### デザインコンセプト
- **テーマ**: "Basecamp" — 都市と自然の間の基地
- **カラーパレット**: Warm Stone（背景）× Moss Green（アクセント）× Warm Amber（CTA）
- **モード**: ライト / ダーク両対応（システム設定連動 ＋ 手動切り替え）
- **Figma デザインシステム**: https://www.figma.com/design/LIFRo8BgG1gYN3xyVkYjbm
- **Figma ワイヤーフレーム**: https://www.figma.com/design/x7QVkhxdw4CR4fRZbjMRYB

### レスポンシブ対応
- モバイル（375px〜）/ タブレット（768px〜）/ デスクトップ（1280px〜）の3ブレークポイント
- モバイルファーストで実装する

### アクセシビリティ
- 画像には適切な `alt` テキストを設定する
- キーボードナビゲーションが機能する
- コントラスト比 WCAG AA 基準を満たす

---

## 非機能要件

| 区分 | 要件 |
|------|------|
| パフォーマンス | トップページの LCP 3秒以内（Vercel Edge + ISR 活用） |
| セキュリティ | 管理画面は Google OAuth 必須（NextAuth.js）。許可メールアドレスは環境変数で管理。Supabase RLS で公開データのみ読み取り可 |
| SEO | 各ページに `<title>` と `<meta description>` を設定。OGP 対応 |
| 可用性 | Vercel / Supabase の SLA に準拠 |
| バックアップ | Supabase の自動バックアップを利用 |
| モニタリング | Vercel Analytics でページビューを計測 |

---

## アーキテクチャ方針

| 用途 | ローカル | 本番（Vercel / Supabase cloud） |
|---|---|---|
| DB | Docker（PostgreSQL 15） | Supabase cloud（PostgreSQL） |
| DB 管理 GUI | Docker（Supabase Studio） | Supabase cloud（Studio） |
| DB アクセス | Prisma ORM（直接接続） | Prisma ORM（直接接続） |
| 認証 | NextAuth.js + Google OAuth | NextAuth.js + Google OAuth |
| 画像ストレージ | 本番 Supabase Storage を利用 | Supabase Storage |
| ホスティング | — | Vercel |

> **Supabase Auth / PostgREST / GoTrue は使用しない。**

---

## エラーページ

| ページ | URL | 説明 |
|---|---|---|
| 404 | （Next.js `not-found.tsx`） | ページが見つからない場合 |
| 500 | （Next.js `error.tsx`） | サーバーエラー発生時 |

- 404: Moss Green アクセント、「← トップへ戻る」「前のページへ」ボタン
- 500: Warm Amber アクセント、「← トップへ戻る」「再読み込みする」ボタン
- Figma デザインシステムファイルに Desktop / Mobile 各2画面を追加済み

---

---

### Sprint 11: LP（ランディングページ）管理機能

> 関連 Issue: [#1 LP管理画面を作りたい](https://github.com/firstclimbkazu/selfblog/issues/1)

**ゴール:**
Web制作のポートフォリオとして使える LP を、管理画面から HTML / CSS / JS で作成・編集・公開できるようにする。

---

#### データモデル

**LpImage テーブル** (`lp_images`) — LP画像管理

| フィールド | 型 | 説明 |
|---|---|---|
| id | uuid (PK) | 自動生成 |
| lp_id | uuid (FK) | LandingPage.id（onDelete: Cascade） |
| public_url | string | Supabase Storage 公開URL |
| file_name | string | 表示用ファイル名 |
| file_size | int? | bytes |
| created_at | timestamp | アップロード日時 |

> **Storageパス**: `lp/{lpId}/{uuid}.{ext}`
> 既存の `thumbnails/` と同一バケット内で `lp/` プレフィックスで分離。
> LP削除時は `onDelete: Cascade` で DB レコードを自動削除し、
> Server Action 内で `supabase.storage.remove()` を呼んでファイルも削除する。

---

**LandingPage テーブル** (`landing_pages`)

| フィールド | 型 | 説明 |
|---|---|---|
| id | uuid (PK) | 自動生成 |
| title | string | 管理用タイトル |
| slug | string (unique) | 公開URL用スラッグ |
| html | text | LP 本体の HTML（`<body>` 内容） |
| css | text? | LP 固有のスタイル |
| js | text? | LP 固有のスクリプト |
| meta_title | string? | `<title>` タグ |
| meta_description | string? | `<meta name="description">` |
| meta_og_image | string? | OGP 画像 URL |
| status | enum (DRAFT / PUBLISHED) | 公開状態 |
| created_at | timestamp | 作成日時 |
| updated_at | timestamp | 更新日時 |

> **技術判断: DB 保存を採用**  
> LP コンテンツ（HTML/CSS/JS）は Supabase PostgreSQL の `text` 型に保存する。  
> 理由: 編集フローとの一貫性・サイズ（数十KB以内）で十分・ファイル管理不要。  
> Supabase Storage（Blob）は画像など静的アセットに限定する。

---

#### 画面仕様

##### A. LP 一覧 `/admin/lps`

| 要素 | 仕様 |
|---|---|
| 表示内容 | タイトル・スラッグ・ステータス（公開/下書き）・更新日・操作ボタン |
| 操作 | 新規作成・編集・プレビュー・削除 |
| ステータス表示 | 公開: Moss Green バッジ / 下書き: グレーバッジ |

##### B. LP 新規作成 `/admin/lps/new`

##### C. LP 編集 `/admin/lps/[id]/edit`

2カラムレイアウト（左: コードエディタ 70% / 右: 設定・画像パネル 30%）

**左カラム（コードエディタ）:**

| 要素 | 仕様 |
|---|---|
| タブ切り替え | HTML / CSS / JS |
| エディタ | `<textarea>` + モノスペースフォント、行番号風スタイル |

**右カラム（設定・画像パネル）タブ切り替え `[設定] [📷 画像]`:**

*設定タブ:*

| 要素 | 仕様 |
|---|---|
| タイトル入力 | テキストフィールド（管理用） |
| スラッグ入力 | テキストフィールド（`/lp/` プレフィックス表示） |
| ステータス切り替え | 「公開」「下書き」トグル |
| meta 情報 | title / description / OG画像URL（折りたたみ可） |
| アクション | 「保存」「プレビュー」（別タブで `/lp/[slug]` を開く） |

*画像タブ:*

| 要素 | 仕様 |
|---|---|
| アップロードボタン | 複数選択可・5MB制限・JPEG/PNG/WebP/GIF対応 |
| 画像グリッド | 3列サムネイル、ファイル名・サイズを下部に表示 |
| URLコピー | 各画像ホバーで「URLをコピー」ボタン → クリップボードにコピー |
| 削除 | 各画像にゴミ箱アイコン → DB + Storage から削除 |
| 利用方法ヒント | 「URLをコピーしてHTMLに貼り付けて使います」ガイドテキスト |

**HTMLエディタでの使い方:**
```html
<img src="{コピーしたURL}" alt="説明文">
```

##### D. LP 公開表示 `/lp/[slug]`

| 要素 | 仕様 |
|---|---|
| レンダリング | Next.js で完全な HTML ページとして出力（ブログのレイアウト外） |
| `<head>` | meta_title / meta_description / meta_og_image を注入 |
| `<style>` | css フィールドの内容を注入 |
| `<script>` | js フィールドの内容を `defer` で注入 |
| 非公開時 | status = DRAFT の場合は 404 を返す |

---

#### 受け入れ基準

- [ ] `/admin/lps` でLP一覧が表示できる
- [ ] LP を新規作成できる（title / slug / html 必須）
- [ ] HTML / CSS / JS を個別に編集して保存できる
- [ ] meta_title / meta_description / meta_og_image を設定できる
- [ ] 公開 / 下書き を切り替えられる
- [ ] `/lp/[slug]` で公開中の LP が表示される
- [ ] 下書き状態の LP は `/lp/[slug]` で 404 になる
- [ ] LP に画像を複数枚アップロードできる
- [ ] アップロードした画像の URL をコピーして HTML に埋め込める
- [ ] LP の画像を個別に削除できる（Storage からも削除される）
- [ ] LP 削除時に紐づく画像が DB・Storage から一括削除される
- [ ] LP 削除ができる
- [ ] ブログの既存機能（記事・カテゴリ・タグ）に回帰がない

---

#### スコープ外（本スプリント）

- LP のバージョン管理・履歴
- 外部ドメインでの LP 公開
- テンプレート機能
- フォーム埋め込み

---

## スコープ外

以下の機能は本仕様書のスコープ外とし、将来の拡張フェーズで検討する。

- コメント機能
- 検索機能（全文検索）
- RSS フィード
- メールニュースレター
- SNS シェアボタン
- 複数管理者・権限管理
- 記事のバージョン管理・履歴
- 多言語対応（英語）
- Google Analytics 連携
- 広告掲載
