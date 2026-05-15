#!/bin/bash
# 使い方: ./scripts/supabase-exec.sh < sql/insert.sql
# または: ./scripts/supabase-exec.sh <<< "SELECT 1"

set -e

ENV_FILE="$(dirname "$0")/../.env.production.local"

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: .env.production.local が見つかりません"
  exit 1
fi

# DATABASE_URL を env ファイルから読み込む
DATABASE_URL=$(grep '^DATABASE_URL=' "$ENV_FILE" | cut -d '=' -f2- | tr -d '"' | tr -d "'")

if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL が設定されていません"
  exit 1
fi

# Docker コンテナ経由で psql を実行
docker exec -i blog-db-1 psql "$DATABASE_URL"
