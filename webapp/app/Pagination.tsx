import Link from "next/link";

type Props = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

function buildPageList(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) pages.push(i);

  if (end < total - 1) pages.push("...");

  pages.push(total);
  return pages;
}

const baseCell =
  "inline-flex items-center justify-center w-9 h-9 rounded text-sm";
const linkInactive =
  `${baseCell} border border-[var(--sotw-border)] text-[var(--sotw-text-2)] hover:bg-[var(--sotw-surface-alt)] hover:text-[var(--sotw-moss)] transition-colors`;
const linkActive =
  `${baseCell} font-semibold bg-[var(--sotw-text)] text-[var(--sotw-bg)]`;
const disabledCell =
  `${baseCell} text-[var(--sotw-text-3)]`;

export default function Pagination({ currentPage, totalPages, buildHref }: Props) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages);
  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  return (
    <nav aria-label="ページネーション" className="mt-[60px] flex justify-center">
      <ul className="flex items-center gap-1">
        <li>
          {currentPage === 1 ? (
            <span aria-hidden="true" className={disabledCell}>
              ←
            </span>
          ) : (
            <Link href={buildHref(prevPage)} rel="prev" aria-label="前のページ" className={linkInactive}>
              ←
            </Link>
          )}
        </li>

        {pages.map((p, i) =>
          p === "..." ? (
            <li key={`ellipsis-${i}`}>
              <span aria-hidden="true" className={disabledCell}>
                …
              </span>
            </li>
          ) : (
            <li key={p}>
              {p === currentPage ? (
                <span aria-current="page" className={linkActive}>
                  {p}
                </span>
              ) : (
                <Link href={buildHref(p)} aria-label={`${p}ページ目`} className={linkInactive}>
                  {p}
                </Link>
              )}
            </li>
          )
        )}

        <li>
          {currentPage === totalPages ? (
            <span aria-hidden="true" className={disabledCell}>
              →
            </span>
          ) : (
            <Link href={buildHref(nextPage)} rel="next" aria-label="次のページ" className={linkInactive}>
              →
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
