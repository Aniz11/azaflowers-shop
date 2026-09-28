import Link from 'next/link';
import { siteConfig, topBarLinks } from '@/lib/site';

// Тонкая информационная строка: город · телефон · часы | вспомогательные ссылки
export function TopBar() {
  return (
    <div className="hidden border-b border-line md:block">
      <div className="container-shop flex h-10 items-center justify-between text-xs text-muted">
        <p className="flex items-center gap-3">
          <span>{siteConfig.city}</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-line-strong" />
          <a href={siteConfig.phoneHref} className="link-hover text-ink">
            {siteConfig.phone}
          </a>
          <span aria-hidden="true" className="size-1 rounded-full bg-line-strong" />
          <span>{siteConfig.workHours}</span>
        </p>
        <nav aria-label="Вспомогательная навигация" className="flex items-center gap-6">
          {topBarLinks.map((link) => (
            <Link key={link.href} href={link.href} className="link-hover">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
