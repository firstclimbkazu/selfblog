## 概要

<!-- 何をなぜ変えたか。1〜3行で。 -->

## 変更の種類

<!-- 該当するものにチェック -->

- [ ] 🐛 バグ修正
- [ ] ✨ 新機能
- [ ] ♻️ リファクタリング
- [ ] 🔧 Chore（依存関係・設定・ドキュメント）
- [ ] 🚨 破壊的変更（Breaking Change）

## 変更内容

<!-- 主な変更点を箇条書きで -->

-
-

## スクリーンショット / 動作確認

<!-- UIの変更がある場合は Before / After を貼る。なければ削除 -->

## チェックリスト

- [ ] `docker exec blog-webapp-1 sh -c "cd /app && npx tsc --noEmit"` エラーゼロ
- [ ] `docker exec blog-webapp-1 sh -c "cd /app && npx eslint app/ lib/ --ext .ts,.tsx"` エラーゼロ
- [ ] e2e テスト全パス（`npx playwright test`）
- [ ] `page.tsx` にJSXの直書きがない（データフェッチ + コンポーネント呼び出しのみ）
- [ ] 既存機能に回帰がない

## 関連 Issue

<!-- Closes #123 -->
