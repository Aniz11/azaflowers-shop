import Link from 'next/link';
import { cn } from '@/lib/utils';

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Хлебные крошки" className={className}>
      <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link href={item.href} className="link-hover">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={last ? 'page' : undefined} className={cn(last && 'text-ink')}>
                  {item.label}
                </span>
              )}
              {!last && <span aria-hidden="true" className="size-1 rounded-full bg-line-strong" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
