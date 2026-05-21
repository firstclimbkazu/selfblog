import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { isFileTooLarge, extractExtension } from "@/lib/upload";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const lpId = formData.get("lpId") as string | null;

  if (!file) {
    return NextResponse.json(
      { error: "ファイルが選択されていません" },
      { status: 400 }
    );
  }

  if (!lpId) {
    return NextResponse.json(
      { error: "lpId が指定されていません" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "JPEG / PNG / WebP / GIF のみアップロード可能です" },
      { status: 400 }
    );
  }

  if (isFileTooLarge(file.size)) {
    return NextResponse.json(
      { error: "5MB を超えるファイルはアップロードできません" },
      { status: 400 }
    );
  }

  const ext = extractExtension(file.name);
  const objectKey = `lp/${lpId}/${randomUUID()}.${ext}`;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      const uploadDir = join(process.cwd(), "public", "uploads", "lp", lpId);
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      const localName = objectKey.split("/").pop()!;
      await writeFile(join(uploadDir, localName), buffer);
      return NextResponse.json({
        url: `/uploads/${objectKey}`,
        objectKey,
        fileName: file.name,
        fileSize: file.size,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: `アップロードに失敗しました: ${message}` },
        { status: 500 }
      );
    }
  }

  try {
    const blob = await put(objectKey, file, { access: "public" });
    return NextResponse.json({
      url: blob.url,
      objectKey,
      fileName: file.name,
      fileSize: file.size,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `アップロードに失敗しました: ${message}` },
      { status: 500 }
    );
  }
}
