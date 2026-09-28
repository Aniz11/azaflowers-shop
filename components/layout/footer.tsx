import Link from 'next/link';
import { Instagram, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { categories } from '@/data/categories';
import { footerClientLinks, siteConfig } from '@/lib/site';
import { Logo } from './logo';

const socials: { icon: LucideIcon; label: string; href: string }[] = [
  { icon: Instagram, label: 'Instagram', href: siteConfig.instagramHref },
  { icon: Send, label: 'Telegram', href: siteConfig.telegramHref },
];

const payments = ['Kaspi', 'Visa', 'Mastercard', 'Наличные'];

function ColumnTitle({ id, children }: { id?: string; children: string }) {
  return (
    <h2 id={id} className="mb-6 font-nav text-xs uppercase tracking-button text-muted">
      {children}
    </h2>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto overflow-hidden border-t border-line bg-paper">
      {/* Сетка с вертикальными волосяными линиями, как разделители в образце */}
      <div className="container-shop grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-0 lg:py-24">
        <div className="lg:col-span-4 lg:pr-12">
          <Logo size="lg" />
          <p className="mt-6 max-w-72 text-sm text-muted">{siteConfig.description}</p>
          <ul className="mt-8 flex gap-3">
            {socials.map(({ icon: Icon, label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 hover:border-accent hover:text-accent"
                >
                  <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-labelledby="footer-catalog" className="lg:col-span-3 lg:border-l lg:border-line lg:px-12">
          <ColumnTitle id="footer-catalog">Каталог</ColumnTitle>
          <ul className="space-y-3">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/catalog?category=${category.slug}`} className="link-hover text-sm text-ink">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-clients" className="lg:col-span-2 lg:border-l lg:border-line lg:px-12">
          <ColumnTitle id="footer-clients">Клиентам</ColumnTitle>
          <ul className="space-y-3">
            {footerClientLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link-hover text-sm text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3 lg:border-l lg:border-line lg:pl-12">
          <ColumnTitle>Для связи</ColumnTitle>
          <address className="space-y-3 text-sm not-italic">
            <a href={siteConfig.phoneHref} className="link-hover block font-heading text-xl text-ink">
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="link-hover block text-ink">
              {siteConfig.email}
            </a>
            <p className="text-muted">{siteConfig.address}</p>
            <p className="text-muted">{siteConfig.workHours}</p>
          </address>
        </div>
      </div>

      {/* Декоративный крупный словесный знак */}
      {/* Текст через ::before — чисто декоративный слой, не участвует в дереве доступности */}
      <p
        aria-hidden="true"
        data-text="AzaFlowers"
        className="container-shop -mb-2 select-none whitespace-nowrap font-nav text-6xl leading-none text-surface before:content-[attr(data-text)] md:text-display lg:text-[160px] lg:leading-none"
      />

      <div className="border-t border-line">
        <div className="container-shop flex flex-col gap-4 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}. Все права защищены.
          </p>
          <ul aria-label="Способы оплаты" className="flex flex-wrap items-center gap-3">
            {payments.map((method) => (
              <li key={method} className="border border-line px-3 py-1 font-nav uppercase tracking-button text-ink">
                {method}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
