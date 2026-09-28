'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { categories } from '@/data/categories';
import type { NavLink } from '@/lib/site';
import { cn } from '@/lib/utils';

export function isActivePath(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

// Marcellus uppercase как в образце; активный пункт — точка акцента под текстом
const linkClass = (active: boolean) =>
  cn(
    'relative py-2 font-nav text-xs uppercase tracking-nav transition-colors duration-300 hover:text-accent',
    'after:absolute after:-bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-accent after:transition-transform after:duration-300',
    active ? 'text-ink after:scale-100' : 'text-ink after:scale-0',
  );

function CatalogMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef<HTMLLIElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <li ref={rootRef} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div className="flex items-center gap-1">
        <Link href="/catalog" className={linkClass(active)} aria-current={active ? 'page' : undefined}>
          Каталог
        </Link>
        <button
          type="button"
          aria-label="Открыть категории каталога"
          aria-expanded={open}
          aria-controls="catalog-menu"
          onClick={() => setOpen((v) => !v)}
          className="p-1 text-ink transition-colors hover:text-accent"
        >
          <ChevronDown
            className={cn('size-3 transition-transform duration-300', open && 'rotate-180')}
            aria-hidden="true"
          />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            id="catalog-menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="absolute left-0 top-full z-header w-72 pt-6"
          >
            <ul className="border border-line bg-paper py-4 shadow-soft">
              {categories.map((category, i) => (
                <li key={category.slug}>
                  <Link
                    href={`/catalog?category=${category.slug}`}
                    className="group flex items-baseline gap-4 px-6 py-2 font-heading text-base text-ink transition-colors hover:text-accent"
                  >
                    <span className="font-nav text-xs text-muted-light">{String(i + 1).padStart(2, '0')}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      {category.name}
                    </span>
                  </Link>
                </li>
              ))}
              <li className="mx-6 mt-3 border-t border-line pt-4">
                <Link href="/catalog" className="link-underline font-nav text-xs uppercase tracking-button text-ink">
                  Весь каталог
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export function MainNav({ links, className, label }: { links: NavLink[]; className?: string; label: string }) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-8">
        {links.map((link) =>
          link.href === '/catalog' ? (
            <CatalogMenu key={link.href} active={isActivePath(pathname, link.href)} />
          ) : (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={isActivePath(pathname, link.href) ? 'page' : undefined}
                className={linkClass(isActivePath(pathname, link.href))}
              >
                {link.label}
              </Link>
            </li>
          ),
        )}
      </ul>
    </nav>
  );
}
