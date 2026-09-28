'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/lib/site';

// Кнопка мессенджера с пульсирующим кольцом (keyframe `animate` из ANIMATIONS.md)
// и минималистичная кнопка «наверх» в контурном круге
export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 800);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-floating flex flex-col items-center gap-3 md:bottom-8 md:right-8">
      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            aria-label="Наверх"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex size-12 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors duration-300 hover:border-ink"
          >
            <ArrowUp className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>

      <a
        href={siteConfig.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в WhatsApp"
        className="relative flex size-12 items-center justify-center rounded-full bg-success text-paper"
      >
        <span className="absolute -inset-2 animate-ring rounded-full border border-success" aria-hidden="true" />
        <MessageCircle className="relative size-5" strokeWidth={1.5} aria-hidden="true" />
      </a>
    </div>
  );
}
