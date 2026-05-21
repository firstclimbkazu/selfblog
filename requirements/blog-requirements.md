# ブログサイト要件定義

## サイト概要
- ブログ名: **Still On The Wall**
- ドメイン候補: `stillonthewall.com`
- コンセプト: 都市と自然を往復する、アラフィフの知的好奇心。IT・山・サブカル——多面的な視点から世界を語る個人ブログ。
- ターゲット: アラフィフ未婚男性。登る・前進し続ける姿勢を体現。
- 個人用ブログ（IT・ランニング・クライミング・サブカル・日々のニュース・日記）

## 技術スタック（確定）
- フロントエンド: Next.js（React）
- ホスティング: Vercel
- データベース: Supabase（PostgreSQL）
- 認証: Supabase Auth（管理者ログイン用）
- ストレージ: Supabase Storage（サムネイル画像）
- リポジトリ: GitHub
- CDN: Vercel Edge Network

## システム構成
```
Vercel（Next.js）
    ↕  supabase-js SDK / REST API
Supabase
├── PostgreSQL（記事・カテゴリ・タグ）
├── Auth（管理者ログイン）
└── Storage（サムネイル画像）
```

## ページ構成
### 公開側
- トップページ（記事一覧）
- 記事詳細ページ
- カテゴリ一覧ページ
- カテゴリ別記事一覧ページ
- タグ一覧ページ
- タグ別記事一覧ページ
- プロフィールページ

### 管理側（要ログイン）
- 記事登録・編集ページ
- カテゴリ管理ページ
- タグ管理ページ

## データモデル
### Article（記事）
- id: uuid
- title: string
- body: markdown（text）
- thumbnail_url: string（Supabase Storage URL）
- status: enum（draft / published）
- published_at: timestamp
- updated_at: timestamp
- category_id: uuid → Category
- tags: Tag[]（中間テーブル article_tags）

### Category（カテゴリ）
- id: uuid
- name: string
- slug: string（URL用）

### Tag（タグ）
- id: uuid
- name: string
- slug: string（URL用）

### article_tags（中間テーブル）
- article_id: uuid
- tag_id: uuid

### LandingPage（LP）
- id: uuid
- title: string（管理用タイトル）
- slug: string（公開URL用、unique）
- html: text（`<body>` 内容）
- css: text?（LP固有インラインスタイル）
- js: text?（LP固有インラインスクリプト）
- head_html: text?（外部ライブラリ読み込み用 `<link>` / `<script src>` など）
- meta_title: string?
- meta_description: string?
- meta_og_image: string?
- status: enum（draft / published）
- created_at: timestamp
- updated_at: timestamp
- images: LpImage[]

### LpImage（LP画像）
- id: uuid
- lp_id: uuid → LandingPage（onDelete: Cascade）
- public_url: string（Supabase Storage 公開URL）
- file_name: string
- file_size: int?（bytes）
- created_at: timestamp

> Storageパス規則: `lp/{lpId}/{uuid}.{ext}`（既存 `thumbnails/` と同バケット内で分離）

## 画面フロー
1. ユーザーがトップページにアクセス
2. 記事一覧を閲覧 → 記事をクリック → 詳細ページへ
3. カテゴリ／タグをクリック → フィルタされた一覧へ
4. プロフィールはナビゲーションから直接遷移
5. 管理者: /admin でログイン → 記事・カテゴリ・タグの管理

## デザイン
- カラーテーマ: Warm Stone × Moss Green × Warm Amber（"Basecamp" コンセプト）
- Light / Dark モード両対応
- Figma デザインシステム: https://www.figma.com/design/LIFRo8BgG1gYN3xyVkYjbm
- Figma ワイヤーフレーム: https://www.figma.com/design/x7QVkhxdw4CR4fRZbjMRYB
