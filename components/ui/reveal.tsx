'use client';

import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

// ANIMATIONS.md easing cubic-bezier(.19,1,.22,1) — «out-expo»
export const EASE_OUT_EXPO: [number, number, number, number] = [0.19, 1, 0.22, 1];

type RevealProps = Omit<HTMLMotionProps<'div'>, 'children'> & {
  children: ReactNode;
  delay?: number;
  /** Смещение снизу в px */
  y?: number;
};

/** Появление при скролле: fade + подъём на 24px, 600ms. Уважает prefers-reduced-motion через MotionConfig. */
export function Reveal({ children, delay = 0, y = 24, ...props }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Шаг каскада в сетках — 80ms */
export const STAGGER = 0.08;
