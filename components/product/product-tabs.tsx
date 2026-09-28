'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Rating } from '@/components/ui/rating';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { occasionLabels, sizeLabels } from '@/lib/catalog';
import { DELIVERY_PRICE, EXPRESS_MINUTES, FREE_DELIVERY_FROM } from '@/lib/delivery';
import { formatPrice } from '@/lib/utils';
import type { Product, Review } from '@/types';

const dateFormatter = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

const care = [
  'Подрежьте стебли острым ножом под углом 45° на 2–3 см.',
  'Поставьте букет в чистую прохладную воду, меняйте её каждый день.',
  'Держите цветы вдали от батарей, прямого солнца и фруктов.',
  'Добавьте в воду подкормку из пакетика — она идёт в комплекте.',
];

function Term({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-6 border-b border-line py-4 text-sm">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-ink">{children}</dd>
    </div>
  );
}

export function ProductTabs({ product, reviews }: { product: Product; reviews: Review[] }) {
  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : product.rating;

  return (
    <Tabs defaultValue="description">
      <TabsList aria-label="Информация о товаре">
        <TabsTrigger value="description">Описание</TabsTrigger>
        <TabsTrigger value="composition">Состав</TabsTrigger>
        <TabsTrigger value="delivery">Доставка</TabsTrigger>
        <TabsTrigger value="reviews">
          Отзывы
          <span className="text-muted-light">
            <span className="sr-only">, оценок: </span>
            {product.reviewsCount}
          </span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="description">
        <div className="grid gap-12 lg:grid-cols-12">
          <p className="font-heading text-xl font-light leading-relaxed text-ink lg:col-span-7 lg:text-2xl">
            {product.description}
          </p>
          <dl className="lg:col-span-5">
            <Term label="Высота">≈ {product.height} см</Term>
            <Term label="Размер">{sizeLabels[product.size]}</Term>
            <Term label="Подходит для">{product.occasions.map((o) => occasionLabels[o]).join(', ')}</Term>
            <Term label="Наличие">{product.inStock ? 'Соберём сегодня' : 'Под заказ за 1 день'}</Term>
          </dl>
        </div>
      </TabsContent>

      <TabsContent value="composition">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h3 className="mb-6 font-nav text-xs uppercase tracking-button text-muted">Что в букете</h3>
            <ul>
              {product.composition.map((item, i) => (
                <li key={item} className="flex items-baseline gap-4 border-b border-line py-4 text-base text-ink">
                  <span className="font-nav text-xs text-muted-light">{String(i + 1).padStart(2, '0')}</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">
              Флорист может заменить до 10% цветов на равноценные по цвету и форме, если нужных нет в поставке.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h3 className="mb-6 font-nav text-xs uppercase tracking-button text-muted">Как продлить жизнь цветам</h3>
            <ol className="space-y-4">
              {care.map((tip, i) => (
                <li key={tip} className="flex gap-4 text-sm text-ink">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line font-nav text-xs">
                    {i + 1}
                  </span>
                  {tip}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="delivery">
        <div className="grid gap-12 lg:grid-cols-12">
          <dl className="lg:col-span-7">
            <Term label="Экспресс по городу">от {EXPRESS_MINUTES} минут</Term>
            <Term label="Стоимость">{formatPrice(DELIVERY_PRICE)}</Term>
            <Term label="Бесплатно">при заказе от {formatPrice(FREE_DELIVERY_FROM)}</Term>
            <Term label="Время работы">ежедневно, 8:00 — 23:00</Term>
            <Term label="Оплата">Kaspi, карта, наличные курьеру</Term>
          </dl>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-sm text-muted">
              Можно выбрать точный интервал доставки, анонимное вручение и открытку с вашим текстом — всё это при
              оформлении заказа.
            </p>
            <Link
              href="/delivery"
              className="group mt-6 inline-flex items-center gap-3 font-heading text-xs uppercase tracking-button text-ink"
            >
              <span className="link-underline pb-1">Условия доставки</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reviews">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-heading text-7xl font-light text-ink">{average.toFixed(1)}</p>
            <Rating value={average} size="md" className="mt-3" />
            <p className="mt-2 text-sm text-muted">На основе {product.reviewsCount} оценок</p>
          </div>
          <div className="lg:col-span-8">
            {reviews.length === 0 ? (
              <p className="border-t border-line pt-8 text-base text-muted">
                Здесь пока нет текстовых отзывов. Закажите этот букет — и станьте первым, кто расскажет о нём.
              </p>
            ) : (
              <ul className="divide-y divide-line border-t border-line">
                {reviews.map((review) => (
                  <li key={review.id} className="py-8">
                    <figure>
                      <div className="flex items-center justify-between gap-4">
                        <figcaption className="text-sm text-ink">
                          {review.author}
                          <span className="text-muted"> · {review.city}</span>
                        </figcaption>
                        <Rating value={review.rating} />
                      </div>
                      <blockquote className="mt-4 font-heading text-lg font-light text-ink">{review.text}</blockquote>
                      <time dateTime={review.date} className="mt-3 block text-xs text-muted-light">
                        {dateFormatter.format(new Date(review.date))}
                      </time>
                    </figure>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
