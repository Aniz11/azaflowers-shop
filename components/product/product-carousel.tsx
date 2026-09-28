'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import type { Product } from '@/types';
import { ProductCard } from './product-card';

type Props = { id: string; index?: string; overline: string; title: string; products: Product[] };

const arrow =
  'flex size-12 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-ink disabled:text-line-strong disabled:hover:border-line';

/** Горизонтальная лента карточек на нативном scroll-snap */
export function ProductCarousel({ id, index, overline, title, products }: Props) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update, products.length]);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  if (products.length === 0) return null;

  return (
    <section aria-labelledby={id} className="section border-t border-line">
      <div className="container-shop">
        <SectionHeading
          id={id}
          index={index}
          overline={overline}
          title={title}
          aside={
            <div className="hidden gap-3 md:flex">
              <button type="button" onClick={() => scroll(-1)} disabled={edges.start} aria-label="Прокрутить назад" aria-controls={`${id}-track`} className={arrow}>
                <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => scroll(1)} disabled={edges.end} aria-label="Прокрутить вперёд" aria-controls={`${id}-track`} className={arrow}>
                <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          }
        />
        <ul
          id={`${id}-track`}
          ref={trackRef}
          onScroll={update}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto scroll-smooth px-4 md:mx-0 md:scroll-px-0 md:gap-8 md:px-0"
        >
          {products.map((product) => (
            <li
              key={product.id}
              className="w-[70%] shrink-0 snap-start sm:w-[calc((100%-32px)/2.5)] lg:w-[calc((100%-96px)/4)]"
            >
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
