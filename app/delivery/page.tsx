import type { Metadata } from 'next';
import Link from 'next/link';
import { Banknote, Camera, Clock3, CreditCard, Gift, ShieldCheck, Smartphone, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Reveal, STAGGER } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { deliveryFaq } from '@/data/faq';
import { DELIVERY_PRICE, EXPRESS_MINUTES, FREE_DELIVERY_FROM } from '@/lib/delivery';
import { defaultOgImage, siteConfig } from '@/lib/site';
import { formatPrice } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Доставка и оплата',
  description: `Доставка цветов по Астане от ${EXPRESS_MINUTES} минут. Бесплатно от ${formatPrice(FREE_DELIVERY_FROM)}. Тарифы по зонам, способы оплаты и ответы на частые вопросы.`,
  alternates: { canonical: '/delivery' },
  openGraph: { title: 'Доставка и оплата — AzaFlowers', url: '/delivery', images: [defaultOgImage] },
};

type Condition = { icon: LucideIcon; title: string; text: string };

const conditions: Condition[] = [
  { icon: Clock3, title: `От ${EXPRESS_MINUTES} минут`, text: 'Экспресс по центральным районам с момента подтверждения.' },
  { icon: Truck, title: `Бесплатно от ${formatPrice(FREE_DELIVERY_FROM)}`, text: 'Для заказов в пределах зоны 1 и зоны 2.' },
  { icon: Camera, title: 'Фото перед отправкой', text: 'Пришлём готовый букет в мессенджер.' },
  { icon: ShieldCheck, title: 'Гарантия 7 дней', text: 'Заменим букет, если он завянет раньше.' },
];

const tariffs = [
  { zone: 'Зона 1', area: 'Есильский и Алматинский районы', time: `от ${EXPRESS_MINUTES} мин`, price: DELIVERY_PRICE, free: true },
  { zone: 'Зона 2', area: 'Сарыарка, Байконур, Нура', time: 'от 90 мин', price: 2500, free: true },
  { zone: 'Зона 3', area: 'Косшы, Талапкер, пригород до 20 км', time: 'от 2 часов', price: 4000, free: false },
  { zone: 'Самовывоз', area: siteConfig.address, time: 'через 30 мин', price: 0, free: true },
];

const extras = [
  { label: 'Точный интервал 1 час', price: 1000 },
  { label: 'Ночная доставка (23:00 — 08:00)', price: 5000 },
  { label: 'Доставка к определённой минуте', price: 3000 },
];

const payments: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Smartphone, title: 'Kaspi', text: 'Счёт в приложении Kaspi.kz — оплата в пару касаний. Доступен Kaspi Red.' },
  { icon: CreditCard, title: 'Картой онлайн', text: 'Visa и Mastercard. Ссылка на оплату придёт после подтверждения заказа.' },
  { icon: Banknote, title: 'При получении', text: 'Наличными или картой курьеру — только для получателя-заказчика.' },
  { icon: Gift, title: 'Для компаний', text: 'Безналичный расчёт по счёту, закрывающие документы, отсрочка для постоянных клиентов.' },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: deliveryFaq.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};

/** Схема зон: концентрические контурные круги с мастерской в центре */
function ZonesDiagram() {
  const rings = [
    { r: 150, label: 'Зона 3', y: 16 },
    { r: 105, label: 'Зона 2', y: 61 },
    { r: 60, label: 'Зона 1', y: 106 },
  ];
  return (
    <svg viewBox="0 0 320 320" className="h-auto w-full max-w-sm" role="img" aria-label="Схема зон доставки: три кольца вокруг мастерской">
      {rings.map((ring) => (
        <g key={ring.label}>
          <circle cx="160" cy="160" r={ring.r} fill="none" stroke="#dbdbdb" strokeWidth="1" />
          <text x="160" y={ring.y + 14} textAnchor="middle" fontSize="10" letterSpacing="2" fill="#8d8d8d" fontFamily="var(--font-marcellus), serif">
            {ring.label.toUpperCase()}
          </text>
        </g>
      ))}
      <circle cx="160" cy="160" r="5" fill="#a7325f" />
      <text x="160" y="186" textAnchor="middle" fontSize="10" fill="#000000" fontFamily="var(--font-montserrat), sans-serif">
        Мастерская
      </text>
    </svg>
  );
}

export default function DeliveryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PageHeader
        crumbs={[{ label: 'Главная', href: '/' }, { label: 'Доставка и оплата' }]}
        index="01"
        overline="Доставка"
        title="Доставка и оплата"
        lead={`Привозим свежие букеты по Астане ежедневно с 8:00 до 23:00. Бесплатно — при заказе от ${formatPrice(FREE_DELIVERY_FROM)}.`}
      />

      {/* Условия */}
      <section aria-label="Условия доставки" className="container-shop">
        <ul className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {conditions.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className="group border-b border-line py-10 sm:px-8 sm:odd:border-r sm:odd:pl-0 lg:border-b-0 lg:border-r lg:odd:pl-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <Reveal delay={i * STAGGER}>
                <span className="flex size-14 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                  <Icon className="size-5 group-hover:animate-shakes" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h2 className="mt-8 font-heading text-xl font-normal text-ink">{title}</h2>
                <p className="mt-2 text-sm text-muted">{text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      {/* Тарифы и зоны */}
      <section aria-labelledby="tariffs-title" className="section">
        <div className="container-shop">
          <SectionHeading id="tariffs-title" index="02" overline="Тарифы" title="Зоны и стоимость" />
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <Reveal className="min-w-0 lg:col-span-8">
              <div
                role="region"
                aria-label="Таблица тарифов, прокручивается горизонтально"
                tabIndex={0}
                className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0"
              >
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <caption className="sr-only">Стоимость и сроки доставки по зонам Астаны</caption>
                  <thead>
                    <tr className="border-b border-ink">
                      {['Зона', 'Районы', 'Срок', 'Стоимость'].map((h) => (
                        <th key={h} scope="col" className="pb-4 pr-4 font-nav text-xs font-normal uppercase tracking-button text-muted">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tariffs.map((t) => (
                      <tr key={t.zone} className="border-b border-line transition-colors hover:bg-surface-soft">
                        <th scope="row" className="py-5 pr-4 font-heading text-base font-normal text-ink">
                          {t.zone}
                        </th>
                        <td className="py-5 pr-4 text-muted">{t.area}</td>
                        <td className="whitespace-nowrap py-5 pr-4 text-ink">{t.time}</td>
                        <td className="whitespace-nowrap py-5 text-ink">
                          {t.price === 0 ? 'Бесплатно' : formatPrice(t.price)}
                          {t.free && t.price > 0 && (
                            <span className="block text-xs text-muted">0 ₸ от {formatPrice(FREE_DELIVERY_FROM)}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="mt-12 font-nav text-xs uppercase tracking-button text-muted">Дополнительно</h3>
              <ul className="mt-4">
                {extras.map((e) => (
                  <li key={e.label} className="flex justify-between gap-6 border-b border-line py-4 text-sm">
                    <span className="text-ink">{e.label}</span>
                    <span className="whitespace-nowrap text-ink">+{formatPrice(e.price)}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1} className="flex justify-center lg:col-span-4">
              <ZonesDiagram />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Оплата */}
      <section aria-labelledby="payment-title" className="section border-t border-line bg-surface-soft">
        <div className="container-shop">
          <SectionHeading id="payment-title" index="03" overline="Оплата" title="Как оплатить заказ" />
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {payments.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="bg-paper">
                <Reveal delay={i * STAGGER} className="h-full p-8">
                  <Icon className="size-6 text-ink" strokeWidth={1.5} aria-hidden="true" />
                  <h3 className="mt-6 font-heading text-xl font-normal text-ink">{title}</h3>
                  <p className="mt-2 text-sm text-muted">{text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="section border-t border-line">
        <div className="container-shop grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-title" index="04" overline="FAQ" title="Частые вопросы" className="lg:mb-8" />
            <Reveal>
              <p className="text-sm text-muted">
                Не нашли ответ?{' '}
                <Link href="/contacts" className="text-ink underline underline-offset-4 transition-colors hover:text-accent">
                  Напишите нам
                </Link>{' '}
                или позвоните{' '}
                <a href={siteConfig.phoneHref} className="whitespace-nowrap text-ink underline underline-offset-4 transition-colors hover:text-accent">
                  {siteConfig.phone}
                </a>
                .
              </p>
            </Reveal>
          </div>
          <Reveal className="lg:col-span-8">
            <Accordion type="single" collapsible defaultValue="item-0" className="border-t border-line">
              {deliveryFaq.map((item, i) => (
                <AccordionItem key={item.question} value={`item-${i}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>
    </>
  );
}
