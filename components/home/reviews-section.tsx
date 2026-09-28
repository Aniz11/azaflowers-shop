'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Rating } from '@/components/ui/rating';
import { SectionHeading } from '@/components/ui/section-heading';
import { reviews } from '@/data/reviews';
import { cn } from '@/lib/utils';

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

const arrowButton =
  'flex size-12 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-ink disabled:text-line-strong disabled:hover:border-line';

/** Карусель на нативном scroll-snap: свайп на мобильных, стрелки и клавиатура на десктопе */
export function ReviewsSection() {
  const trackRef = useRef<HTMLUListElement>(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState({ start: true, end: false });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft >= max - 4 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector('li');
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 32), behavior: 'smooth' });
  };

  return (
    <section aria-labelledby="reviews-title" className="section border-t border-line">
      <div className="container-shop">
        <SectionHeading
          id="reviews-title"
          index="05"
          overline="Отзывы"
          title="Нам доверяют"
          description={`Средняя оценка ${averageRating.toFixed(1)} из 5 — честные отзывы наших клиентов.`}
          aside={
            <div className="hidden gap-3 md:flex">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                disabled={edges.start}
                aria-label="Предыдущие отзывы"
                aria-controls="reviews-track"
                className={arrowButton}
              >
                <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                disabled={edges.end}
                aria-label="Следующие отзывы"
                aria-controls="reviews-track"
                className={arrowButton}
              >
                <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>
          }
        />

        <ul
          id="reviews-track"
          ref={trackRef}
          onScroll={update}
          tabIndex={0}
          aria-label="Отзывы клиентов, прокручиваются горизонтально"
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-8 overflow-x-auto scroll-smooth px-4 md:mx-0 md:scroll-px-0 md:px-0"
        >
          {reviews.map((review) => (
            <li
              key={review.id}
              className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-32px)/2)] lg:w-[calc((100%-64px)/3)]"
            >
              <figure className="flex h-full flex-col border-t border-ink pt-8">
                <div className="flex items-center justify-between">
                  <Rating value={review.rating} size="md" />
                  <span aria-hidden="true" className="font-heading text-6xl leading-none text-line">
                    “
                  </span>
                </div>
                <blockquote className="mt-4 flex-1 font-heading text-lg font-light leading-relaxed text-ink">
                  {review.text}
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="flex size-10 items-center justify-center rounded-full bg-surface font-nav text-sm text-ink"
                  >
                    {review.author[0]}
                  </span>
                  <span>
                    <span className="block text-sm text-ink">{review.author}</span>
                    <time dateTime={review.date} className="block text-xs text-muted">
                      {review.city} · {dateFormatter.format(new Date(review.date))}
                    </time>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {/* Тонкая линия прогресса прокрутки */}
        <div aria-hidden="true" className="mt-12 h-px bg-line">
          <div
            className={cn('h-px bg-ink transition-[width] duration-300')}
            style={{ width: `${Math.max(12, progress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
