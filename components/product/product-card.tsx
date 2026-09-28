'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Check, Heart, Plus } from 'lucide-react';
import { useStore } from '@/components/cart/store-provider';
import { Badge } from '@/components/ui/badge';
import { Rating } from '@/components/ui/rating';
import { SafeImage } from '@/components/ui/safe-image';
import { getCategory } from '@/data/categories';
import { cn, formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

type ProductCardProps = { product: Product; priority?: boolean };

/**
 * Hover: фото увеличивается (700ms), проявляется второе фото, снизу выезжает «В корзину».
 * На тач-устройствах кнопки видны всегда.
 */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const { addToCart, toggleFavorite, isFavorite, hydrated } = useStore();
  const [added, setAdded] = useState(false);
  const [secondOk, setSecondOk] = useState(true);
  const favorite = hydrated && isFavorite(product.id);
  const href = `/catalog/${product.slug}`;
  const category = getCategory(product.category);

  const handleAdd = () => {
    addToCart(product.id);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Link href={href} aria-label={product.name} className="absolute inset-0 block">
          <SafeImage
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(min-width: 1200px) 300px, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
          />
          {product.images[1] && secondOk && (
            <Image
              src={product.images[1]}
              alt=""
              fill
              sizes="(min-width: 1200px) 300px, (min-width: 768px) 33vw, 50vw"
              onError={() => setSecondOk(false)}
              className="hidden object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out-expo group-hover:scale-105 group-hover:opacity-100 lg:block"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1">
          {product.oldPrice && (
            <Badge variant="sale">−{Math.round((1 - product.price / product.oldPrice) * 100)}%</Badge>
          )}
          {product.isNew && <Badge variant="light">Новинка</Badge>}
          {!product.inStock && <Badge variant="light">Под заказ</Badge>}
        </div>

        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          aria-pressed={favorite}
          aria-label={favorite ? `Убрать «${product.name}» из избранного` : `Добавить «${product.name}» в избранное`}
          className={cn(
            'absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-paper transition-all duration-300 hover:text-accent',
            favorite ? 'text-accent' : 'text-ink lg:translate-y-1 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100',
          )}
        >
          <Heart className={cn('size-4', favorite && 'fill-current')} strokeWidth={1.5} aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.inStock}
          aria-label={`Добавить «${product.name}» в корзину`}
          className={cn(
            'absolute inset-x-3 bottom-3 hidden h-12 items-center justify-center gap-2 bg-paper font-heading text-xs uppercase tracking-button text-ink transition-all duration-500 ease-out-expo hover:bg-ink hover:text-paper disabled:hidden lg:flex',
            'translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100',
          )}
        >
          {added ? (
            <>
              <Check className="size-4" aria-hidden="true" /> Добавлено
            </>
          ) : (
            <>
              <Plus className="size-4" aria-hidden="true" /> В корзину
            </>
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate font-nav text-xs uppercase tracking-button text-muted">{category?.name}</p>
          <Rating value={product.rating} count={product.reviewsCount} className="hidden sm:flex" />
        </div>
        <h3 className="mt-2 font-heading text-lg font-normal leading-snug text-ink">
          <Link href={href} className="transition-colors hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <p className="flex min-w-0 flex-wrap items-baseline gap-x-2">
            <span className="font-heading text-lg text-accent">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-sm text-muted-light line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </p>
          {/* Мобильная кнопка: hover на тач-устройствах нет */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={!product.inStock}
            aria-label={`Добавить «${product.name}» в корзину`}
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink disabled:text-line-strong lg:hidden"
          >
            {added ? <Check className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
          </button>
        </div>
      </div>
    </article>
  );
}
