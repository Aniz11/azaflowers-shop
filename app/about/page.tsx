import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Counter } from '@/components/ui/counter';
import { Reveal, STAGGER } from '@/components/ui/reveal';
import { SafeImage } from '@/components/ui/safe-image';
import { SectionHeading } from '@/components/ui/section-heading';
import { img } from '@/data/images';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'О нас',
  description:
    'AzaFlowers — цветочная мастерская в Астане. Наша история, команда флористов и принципы работы: свежие цветы, честные фото и доставка за 60 минут.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'О нас — AzaFlowers',
    description: 'Цветочная мастерская в Астане с 2020 года.',
    url: '/about',
    images: [{ url: img.flowerShop, width: 1200, height: 800, alt: 'Витрина цветочной мастерской' }],
  },
};

const stats = [
  { value: 12000, suffix: '+', label: 'букетов доставлено' },
  { value: 6, suffix: '', label: 'лет в Астане' },
  { value: 18, suffix: '', label: 'флористов и курьеров' },
  { value: 4.9, suffix: '', decimals: 1, label: 'средняя оценка клиентов' },
];

const timeline = [
  { year: '2020', title: 'Мастерская на кухне', text: 'Аза собирает первые букеты для друзей и принимает заказы через Instagram.' },
  { year: '2021', title: 'Первая студия', text: 'Открываем студию на левом берегу и нанимаем двух флористов.' },
  { year: '2022', title: 'Доставка за 60 минут', text: 'Запускаем собственную курьерскую службу и экспресс-доставку по городу.' },
  { year: '2024', title: 'Корпоративные клиенты', text: 'Оформляем офисы и мероприятия, открываем вторую студию.' },
  { year: '2026', title: 'AzaFlowers онлайн', text: 'Новый сайт с каталогом, онлайн-оплатой и фото букета перед отправкой.' },
];

const team = [
  { initials: 'АН', name: 'Аза Нурланова', role: 'Основатель, арт-директор', text: 'Отвечает за стиль каждой коллекции.' },
  { initials: 'ДК', name: 'Дана Касымова', role: 'Старший флорист', text: '9 лет во флористике, любит пионы и сложные фактуры.' },
  { initials: 'ЕС', name: 'Ерлан Сапаров', role: 'Логистика', text: 'Следит, чтобы букеты приезжали вовремя и свежими.' },
  { initials: 'МА', name: 'Мадина Ахметова', role: 'Забота о клиентах', text: 'Поможет выбрать букет и ответит на любой вопрос.' },
];

const gallery = [
  { src: img.flowerShop, alt: 'Витрина мастерской с корзинами цветов', className: 'col-span-2 row-span-2' },
  { src: img.gardenRoses, alt: 'Садовые розы в стеклянной вазе', className: '' },
  { src: img.hydrangea, alt: 'Синие гортензии', className: '' },
  { src: img.lushBouquet, alt: 'Пышный авторский букет', className: 'row-span-2' },
  { src: img.tulipsVase, alt: 'Розовые тюльпаны в вазе', className: '' },
  { src: img.darkArrangement, alt: 'Композиция в тёмной гамме', className: '' },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Главная', href: '/' }, { label: 'О нас' }]}
        index="01"
        overline="О нас"
        title="Собираем эмоции, а не просто букеты"
        lead={`${siteConfig.name} — небольшая мастерская в Астане. Мы верим, что цветы — это способ сказать то, что трудно произнести вслух.`}
      />

      {/* Hero-изображение с манифестом */}
      <section aria-label="Наша философия" className="container-shop">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="relative aspect-[4/3] overflow-hidden bg-surface lg:col-span-7">
            <SafeImage
              src={img.flowerShop}
              alt="Витрина мастерской AzaFlowers"
              fill
              priority
              sizes="(min-width: 992px) 720px, 100vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <p className="font-heading text-2xl font-light leading-snug text-ink lg:text-3xl">
              «Мы не держим цветы на складе. Каждое утро — новая поставка, каждый букет собирается в день заказа, и
              каждый клиент видит его до отправки».
            </p>
            <p className="mt-6 font-nav text-xs uppercase tracking-button text-muted">Аза Нурланова, основатель</p>
          </Reveal>
        </div>
      </section>

      {/* Счётчики */}
      <section aria-label="AzaFlowers в цифрах" className="section">
        <div className="container-shop">
          <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
            {stats.map((stat, i) => (
              <Reveal
                key={stat.label}
                delay={i * STAGGER}
                className="border-b border-line py-10 pr-4 odd:border-r odd:pr-6 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-heading text-5xl font-light text-ink lg:text-7xl">
                  <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </dd>
                <dd aria-hidden="true" className="mt-3 text-sm text-muted">
                  {stat.label}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Таймлайн */}
      <section aria-labelledby="history-title" className="section border-t border-line">
        <div className="container-shop">
          <SectionHeading id="history-title" index="02" overline="История" title="Как мы росли" />
          <ol className="relative">
            {/* Центральная линия на десктопе, левая на мобильном */}
            <span aria-hidden="true" className="absolute bottom-0 left-2 top-0 w-px bg-line lg:left-1/2" />
            {timeline.map((item, i) => {
              const right = i % 2 === 1;
              return (
                <li key={item.year} className="relative pb-16 pl-12 last:pb-0 lg:grid lg:grid-cols-2 lg:gap-24 lg:pl-0">
                  <span
                    aria-hidden="true"
                    className="absolute left-2 top-3 size-3 -translate-x-1/2 rounded-full border border-ink bg-paper lg:left-1/2"
                  >
                    {i === timeline.length - 1 && <span className="absolute inset-0.5 rounded-full bg-accent" />}
                  </span>
                  <Reveal
                    y={32}
                    className={right ? 'lg:col-start-2' : 'lg:text-right'}
                  >
                    {/* Крупный «призрачный» год — декор через ::before; для скринридеров год есть в заголовке */}
                    <p
                      aria-hidden="true"
                      data-year={item.year}
                      className="font-heading text-6xl font-light text-line-strong before:content-[attr(data-year)] lg:text-7xl"
                    />
                    <h3 className="mt-2 font-heading text-2xl font-normal text-ink">
                      <span className="sr-only">{item.year} — </span>
                      {item.title}
                    </h3>
                    <p className={`mt-3 max-w-sm text-sm text-muted ${right ? '' : 'lg:ml-auto'}`}>{item.text}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Команда */}
      <section aria-labelledby="team-title" className="section border-t border-line bg-surface-soft">
        <div className="container-shop">
          <SectionHeading id="team-title" index="03" overline="Команда" title="Люди за каждым букетом" />
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((person, i) => (
              <li key={person.name}>
                <Reveal delay={i * STAGGER} className="group">
                  <div className="relative flex aspect-square items-center justify-center border border-line bg-paper transition-colors duration-500 group-hover:border-ink">
                    <span className="flex size-32 items-center justify-center rounded-full border border-line font-nav text-4xl text-ink transition-all duration-500 ease-out-expo group-hover:scale-110 group-hover:border-accent">
                      {person.initials}
                    </span>
                    <span className="absolute left-4 top-4 font-nav text-xs text-muted-light">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-normal text-ink">{person.name}</h3>
                  <p className="mt-1 font-nav text-xs uppercase tracking-button text-accent">{person.role}</p>
                  <p className="mt-3 text-sm text-muted">{person.text}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Галерея */}
      <section aria-labelledby="gallery-title" className="section border-t border-line">
        <div className="container-shop">
          <SectionHeading
            id="gallery-title"
            index="04"
            overline="Галерея"
            title="Из нашей мастерской"
            action={{ href: siteConfig.instagramHref, label: siteConfig.instagram }}
          />
          <ul className="grid auto-rows-[160px] grid-cols-2 gap-4 md:auto-rows-[240px] md:grid-cols-4 md:gap-6">
            {gallery.map((photo, i) => (
              <li key={photo.src} className={`group relative overflow-hidden bg-surface ${photo.className}`}>
                <Reveal delay={(i % 4) * STAGGER} className="absolute inset-0">
                  <SafeImage
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="Призыв к действию" className="border-t border-line">
        <Reveal className="container-shop flex flex-col items-start gap-8 py-16 md:flex-row md:items-center md:justify-between lg:py-24">
          <h2 className="max-w-xl text-4xl text-ink lg:text-6xl">
            Соберём букет для вас<span className="text-accent">.</span>
          </h2>
          <Button asChild size="lg">
            <Link href="/catalog">
              Смотреть каталог <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Reveal>
      </section>
    </>
  );
}
