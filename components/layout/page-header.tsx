import type { ReactNode } from 'react';
import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { Reveal } from '@/components/ui/reveal';
import { Overline } from '@/components/ui/section-heading';

type Props = {
  crumbs: Crumb[];
  index?: string;
  overline: string;
  title: ReactNode;
  lead?: ReactNode;
  aside?: ReactNode;
};

/** Шапка внутренних страниц: крошки, надстрочник, крупный заголовок с точкой акцента */
export function PageHeader({ crumbs, index, overline, title, lead, aside }: Props) {
  return (
    <header className="container-shop pb-12 pt-10 lg:pb-20 lg:pt-16">
      <Breadcrumbs items={crumbs} />
      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
        <Reveal className="lg:col-span-8">
          <Overline index={index}>{overline}</Overline>
          <h1 className="mt-5 text-5xl text-ink lg:text-7xl">
            {title}
            {/* Точка-акцент не нужна, если заголовок уже заканчивается знаком препинания */}
            {!(typeof title === 'string' && /[?!.…]$/.test(title)) && <span className="text-accent">.</span>}
          </h1>
        </Reveal>
        {(lead || aside) && (
          <Reveal delay={0.1} className="lg:col-span-4">
            {lead && <p className="text-base text-muted">{lead}</p>}
            {aside}
          </Reveal>
        )}
      </div>
    </header>
  );
}
