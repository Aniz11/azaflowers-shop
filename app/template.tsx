'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * Переход между страницами без перезагрузки: template.tsx пересоздаётся при каждой навигации,
 * поэтому содержимое мягко проявляется. Только opacity — без сдвигов макета.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}
