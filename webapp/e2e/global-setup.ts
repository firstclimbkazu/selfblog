import { execSync } from "child_process";
import { join } from "path";

const ROOT = join(__dirname, "../..");
const E2E_URL = "http://localhost:3001";

async function waitForServer(timeout = 900_000) {
  const deadline = Date.now() + timeout;
  let elapsed = 0;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(E2E_URL);
      if (res.status < 500) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 5000));
    elapsed += 5;
    if (elapsed % 30 === 0) {
      console.log(`E2E: 待機中... ${elapsed}s（build + migrate + seed が進行中）`);
    }
  }
  throw new Error(`${E2E_URL} が起動しませんでした（タイムアウト ${timeout / 1000}s）`);
}

export default async function globalSetup() {
  console.log("E2E: コンテナを起動しています...");
  execSync("docker compose --profile e2e up -d webapp-e2e", { stdio: "inherit", cwd: ROOT });

  console.log("E2E: サーバー起動を待機しています（build + migrate + seed を含む）...");
  await waitForServer();
  console.log("E2E: 準備完了");
}
