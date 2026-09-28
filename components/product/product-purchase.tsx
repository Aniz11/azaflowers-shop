'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Camera, Check, Clock3, Heart, ShieldCheck, Truck } from 'lucide-react';
import { useStore } from '@/components/cart/store-provider';
import { Button } from '@/components/ui/button';
import { Quantity } from '@/components/ui/quantity';
import { DELIVERY_PRICE, EXPRESS_MINUTES, FREE_DELIVERY_FROM } from '@/lib/delivery';
import { getSizeVariants } from '@/lib/product';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

const perks = [
  { icon: Clock3, title: `Доставка от ${EXPRESS_MINUTES} минут`, text: 'Ежедневно с 8:00 до 23:00 по Астане' },
  {
    icon: Truck,
    title: `Бесплатно от ${formatPrice(FREE_DELIVERY_FROM)}`,
    text: `Иначе — ${formatPrice(DELIVERY_PRICE)} по городу`,
  },
  { icon: Camera, title: 'Фото перед отправкой', text: 'Покажем букет в мессенджере' },
  { icon: ShieldCheck, title: 'Гарантия свежести 7 дней', text: 'Заменим букет, если он завянет раньше' },
];

export function ProductPurchase({ product }: { product: Product }) {
  const { addToCart, toggleFavorite, isFavorite, hydrated } = useStore();
  const variants = getSizeVariants(product);
  const [size, setSize] = useState<string | undefined>(variants.length ? 'M' : undefined);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const favorite = hydrated && isFavorite(product.id);

  const price = variants.find((v) => v.id === size)?.price ?? product.price;
  const oldPrice = product.oldPrice && size === 'M' ? product.oldPrice : undefined;

  const handleAdd = () => {
    addToCart(product.id, quantity, size);
    setAdded(true);
  };

  return (
    <div>
      <div className="flex items-baseline gap-4">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={price}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="font-heading text-4xl font-light text-accent"
            aria-live="polite"
          >
            {formatPrice(price * quantity)}
          </motion.p>
        </AnimatePresence>
        {oldPrice && <p className="text-lg text-muted-light line-through">{formatPrice(oldPrice * quantity)}</p>}
      </div>
      {quantity > 1 && <p className="mt-1 text-xs text-muted">{formatPrice(price)} за штуку</p>}

      {variants.length > 0 && (
        <fieldset className="mt-10">
          <legend className="mb-4 font-nav text-xs uppercase tracking-button text-muted">Размер букета</legend>
          <div className="grid grid-cols-3 gap-2">
            {variants.map((variant) => {
              const active = size === variant.id;
              return (
                <label
                  key={variant.id}
                  className={cn(
                    'relative flex cursor-pointer flex-col items-center border px-2 py-4 text-center transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent',
                    active ? 'border-ink' : 'border-line hover:border-line-strong',
                  )}
                >
                  <input
                    type="radio"
                    name="size"
                    value={variant.id}
                    checked={active}
                    onChange={() => {
                      setSize(variant.id);
                      setAdded(false);
                    }}
                    className="sr-only"
                  />
                  <span className="font-heading text-base text-ink">{variant.label}</span>
                  <span className="mt-1 text-xs text-muted">{variant.note}</span>
                  <span className="mt-2 text-sm text-ink">{formatPrice(variant.price)}</span>
                  {active && (
                    <motion.span
                      layoutId="size-dot"
                      aria-hidden="true"
                      className="absolute right-2 top-2 size-1.5 rounded-full bg-accent"
                    />
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="mt-8 flex flex-wrap gap-3">
        <Quantity
          value={quantity}
          onChange={(q) => {
            setQuantity(q);
            setAdded(false);
          }}
          label="Количество"
        />
        <Button
          size="lg"
          className="h-14 min-w-0 flex-1"
          onClick={handleAdd}
          disabled={!product.inStock}
          variant={added ? 'dark' : 'primary'}
        >
          {!product.inStock ? (
            'Нет в наличии'
          ) : added ? (
            <>
              <Check aria-hidden="true" /> В корзине
            </>
          ) : (
            'В корзину'
          )}
        </Button>
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          aria-pressed={favorite}
          aria-label={favorite ? 'Убрать из избранного' : 'Добавить в избранное'}
          className={cn(
            'flex size-14 items-center justify-center border transition-colors duration-300',
            favorite ? 'border-ink text-accent' : 'border-line text-ink hover:border-ink',
          )}
        >
          <Heart className={cn('size-5', favorite && 'fill-current')} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {added && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            role="status"
            className="overflow-hidden"
          >
            <span className="flex items-center justify-between gap-4 pt-4 text-sm text-muted">
              Товар добавлен в корзину
              <Link href="/cart" className="group inline-flex items-center gap-2 font-heading text-xs uppercase tracking-button text-ink">
                <span className="link-underline">Оформить</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </span>
          </motion.p>
        )}
      </AnimatePresence>

      <ul className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2">
        {perks.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-4 bg-paper p-5">
            <Icon className="mt-0.5 size-5 shrink-0 text-ink" strokeWidth={1.5} aria-hidden="true" />
            <div>
              <p className="text-sm text-ink">{title}</p>
              <p className="mt-1 text-xs text-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
