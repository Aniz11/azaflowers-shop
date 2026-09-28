'use client';

import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import { useStore } from '@/components/cart/store-provider';
import { Button } from '@/components/ui/button';
import { getProductById } from '@/data/products';
import { plural } from '@/lib/utils';
import type { Product } from '@/types';
import { ProductGrid } from './product-grid';

export function FavoritesView() {
  const { favorites, hydrated, toggleFavorite } = useStore();

  if (!hydrated) {
    return <div aria-busy="true" className="min-h-[40vh]" />;
  }

  const items = favorites.map(getProductById).filter((p): p is Product => Boolean(p));

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center border border-line px-6 py-24 text-center">
        <span className="flex size-16 items-center justify-center rounded-full border border-line-strong text-muted">
          <Heart className="size-6" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-3xl text-ink">Здесь пока пусто</h2>
        <p className="mt-3 max-w-sm text-sm text-muted">
          Нажмите на сердечко на карточке букета — он сохранится здесь, чтобы вернуться к нему позже.
        </p>
        <Button asChild size="lg" className="mt-10">
          <Link href="/catalog">
            В каталог <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-line pb-4">
        <p className="text-sm text-muted" aria-live="polite">
          {items.length} {plural(items.length, ['букет', 'букета', 'букетов'])} в избранном
        </p>
        <button
          type="button"
          onClick={() => items.forEach((p) => toggleFavorite(p.id))}
          className="link-underline text-xs text-muted hover:text-ink"
        >
          Очистить список
        </button>
      </div>
      <h2 className="sr-only">Сохранённые букеты</h2>
      <ProductGrid products={items} className="pt-10" />
    </>
  );
}
