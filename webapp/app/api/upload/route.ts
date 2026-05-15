import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { isFileTooLarge, extractExtension } from "@/lib/upload";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 });
  }

  if (isFileTooLarge(file.size)) {
    return NextResponse.json({ error: "5MB を超えるファイルはアップロードできません" }, { status: 400 });
  }

  const ext = extractExtension(file.name);
  const filename = `${randomUUID()}.${ext}`;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const uploadDir = join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(join(uploadDir, filename), buffer);
      return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: `アップロードに失敗しました: ${message}` }, { status: 500 });
    }
  }

  try {
    const blob = await put(`thumbnails/${filename}`, file, { access: "public" });
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `アップロードに失敗しました: ${message}` }, { status: 500 });
  }
}
