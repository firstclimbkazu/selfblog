import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Pool の生成は関数内に置く。トップレベルだとキャッシュが効いた場合でも
// Pool だけ作られて接続を掴みっぱなしになる。
function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    max: 3,
    idleTimeoutMillis: 10_000,
  });
  return new PrismaClient({ adapter, log: ["error"] });
}

// 本番でも globalThis にキャッシュする。しないとモジュールが再評価される
// たびに新しい Pool ができ、接続が積み上がって pooler の上限に達する。
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
