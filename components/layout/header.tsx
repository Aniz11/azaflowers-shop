'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { mainNav } from '@/lib/site';
import { cn } from '@/lib/utils';
import { HeaderActions } from './header-actions';
import { Logo } from './logo';
import { MainNav } from './main-nav';
import { MobileMenu } from './mobile-menu';
import { TopBar } from './top-bar';

const HIDE_AFTER = 160;
const leftNav = mainNav.slice(0, 3);
const rightNav = mainNav.slice(3);

/**
 * Тонкий топбар уезжает вместе со страницей; основная строка — липкая:
 * прячется при скролле вниз и возвращается при скролле вверх. Без blur (запрещён DESIGN.md).
 * Логотип по центру, как в образце; меню разделено на две половины вокруг него.
 */
export function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setHidden(y > HIDE_AFTER && y > lastY.current);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <TopBar />
      <motion.header
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.4, ease: [0.25, 0, 0, 1] }}
        className={cn(
          'sticky top-0 z-header border-b bg-paper transition-[border-color,box-shadow] duration-300',
          scrolled ? 'border-line shadow-soft' : 'border-transparent',
        )}
      >
        <div className="container-shop grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-2 xl:h-20 xl:gap-6">
          <div className="flex items-center">
            <div className="xl:hidden">
              <MobileMenu />
            </div>
            <MainNav links={leftNav} label="Основная навигация" className="hidden xl:block" />
          </div>
          <Logo />
          <div className="flex items-center justify-end gap-8">
            <MainNav links={rightNav} label="Информация" className="hidden xl:block" />
            <HeaderActions />
          </div>
        </div>
      </motion.header>
    </>
  );
}
