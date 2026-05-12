export function resolvePublishedAt(
  publish: boolean,
  currentPublishedAt: Date | null
): Date | null {
  if (publish && !currentPublishedAt) return new Date();
  return currentPublishedAt;
}
