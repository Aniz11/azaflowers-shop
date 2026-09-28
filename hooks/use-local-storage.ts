'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * SSR-безопасное состояние в localStorage.
 * До гидрации возвращает initialValue и hydrated=false, чтобы не было рассинхрона разметки.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // приватный режим или битые данные — остаёмся на initialValue
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // хранилище недоступно — состояние живёт только в памяти
    }
  }, [key, value, hydrated]);

  const update = useCallback((next: T | ((prev: T) => T)) => setValue(next), []);

  return [value, update, hydrated] as const;
}
