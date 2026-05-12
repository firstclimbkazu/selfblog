# Blog Design Agent System

## プロジェクト概要
個人用ブログサイトの設計資料を自動生成するエージェントシステム。
技術スタック: React + Next.js + Vercel

## エージェント構成

### /infra-agent
インフラ担当エージェント。以下を担当する。
- システム構成図（docs/infra/system-architecture.drawio）
- データモデル図（docs/infra/data-model.drawio）

### /design-agent
設計担当エージェント。以下を担当する。
- サイト構成図（docs/design/site-map.drawio）
- 画面フロー図（docs/design/screen-flow.drawio）

インフラ担当の成果物を読み込み、設計資料に反映する。
ユーザーが「設計に反映して」と指示したときに起動する。

### /figma-agent
Figmaワイヤーフレーム担当エージェント。以下を担当する。
- ワイヤーフレーム（Figma）

設計担当・インフラ担当の成果物を読み込み、Figmaにワイヤーフレームを作成する。
/design-agent の完了後に実行する。

## エージェント実行順序
```
/infra-agent → /design-agent → /figma-agent
```

## ディレクトリ構成
```
blog/
├── .claude/commands/
│   ├── infra-agent.md
│   ├── design-agent.md
│   └── figma-agent.md
├── docs/
│   ├── design/        # 設計担当が管理
│   └── infra/         # インフラ担当が管理
├── requirements/
│   └── blog-requirements.md
└── CLAUDE.md
```

## 出力形式
- 構成図・フロー図・データモデル図: .drawio（XML形式）
- ワイヤーフレーム: Figma（Figma MCP経由）

## 要件ファイル
requirements/blog-requirements.md を参照して設計資料を生成する。
CLIプロンプトで直接指示を与えることも可能。
