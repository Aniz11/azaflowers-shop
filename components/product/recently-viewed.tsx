'use client';

import { useEffect, useMemo } from 'react';
import { getProductById } from '@/data/products';
import { useRecentlyViewed } from '@/hooks/use-recently-viewed';
import type { Product } from '@/types';
import { ProductCarousel } from './product-carousel';

/** Записывает текущий товар в историю и показывает ранее просмотренные (кроме текущего) */
export function RecentlyViewed({ currentId }: { currentId: string }) {
  const { ids, record, hydrated } = useRecentlyViewed();

  useEffect(() => {
    if (hydrated) record(currentId);
  }, [currentId, hydrated, record]);

  const items = useMemo(
    () =>
      ids
        .filter((id) => id !== currentId)
        .map(getProductById)
        .filter((p): p is Product => Boolean(p)),
    [ids, currentId],
  );

  if (!hydrated) return null;
  return <ProductCarousel id="recent-title" overline="История" title="Вы недавно смотрели" products={items} />;
}
