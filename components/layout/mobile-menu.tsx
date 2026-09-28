'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { categories } from '@/data/categories';
import { mainNav, siteConfig } from '@/lib/site';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { isActivePath } from './main-nav';

const EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const trigger = triggerRef.current;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKey);
      trigger?.focus();
    };
  }, [open]);

  const drawer = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-drawer bg-ink/60"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            key="panel"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Меню сайта"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="fixed inset-y-0 left-0 z-drawer flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-paper"
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-6">
              <Logo />
              <button
                ref={closeRef}
                type="button"
                aria-label="Закрыть меню"
                onClick={() => setOpen(false)}
                className="-mr-2 flex size-10 items-center justify-center transition-colors hover:text-accent"
              >
                <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Мобильная навигация" className="px-6 py-6">
              <ul>
                {mainNav.map((link, i) => {
                  const active = isActivePath(pathname, link.href);
                  return (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.1 + i * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex items-baseline gap-4 py-3 font-heading text-3xl font-light transition-colors hover:text-accent',
                          active ? 'text-accent' : 'text-ink',
                        )}
                      >
                        <span className="font-nav text-xs text-muted-light">{String(i + 1).padStart(2, '0')}</span>
                        {link.label}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-t border-line px-6 py-6">
              <p className="mb-4 font-nav text-xs uppercase tracking-button text-muted">Категории</p>
              <ul className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/catalog?category=${category.slug}`}
                      className="block rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-ink"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto border-t border-line px-6 py-6">
              <a href={siteConfig.phoneHref} className="link-hover font-heading text-xl">
                {siteConfig.phone}
              </a>
              <p className="mt-1 text-xs text-muted">{siteConfig.workHours}</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Открыть меню"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className="-ml-2 flex size-10 items-center justify-center text-ink transition-colors hover:text-accent"
      >
        <Menu className="size-5" strokeWidth={1.5} aria-hidden="true" />
      </button>
      {mounted && createPortal(drawer, document.body)}
    </>
  );
}
