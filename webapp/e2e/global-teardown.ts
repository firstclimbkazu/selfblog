import { execSync } from "child_process";
import { join } from "path";

const ROOT = join(__dirname, "../..");

export default async function globalTeardown() {
  console.log("E2E: テスト用コンテナを停止しています...");
  execSync("docker compose rm -sf webapp-e2e db-test", {
    stdio: "inherit",
    cwd: ROOT,
  });
}
