'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EASE_OUT_EXPO } from '@/components/ui/reveal';
import { SafeImage } from '@/components/ui/safe-image';
import { Overline } from '@/components/ui/section-heading';
import { LAST_ORDER_KEY, type Order } from '@/lib/checkout';
import { siteConfig } from '@/lib/site';
import { formatPrice } from '@/lib/utils';

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', weekday: 'long' });

const steps = [
  { title: 'Подтверждение', text: 'Менеджер позвонит в течение 10 минут, чтобы уточнить детали.' },
  { title: 'Сборка', text: 'Флорист соберёт букет и пришлёт фото перед отправкой.' },
  { title: 'Доставка', text: 'Курьер позвонит получателю заранее и вручит букет.' },
];

/** Анимированная галочка: круг и отметка прорисовываются линией */
function AnimatedCheck() {
  return (
    <svg viewBox="0 0 80 80" className="size-20" aria-hidden="true">
      <motion.circle
        cx="40"
        cy="40"
        r="38"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="text-ink"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: EASE_OUT_EXPO }}
      />
      <motion.path
        d="M26 41 l10 10 l19 -21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-accent"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.6 }}
      />
    </svg>
  );
}

export function SuccessView() {
  const number = useSearchParams().get('order');
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(LAST_ORDER_KEY);
      const parsed = raw ? (JSON.parse(raw) as Order) : null;
      if (parsed && (!number || parsed.number === number)) setOrder(parsed);
    } catch {
      setOrder(null);
    }
  }, [number]);

  const displayNumber = order?.number ?? number;

  return (
    <div className="container-shop pb-16 pt-12 lg:pb-32 lg:pt-20">
      <div className="grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <AnimatedCheck />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.3 }}
          >
            <Overline className="mt-10">{displayNumber ? `Заказ ${displayNumber}` : 'Заказ принят'}</Overline>
            <h1 className="mt-5 text-5xl text-ink lg:text-7xl">
              Спасибо{order ? `, ${order.customer.name}` : ''}<span className="text-accent">.</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-muted">
              Мы получили заказ и уже передаём его флористу.
              {order && ` Подтверждение отправили на ${order.customer.email}.`}
            </p>

            <ol className="mt-12 space-y-6 border-t border-line pt-8">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line font-nav text-xs text-ink">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm text-ink">{step.title}</p>
                    <p className="mt-1 text-sm text-muted">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-12 flex flex-wrap items-center gap-8">
              <Button asChild size="lg">
                <Link href="/catalog">
                  Вернуться в каталог <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <a href={siteConfig.phoneHref} className="link-underline pb-1 font-heading text-xs uppercase tracking-button">
                {siteConfig.phone}
              </a>
            </div>
          </motion.div>
        </div>

        {order && (
          <motion.aside
            aria-labelledby="order-details-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO, delay: 0.5 }}
            className="lg:col-span-5 lg:col-start-8"
          >
            <div className="border border-line p-6 md:p-8">
              <h2 id="order-details-title" className="font-nav text-xs uppercase tracking-button text-ink">
                Детали заказа
              </h2>
              <ul className="mt-6 space-y-4">
                {order.items.map((item) => (
                  <li key={`${item.slug}-${item.sizeLabel ?? ''}`} className="flex items-center gap-4">
                    <span className="relative block size-14 shrink-0 overflow-hidden bg-surface">
                      <SafeImage src={item.image} alt="" fill sizes="56px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="block truncate text-ink">{item.name}</span>
                      <span className="block text-xs text-muted">
                        {item.quantity} шт.{item.sizeLabel ? ` · ${item.sizeLabel}` : ''}
                      </span>
                    </span>
                    <span className="text-sm text-ink">{formatPrice(item.total)}</span>
                  </li>
                ))}
              </ul>

              <dl className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
                <div className="flex justify-between gap-6">
                  <dt className="text-muted">{order.delivery.method === 'courier' ? 'Адрес' : 'Самовывоз'}</dt>
                  <dd className="text-right text-ink">{order.delivery.address}</dd>
                </div>
                <div className="flex justify-between gap-6">
                  <dt className="text-muted">Когда</dt>
                  <dd className="text-right text-ink">
                    {dateFormatter.format(new Date(`${order.delivery.date}T12:00:00`))}, {order.delivery.timeLabel}
                  </dd>
                </div>
                {order.recipient && (
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted">Получатель</dt>
                    <dd className="text-right text-ink">
                      {order.recipient.name}
                      {order.recipient.anonymous ? ' · анонимно' : ''}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-6">
                  <dt className="text-muted">Оплата</dt>
                  <dd className="text-ink">{order.paymentLabel}</dd>
                </div>
                {order.totals.discount > 0 && (
                  <div className="flex justify-between gap-6">
                    <dt className="text-muted">Скидка {order.totals.promoCode}</dt>
                    <dd className="text-accent">−{formatPrice(order.totals.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-6">
                  <dt className="text-muted">Доставка</dt>
                  <dd className="text-ink">{order.totals.delivery === 0 ? 'Бесплатно' : formatPrice(order.totals.delivery)}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-6 border-t border-line pt-5">
                  <dt className="font-nav text-xs uppercase tracking-button text-ink">Итого</dt>
                  <dd className="font-heading text-3xl font-light text-ink">{formatPrice(order.totals.total)}</dd>
                </div>
              </dl>
            </div>
          </motion.aside>
        )}
      </div>
    </div>
  );
}
