import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal, STAGGER } from '@/components/ui/reveal';
import { SafeImage } from '@/components/ui/safe-image';
import { SectionHeading } from '@/components/ui/section-heading';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { plural } from '@/lib/utils';

// Ценовые подборки — наследие чипов «Букеты до 25 000 тг.» из образца, в тонком исполнении
const priceLinks = [
  { href: '/catalog?maxPrice=20000', label: 'до 20 000 ₸' },
  { href: '/catalog?minPrice=20000&maxPrice=40000', label: '20 000 – 40 000 ₸' },
  { href: '/catalog?minPrice=40000', label: 'от 40 000 ₸' },
];

export function CategoriesSection() {
  return (
    <section aria-labelledby="categories-title" className="section border-t border-line">
      <div className="container-shop">
        <SectionHeading
          id="categories-title"
          index="02"
          overline="Категории"
          title="Выберите настроение"
          action={{ href: '/catalog', label: 'Весь каталог' }}
        />

        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-8 lg:grid-cols-3 lg:gap-y-16">
          {categories.map((category, i) => {
            const count = products.filter((p) => p.category === category.slug).length;
            return (
              <li key={category.slug}>
                <Reveal delay={(i % 3) * STAGGER}>
                  <Link href={`/catalog?category=${category.slug}`} className="group block">
                    <div className="relative aspect-square overflow-hidden bg-surface">
                      <SafeImage
                        src={category.image}
                        alt={category.name}
                        fill
                        sizes="(min-width: 992px) 400px, 50vw"
                        className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute right-4 top-4 hidden size-12 items-center justify-center rounded-full bg-paper text-ink opacity-0 transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:opacity-100 md:flex"
                      >
                        <ArrowUpRight className="size-4 -rotate-45" strokeWidth={1.5} />
                      </span>
                    </div>
                    <div className="mt-5 flex items-baseline justify-between gap-4 border-b border-line pb-4">
                      <h3 className="flex items-baseline gap-3 font-heading text-lg font-normal text-ink transition-colors group-hover:text-accent md:text-xl">
                        <span className="font-nav text-xs text-muted-light">{String(i + 1).padStart(2, '0')}</span>
                        {category.name}
                      </h3>
                      <span className="hidden shrink-0 text-xs text-muted sm:inline">
                        {count} {plural(count, ['товар', 'товара', 'товаров'])}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>

        <Reveal className="mt-12 flex flex-wrap items-center gap-3 lg:mt-16">
          <span className="mr-2 font-nav text-xs uppercase tracking-button text-muted">По бюджету</span>
          {priceLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-line px-5 py-2 text-sm text-ink transition-colors duration-300 hover:border-ink"
            >
              {link.label}
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
