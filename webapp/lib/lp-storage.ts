import { del } from "@vercel/blob";
import { unlink } from "fs/promises";
import { join } from "path";

/**
 * Delete uploaded LP image files from the configured storage backend.
 * Accepts both absolute remote URLs (Vercel Blob) and local "/uploads/..." paths.
 * Errors per file are swallowed so a missing file does not block DB cleanup.
 */
export async function removeLpFiles(urls: string[]): Promise<void> {
  if (urls.length === 0) return;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const remote = urls.filter((u) => /^https?:\/\//.test(u));
    if (remote.length > 0) {
      try {
        await del(remote);
      } catch {
        // ignore — best effort cleanup
      }
    }
    return;
  }

  for (const url of urls) {
    if (!url.startsWith("/uploads/")) continue;
    const relative = url.replace(/^\/uploads\//, "");
    const absolute = join(process.cwd(), "public", "uploads", relative);
    try {
      await unlink(absolute);
    } catch {
      // ignore — best effort cleanup
    }
  }
}
