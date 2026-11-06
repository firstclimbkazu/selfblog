import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Supabase 無料プランは 7 日間アクセスがないとプロジェクトが自動停止される。
// Vercel Cron から定期的に軽量クエリを投げて停止を防ぐ。
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const count = await prisma.article.count();
    return NextResponse.json({ ok: true, articles: count, at: new Date().toISOString() });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
