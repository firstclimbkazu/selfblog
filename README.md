# Still On The Wall

> 都市と自然を往復する、アラフィフの知的好奇心。IT・山・サブカル——多面的な視点から世界を語る個人ブログ。

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel)](https://vercel.com)

**本番サイト: [https://firstclimb.net](https://firstclimb.net)**

---

## スクリーンショット

[![Still On The Wall トップページ](docs/images/top-page-screenshot.png)](https://firstclimb.net)

---

## デザイン

### ワイヤーフレーム全体像

![Figma wireframe overview](docs/images/figma-wireframe-overview.png)

| リソース | URL |
|---|---|
| Figma ワイヤーフレーム | [figma.com/design/x7QVkhxdw4CR4fRZbjMRYB](https://www.figma.com/design/x7QVkhxdw4CR4fRZbjMRYB) |
| Figma デザインシステム | [figma.com/design/LIFRo8BgG1gYN3xyVkYjbm](https://www.figma.com/design/LIFRo8BgG1gYN3xyVkYjbm) |
| Figma LP管理画面 | [figma.com/design/LIFRo8BgG1gYN3xyVkYjbm?node-id=107-34](https://www.figma.com/design/LIFRo8BgG1gYN3xyVkYjbm?node-id=107-34) |

デザインカラーコンセプト: **Warm Stone × Moss Green × Warm Amber**。Light / Dark モード両対応。

---

## 技術スタック

| レイヤー | 技術 | バージョン |
|---|---|---|
| フレームワーク | [Next.js](https://nextjs.org) (App Router + Turbopack) | 16 |
| UI ライブラリ | [React](https://react.dev) | 19 |
| 言語 | [TypeScript](https://www.typescriptlang.org) | 5 |
| スタイリング | [Tailwind CSS](https://tailwindcss.com) | v4 |
| ORM | [Prisma](https://www.prisma.io) | 7 |
| 認証 | [Auth.js (NextAuth)](https://authjs.dev) | v5 |
| DB | PostgreSQL | 17 |
| ストレージ | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) | — |
| ホスティング | [Vercel](https://vercel.com) | — |
| コンテナ | Docker / Docker Compose | — |
| E2E テスト | [Playwright](https://playwright.dev) | 1.60 |
| ユニットテスト | [Jest](https://jestjs.io) + [Testing Library](https://testing-library.com) | 29 |

### アーキテクチャ概要

```
Browser
  │
  ▼
Vercel Edge Network
  │
  ├── Next.js App Router (Server Components / Server Actions)
  │     ├── /app         … 公開ページ
  │     └── /app/admin   … 管理画面（要認証）
  │
  ├── Auth.js v5  … セッション管理・Google OAuth
  │
  ├── Prisma ORM  ──▶  PostgreSQL（Vercel Postgres / Supabase）
  │
  └── Vercel Blob ──▶  サムネイル画像ストレージ
```

---

## 設計ドキュメント

### システム構成図

![システム構成図](docs/infra/system-architecture.png)

### サイト構成図

![サイト構成図](docs/design/site-map.png)

### 画面フロー図

![画面フロー図](docs/design/screen-flow.png)

### データモデル図

![データモデル図](docs/infra/data-model.png)

---

## ディレクトリ構成

```
blog/
├── .claude/
│   ├── agents/          # AI エージェント定義
│   └── commands/        # カスタムスラッシュコマンド
├── docs/
│   ├── design/          # サイト構成図・画面フロー（draw.io）
│   ├── images/          # ドキュメント用画像
│   └── infra/           # システム構成図・データモデル（draw.io）
├── requirements/
│   └── blog-requirements.md
├── webapp/              # Next.js アプリ本体
│   ├── app/             # App Router ルート
│   ├── e2e/             # Playwright テスト
│   ├── __tests__/       # Jest ユニットテスト
│   ├── lib/             # ユーティリティ関数
│   └── prisma/          # スキーマ・マイグレーション
├── docker-compose.yml
└── CLAUDE.md
```

---

## ローカル開発

### 前提条件

- Docker Desktop
- Node.js 20+（ホスト側テスト実行時）

### 起動

```bash
# 初回 or スキーマ変更後
docker compose up --build

# 2回目以降
docker compose up

# dev サーバー: http://localhost:3000
# pgAdmin:      http://localhost:5050
```

### マイグレーション・シード

```bash
# コンテナ内で実行
docker compose exec webapp npx prisma migrate dev
docker compose exec webapp npx prisma db seed
```

### テスト

```bash
# ユニットテスト（Jest）
docker compose exec webapp npm run test:unit

# E2E テスト（Playwright） ※ dev コンテナ起動中に実行
cd webapp && npx playwright test
```

### 管理画面

`http://localhost:3000/admin` — `.env.local` に `AUTH_SECRET` と OAuth 設定が必要。

---

## 環境変数

`webapp/.env.local` を作成して以下を設定（`.env.local` は git 管理外）。

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sotw_dev

# Auth.js
AUTH_SECRET=your-secret-here
AUTH_GOOGLE_ID=your-google-client-id
AUTH_GOOGLE_SECRET=your-google-client-secret

# Vercel Blob（本番のみ必須）
BLOB_READ_WRITE_TOKEN=your-blob-token
```

---

## 参考リソース

### コアフレームワーク

| リソース | URL |
|---|---|
| Next.js ドキュメント | https://nextjs.org/docs |
| React 19 リリースノート | https://react.dev/blog/2024/12/05/react-19 |
| Tailwind CSS v4 アップグレードガイド | https://tailwindcss.com/docs/upgrade-guide |
| Prisma ドキュメント | https://www.prisma.io/docs |
| Auth.js v5 ドキュメント | https://authjs.dev/getting-started |
| Vercel Blob ドキュメント | https://vercel.com/docs/storage/vercel-blob |

### テスト

| リソース | URL |
|---|---|
| Playwright ドキュメント | https://playwright.dev/docs/intro |
| Testing Library | https://testing-library.com/docs |
| Jest ドキュメント | https://jestjs.io/docs/getting-started |

### モダンフロントエンド情報源

| メディア | URL | 内容 |
|---|---|---|
| Vercel Blog | https://vercel.com/blog | Next.js / Edge 最新情報 |
| This Week In React | https://thisweekinreact.com | React 週次ニュースレター |
| bytes.dev | https://bytes.dev | JS エコシステムニュース（ユーモアあり） |
| Web.dev | https://web.dev/blog | Google Chrome チームの Web 技術解説 |
| Josh W. Comeau | https://www.joshwcomeau.com | CSS・React の深掘り記事 |
| Matt Pocock | https://www.totaltypescript.com | TypeScript 実践ガイド |
| Frontend Masters Blog | https://frontendmasters.com/blog | 中・上級フロントエンド技術記事 |

### 国内情報源

| メディア | URL |
|---|---|
| Zenn トレンド | https://zenn.dev/trending |
| Speaker Deck（JSConf / React 系） | https://speakerdeck.com |
| DevelopersIO（クラスメソッド） | https://dev.classmethod.jp |

---

## ライセンス

MIT
