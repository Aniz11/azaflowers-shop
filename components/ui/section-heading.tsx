import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Reveal } from './reveal';

type OverlineProps = { index?: string; children: ReactNode; className?: string; light?: boolean };

/** Надстрочник: «01 ── КОЛЛЕКЦИЯ ●» — Marcellus uppercase с разрядкой, как меню образца */
export function Overline({ index, children, className, light = false }: OverlineProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-3 font-nav text-xs uppercase tracking-button',
        light ? 'text-paper' : 'text-muted',
        className,
      )}
    >
      {index && <span className={light ? 'text-paper' : 'text-ink'}>{index}</span>}
      {index && <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />}
      <span>{children}</span>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
    </p>
  );
}

type SectionHeadingProps = {
  id?: string;
  index?: string;
  overline: string;
  title: ReactNode;
  description?: ReactNode;
  action?: { href: string; label: string };
  aside?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
};

export function SectionHeading({
  id,
  index,
  overline,
  title,
  description,
  action,
  aside,
  align = 'left',
  className,
}: SectionHeadingProps) {
  const centered = align === 'center';
  return (
    <Reveal
      className={cn(
        'mb-10 flex flex-col gap-6 lg:mb-16',
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', centered && 'flex flex-col items-center')}>
        <Overline index={index}>{overline}</Overline>
        <h2 id={id} className="mt-5 text-4xl text-ink lg:text-6xl">
          {title}
        </h2>
        {description && <p className="mt-5 max-w-xl text-base text-muted">{description}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-3 font-heading text-xs uppercase tracking-button text-ink"
        >
          <span className="link-underline pb-1">{action.label}</span>
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      )}
      {aside}
    </Reveal>
  );
}
