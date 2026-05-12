import { randomUUID } from "crypto";

export function articleSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 60)
      .replace(/^-+|-+$/g, "") || `post-${Date.now()}`
  );
}

export function taxonomySlug(name: string): string {
  const ascii = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return ascii.length >= 2 ? ascii.slice(0, 60) : randomUUID().slice(0, 8);
}

export function ensureUniqueSlug(base: string, existing: string[] = []): string {
  let slug = base;
  let i = 2;
  while (existing.includes(slug)) {
    slug = `${base}-${i++}`;
  }
  return slug;
}
