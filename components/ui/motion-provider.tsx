'use client';

import type { ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

/** Все framer-анимации отключают transform-движение при prefers-reduced-motion */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
