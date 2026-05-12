export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;

export function isFileTooLarge(size: number): boolean {
  return size > MAX_UPLOAD_SIZE;
}

export function extractExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "jpg";
}
