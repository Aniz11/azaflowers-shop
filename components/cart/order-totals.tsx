'use client';

import { motion } from 'framer-motion';
import type { CartTotals } from '@/lib/cart';
import { FREE_DELIVERY_FROM } from '@/lib/delivery';
import { formatPrice } from '@/lib/utils';

/** Прогресс до бесплатной доставки — тонкая линия, заполняется чёрным */
export function FreeDeliveryProgress({ amount }: { amount: number }) {
  const left = Math.max(0, FREE_DELIVERY_FROM - amount);
  const progress = Math.min(1, amount / FREE_DELIVERY_FROM);
  return (
    <div>
      <p className="text-xs text-muted" aria-live="polite">
        {left > 0 ? (
          <>
            До бесплатной доставки — <span className="text-ink">{formatPrice(left)}</span>
          </>
        ) : (
          <span className="text-ink">Доставка по городу бесплатна</span>
        )}
      </p>
      <div
        className="mt-3 h-px bg-line"
        role="progressbar"
        aria-label="Прогресс до бесплатной доставки"
        aria-valuemin={0}
        aria-valuemax={FREE_DELIVERY_FROM}
        aria-valuenow={Math.min(amount, FREE_DELIVERY_FROM)}
      >
        <motion.div
          className="h-px origin-left bg-ink"
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        />
      </div>
    </div>
  );
}

type Props = { totals: CartTotals; deliveryLabel?: string };

export function OrderTotals({ totals, deliveryLabel = 'Доставка' }: Props) {
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-muted">Товары ({totals.count})</dt>
        <dd className="text-ink">{formatPrice(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between">
          <dt className="text-muted">Скидка по промокоду</dt>
          <dd className="text-accent">−{formatPrice(totals.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-muted">{deliveryLabel}</dt>
        <dd className="text-ink">{totals.delivery === 0 ? 'Бесплатно' : formatPrice(totals.delivery)}</dd>
      </div>
      <div className="flex items-baseline justify-between border-t border-line pt-5">
        <dt className="font-nav text-xs uppercase tracking-button text-ink">Итого</dt>
        <dd className="font-heading text-3xl font-light text-ink" aria-live="polite">
          {formatPrice(totals.total)}
        </dd>
      </div>
    </dl>
  );
}
