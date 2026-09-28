'use client';

import Link from 'next/link';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Quantity } from '@/components/ui/quantity';
import { SafeImage } from '@/components/ui/safe-image';
import { getCategory } from '@/data/categories';
import type { CartLine } from '@/lib/cart';
import { formatPrice } from '@/lib/utils';

type Props = {
  line: CartLine;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
};

// forwardRef нужен AnimatePresence mode="popLayout"
export const CartItemRow = forwardRef<HTMLLIElement, Props>(({ line, onQuantity, onRemove }, ref) => {
  const { product, item, sizeLabel, unitPrice, total } = line;
  const href = `/catalog/${product.slug}`;

  return (
    <motion.li
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
      className="grid grid-cols-[88px_1fr] gap-4 border-b border-line py-6 sm:grid-cols-[120px_1fr] sm:gap-6"
    >
      <Link href={href} className="relative block aspect-[4/5] overflow-hidden bg-surface" tabIndex={-1} aria-hidden="true">
        <SafeImage src={product.images[0]} alt="" fill sizes="120px" className="object-cover" />
      </Link>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="font-nav text-xs uppercase tracking-button text-muted">{getCategory(product.category)?.name}</p>
            <h3 className="mt-1 font-heading text-lg font-normal text-ink">
              <Link href={href} className="transition-colors hover:text-accent">
                {product.name}
              </Link>
            </h3>
            <p className="mt-1 text-xs text-muted">
              {sizeLabel ? `Размер: ${sizeLabel} · ` : ''}
              {formatPrice(unitPrice)} / шт.
            </p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Удалить «${product.name}» из корзины`}
            className="-mr-2 -mt-2 flex size-10 shrink-0 items-center justify-center text-muted transition-colors hover:text-accent"
          >
            <X className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-4">
          <Quantity value={item.quantity} onChange={onQuantity} label={`Количество: ${product.name}`} size="sm" />
          <p className="font-heading text-xl font-light text-ink" aria-label={`Сумма: ${formatPrice(total)}`}>
            {formatPrice(total)}
          </p>
        </div>
      </div>
    </motion.li>
  );
});
CartItemRow.displayName = 'CartItemRow';
