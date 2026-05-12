import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
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
  const filename = `thumbnails/${randomUUID()}.${ext}`;

  const blob = await put(filename, file, { access: "public" });

  return NextResponse.json({ url: blob.url });
}
