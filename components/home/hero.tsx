'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EASE_OUT_EXPO } from '@/components/ui/reveal';
import { SafeImage } from '@/components/ui/safe-image';
import { Overline } from '@/components/ui/section-heading';
import { img } from '@/data/images';
import { getProductBySlug } from '@/data/products';
import { formatPrice } from '@/lib/utils';

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: EASE_OUT_EXPO, delay },
});

const stats = [
  { value: '60', unit: 'мин', label: 'доставка по городу' },
  { value: '4.9', unit: '', label: 'средняя оценка', star: true },
  { value: '12k+', unit: '', label: 'букетов доставлено' },
];

const featured = getProductBySlug('piony-sara-bernar');

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="container-shop grid items-center gap-12 pb-16 pt-10 lg:grid-cols-12 lg:gap-8 lg:pb-32 lg:pt-16">
        <div className="lg:col-span-6">
          <motion.div {...rise(0)}>
            <Overline index="01">Доставка по Астане за 60 минут</Overline>
          </motion.div>

          <h1 id="hero-title" className="mt-8 text-display-sm text-ink md:text-7xl xl:text-display">
            <motion.span {...rise(0.1)} className="block">
              Цветы,
            </motion.span>
            <motion.span {...rise(0.2)} className="block">
              которые говорят
            </motion.span>
            <motion.span {...rise(0.3)} className="block">
              за вас<span className="text-accent">.</span>
            </motion.span>
          </h1>

          <motion.p {...rise(0.4)} className="mt-8 max-w-md text-base text-muted">
            Авторские букеты из свежих цветов, собранные в день заказа. Фото букета перед отправкой — бесплатно.
          </motion.p>

          <motion.div {...rise(0.5)} className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <Button asChild size="lg">
              <Link href="/catalog">
                Смотреть каталог
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Link
              href="/contacts"
              className="link-underline pb-1 font-heading text-xs uppercase tracking-button text-ink"
            >
              Собрать свой букет
            </Link>
          </motion.div>

          <motion.dl {...rise(0.6)} className="mt-16 grid max-w-lg grid-cols-3 divide-x divide-line border-t border-line">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 pt-6 first:pl-0">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="flex items-baseline gap-1 font-heading text-3xl font-light text-ink">
                  {stat.value}
                  {stat.unit && <span className="text-sm text-muted">{stat.unit}</span>}
                  {stat.star && <Star className="size-3 fill-accent text-accent" aria-hidden="true" />}
                </dd>
                <dd aria-hidden="true" className="mt-1 text-xs text-muted">
                  {stat.label}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="relative lg:col-span-6 lg:pl-8">
          {/* Декор: медленно вращающийся контурный круг с точкой — отсылка к круглому логотипу образца */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE_OUT_EXPO, delay: 0.2 }}
            className="absolute -right-24 -top-12 hidden size-[520px] lg:block"
          >
            <div className="size-full animate-spin-slow rounded-full border border-line">
              <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.15 }}
            className="relative ml-auto aspect-[4/5] w-full max-w-lg overflow-hidden rounded-t-full bg-surface"
          >
            <SafeImage
              src={img.lushBouquet}
              alt="Пышный букет из роз и эустомы в руках флориста"
              fill
              priority
              sizes="(min-width: 992px) 512px, 100vw"
              className="object-cover"
            />
          </motion.div>

          {featured && (
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.7 }}
              className="absolute -bottom-6 left-0 border border-line bg-paper p-5 shadow-soft sm:left-4 lg:bottom-12 lg:left-0"
            >
              <p className="font-nav text-xs uppercase tracking-button text-muted">Букет дня</p>
              <Link
                href={`/catalog/${featured.slug}`}
                className="mt-2 block font-heading text-lg text-ink transition-colors hover:text-accent"
              >
                {featured.name}
              </Link>
              <p className="mt-1 font-heading text-base text-accent">{formatPrice(featured.price)}</p>
            </motion.div>
          )}

          <p
            aria-hidden="true"
            className="absolute -right-2 top-1/2 hidden origin-center translate-x-1/2 rotate-90 font-nav text-xs uppercase tracking-button text-muted-light xl:block"
          >
            Est. 2026 · Astana
          </p>
        </div>
      </div>
    </section>
  );
}
