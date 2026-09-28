'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { CartItem } from '@/types';

type StoreContextValue = {
  hydrated: boolean;
  cart: CartItem[];
  cartCount: number;
  /** Метка последнего добавления — хедер по ней проигрывает анимацию иконки корзины */
  lastAddedAt: number;
  addToCart: (productId: string, quantity?: number, size?: string) => void;
  setQuantity: (productId: string, quantity: number, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  clearCart: () => void;
  favorites: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
  /** Применённый промокод (проверка суммы — в lib/cart.computeTotals) */
  promoCode: string | null;
  setPromoCode: (code: string | null) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

const sameLine = (item: CartItem, productId: string, size?: string) =>
  item.productId === productId && item.size === size;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart, cartReady] = useLocalStorage<CartItem[]>('azaflowers:cart', []);
  const [favorites, setFavorites, favReady] = useLocalStorage<string[]>('azaflowers:favorites', []);

  const [promoCode, setPromoCode, promoReady] = useLocalStorage<string | null>('azaflowers:promo', null);
  const [lastAddedAt, setLastAddedAt] = useState(0);

  const addToCart = useCallback(
    (productId: string, quantity = 1, size?: string) => {
      setLastAddedAt(Date.now());
      setCart((prev) => {
        const existing = prev.find((item) => sameLine(item, productId, size));
        if (!existing) return [...prev, { productId, quantity, size }];
        return prev.map((item) =>
          sameLine(item, productId, size) ? { ...item, quantity: item.quantity + quantity } : item,
        );
      });
    },
    [setCart],
  );

  const setQuantity = useCallback(
    (productId: string, quantity: number, size?: string) =>
      setCart((prev) =>
        quantity <= 0
          ? prev.filter((item) => !sameLine(item, productId, size))
          : prev.map((item) => (sameLine(item, productId, size) ? { ...item, quantity } : item)),
      ),
    [setCart],
  );

  const removeFromCart = useCallback(
    (productId: string, size?: string) =>
      setCart((prev) => prev.filter((item) => !sameLine(item, productId, size))),
    [setCart],
  );

  const clearCart = useCallback(() => setCart([]), [setCart]);

  const toggleFavorite = useCallback(
    (productId: string) =>
      setFavorites((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
      ),
    [setFavorites],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      hydrated: cartReady && favReady && promoReady,
      cart,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      lastAddedAt,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      favorites,
      isFavorite: (productId: string) => favorites.includes(productId),
      toggleFavorite,
      promoCode,
      setPromoCode,
    }),
    [
      cart,
      favorites,
      promoCode,
      cartReady,
      favReady,
      promoReady,
      lastAddedAt,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      toggleFavorite,
      setPromoCode,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
