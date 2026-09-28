'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './use-local-storage';

const MAX_ITEMS = 8;

/** Недавно просмотренные товары (id), самые свежие — первыми */
export function useRecentlyViewed() {
  const [ids, setIds, hydrated] = useLocalStorage<string[]>('azaflowers:recent', []);

  const record = useCallback(
    (productId: string) => setIds((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, MAX_ITEMS)),
    [setIds],
  );

  return { ids, record, hydrated };
}
