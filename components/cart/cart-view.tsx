'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Lock, ShoppingBag } from 'lucide-react';
import { useStore } from '@/components/cart/store-provider';
import { ProductCarousel } from '@/components/product/product-carousel';
import { Button } from '@/components/ui/button';
import { products } from '@/data/products';
import { computeTotals } from '@/lib/cart';
import { plural } from '@/lib/utils';
import type { CartItem } from '@/types';
import { CartItemRow } from './cart-item';
import { FreeDeliveryProgress, OrderTotals } from './order-totals';
import { PromoCode } from './promo-code';

type Removed = { item: CartItem; name: string };

export function CartView() {
  const { cart, hydrated, setQuantity, removeFromCart, addToCart, clearCart, promoCode } = useStore();
  const totals = useMemo(() => computeTotals(cart, promoCode), [cart, promoCode]);
  const [removed, setRemoved] = useState<Removed | null>(null);
  const timer = useRef<number>();

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const remove = (item: CartItem, name: string) => {
    removeFromCart(item.productId, item.size);
    setRemoved({ item, name });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setRemoved(null), 5000);
  };

  const undo = () => {
    if (!removed) return;
    addToCart(removed.item.productId, removed.item.quantity, removed.item.size);
    setRemoved(null);
  };

  // «С этим покупают»: подарки и мини-букеты, которых ещё нет в корзине
  const crossSell = useMemo(() => {
    const inCart = new Set(cart.map((i) => i.productId));
    return products
      .filter((p) => !inCart.has(p.id) && p.inStock)
      .sort((a, b) => Number(b.category === 'gifts') - Number(a.category === 'gifts') || a.price - b.price)
      .slice(0, 8);
  }, [cart]);

  const undoToast = (
    <AnimatePresence>
      {removed && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          role="status"
          className="fixed inset-x-4 bottom-24 z-floating mx-auto flex max-w-md items-center justify-between gap-4 bg-ink px-5 py-4 text-sm text-paper shadow-overlay md:bottom-8"
        >
          <span className="truncate">«{removed.name}» удалён</span>
          <button type="button" onClick={undo} className="shrink-0 font-heading text-xs uppercase tracking-button underline-offset-4 hover:underline">
            Вернуть
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!hydrated) return <div aria-busy="true" className="min-h-[50vh]" />;

  if (totals.lines.length === 0) {
    return (
      <>
        <div className="container-shop pb-16">
          <div className="flex flex-col items-center border border-line px-6 py-24 text-center">
            <span className="flex size-16 items-center justify-center rounded-full border border-line-strong text-muted">
              <ShoppingBag className="size-6" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h2 className="mt-6 text-3xl text-ink">Корзина пока пуста</h2>
            <p className="mt-3 max-w-sm text-sm text-muted">
              Загляните в каталог — там свежие букеты, которые мы соберём и доставим уже сегодня.
            </p>
            <Button asChild size="lg" className="mt-10">
              <Link href="/catalog">
                Перейти в каталог <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
        <ProductCarousel id="cross-title" overline="Идеи" title="Может, начать с этого?" products={crossSell} />
        {undoToast}
      </>
    );
  }

  return (
    <>
      <div className="container-shop grid gap-12 pb-16 lg:grid-cols-12 lg:gap-16 lg:pb-24">
        <section aria-labelledby="cart-items-title" className="min-w-0 lg:col-span-7 xl:col-span-8">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 id="cart-items-title" className="text-sm text-muted">
              {totals.count} {plural(totals.count, ['товар', 'товара', 'товаров'])}
            </h2>
            <button type="button" onClick={clearCart} className="link-underline text-xs text-muted hover:text-ink">
              Очистить корзину
            </button>
          </div>
          <ul>
            <AnimatePresence initial={false} mode="popLayout">
              {totals.lines.map((line) => (
                <CartItemRow
                  key={line.key}
                  line={line}
                  onQuantity={(q) => setQuantity(line.item.productId, q, line.item.size)}
                  onRemove={() => remove(line.item, line.product.name)}
                />
              ))}
            </AnimatePresence>
          </ul>
          <Link
            href="/catalog"
            className="group mt-8 inline-flex items-center gap-3 font-heading text-xs uppercase tracking-button text-ink"
          >
            <ArrowRight className="size-4 rotate-180 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
            <span className="link-underline pb-1">Продолжить покупки</span>
          </Link>
        </section>

        <aside aria-labelledby="summary-title" className="min-w-0 lg:col-span-5 xl:col-span-4">
          <div className="border border-line p-6 md:p-8 lg:sticky lg:top-28">
            <h2 id="summary-title" className="font-nav text-xs uppercase tracking-button text-ink">
              Ваш заказ
            </h2>
            <div className="mt-6">
              <FreeDeliveryProgress amount={totals.subtotal - totals.discount} />
            </div>
            <div className="mt-8">
              <PromoCode subtotal={totals.subtotal} promo={totals.promo} promoError={totals.promoError} />
            </div>
            <div className="mt-8">
              <OrderTotals totals={totals} deliveryLabel="Доставка по городу" />
            </div>
            <Button asChild size="lg" className="mt-8 w-full whitespace-normal px-4">
              <Link href="/checkout">
                Оформить заказ <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
              <Lock className="size-3" aria-hidden="true" /> Оплата после подтверждения заказа
            </p>
          </div>
        </aside>
      </div>

      <ProductCarousel id="cross-title" overline="Дополнить заказ" title="С этим покупают" products={crossSell} />
      {undoToast}
    </>
  );
}
