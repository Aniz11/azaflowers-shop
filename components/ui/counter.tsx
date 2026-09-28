'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';

type Props = { value: number; decimals?: number; suffix?: string; duration?: number };

/** Число «набегает» от 0 при появлении в зоне видимости (один раз) */
export function Counter({ value, decimals = 0, suffix = '', duration = 2 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.19, 1, 0.22, 1],
      onUpdate: setDisplay,
    });
    return () => controls.stop();
  }, [inView, value, duration, reduced]);

  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(display);

  return (
    <span ref={ref}>
      {/* Скринридер сразу получает итоговое значение, а не мелькающие цифры */}
      <span aria-hidden="true">
        {formatted}
        {suffix}
      </span>
      <span className="sr-only">
        {new Intl.NumberFormat('ru-RU', { maximumFractionDigits: decimals }).format(value)}
        {suffix}
      </span>
    </span>
  );
}
