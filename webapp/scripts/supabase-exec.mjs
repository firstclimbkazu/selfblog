import { readFileSync } from "fs";
import { createInterface } from "readline";
import pg from "pg";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envFile = join(__dirname, "../.env.production.local");

// .env.production.local から DATABASE_URL を読み込む
const envContent = readFileSync(envFile, "utf-8");
const match = envContent.match(/^DATABASE_URL=["']?(.+?)["']?\s*$/m);
if (!match) {
  console.error("ERROR: DATABASE_URL が見つかりません");
  process.exit(1);
}
const DATABASE_URL = match[1];

// stdin から SQL を読み込む
const rl = createInterface({ input: process.stdin });
const lines = [];
for await (const line of rl) lines.push(line);
const sql = lines.join("\n");

if (!sql.trim()) {
  console.error("ERROR: SQL が空です");
  process.exit(1);
}

const client = new pg.Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  const result = await client.query(sql);
  const results = Array.isArray(result) ? result : [result];
  for (const r of results) {
    if (r.rows?.length) {
      console.table(r.rows);
    } else {
      console.log(`${r.command} ${r.rowCount ?? ""}`);
    }
  }
} finally {
  await client.end();
}
