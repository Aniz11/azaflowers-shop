import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type PaginationProps = {
  page: number;
  totalPages: number;
  /** Строит href для номера страницы */
  hrefFor: (page: number) => string;
  className?: string;
};

function pagesToShow(page: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, page - 1, page, page + 1]);
  const sorted = Array.from(set).filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) result.push('gap');
    result.push(p);
  });
  return result;
}

const cell =
  'flex size-10 items-center justify-center rounded-full font-heading text-sm transition-colors duration-300';

export function Pagination({ page, totalPages, hrefFor, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  return (
    <nav aria-label="Страницы каталога" className={cn('flex items-center justify-center gap-2', className)}>
      {prev ? (
        <Link href={hrefFor(prev)} scroll={false} aria-label="Предыдущая страница" className={cn(cell, 'border border-line hover:border-ink')}>
          <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(cell, 'border border-line text-line-strong')}>
          <ArrowLeft className="size-4" strokeWidth={1.5} />
        </span>
      )}

      <ul className="flex items-center gap-1">
        {pagesToShow(page, totalPages).map((p, i) =>
          p === 'gap' ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-muted">
              …
            </li>
          ) : (
            <li key={p}>
              <Link
                href={hrefFor(p)}
                scroll={false}
                aria-label={`Страница ${p}`}
                aria-current={p === page ? 'page' : undefined}
                className={cn(cell, p === page ? 'bg-ink text-paper' : 'text-ink hover:bg-surface')}
              >
                {p}
              </Link>
            </li>
          ),
        )}
      </ul>

      {next ? (
        <Link href={hrefFor(next)} scroll={false} aria-label="Следующая страница" className={cn(cell, 'border border-line hover:border-ink')}>
          <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(cell, 'border border-line text-line-strong')}>
          <ArrowRight className="size-4" strokeWidth={1.5} />
        </span>
      )}
    </nav>
  );
}
