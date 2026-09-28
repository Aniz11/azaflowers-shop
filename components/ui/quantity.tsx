'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type QuantityProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  size?: 'sm' | 'md';
  className?: string;
};

/** Степпер количества: тонкая рамка, кнопки −/+ и живое значение для скринридеров */
export function Quantity({ value, onChange, min = 1, max = 99, label, size = 'md', className }: QuantityProps) {
  const box = size === 'sm' ? 'h-10' : 'h-14';
  const btn = size === 'sm' ? 'w-10' : 'w-12';
  return (
    <div role="group" aria-label={label} className={cn('inline-flex items-center border border-line', box, className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Уменьшить количество"
        className={cn('flex h-full items-center justify-center text-ink transition-colors hover:text-accent disabled:text-line-strong', btn)}
      >
        <Minus className="size-4" strokeWidth={1.5} aria-hidden="true" />
      </button>
      <output aria-live="polite" className="min-w-8 text-center font-heading text-base text-ink">
        {value}
      </output>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Увеличить количество"
        className={cn('flex h-full items-center justify-center text-ink transition-colors hover:text-accent disabled:text-line-strong', btn)}
      >
        <Plus className="size-4" strokeWidth={1.5} aria-hidden="true" />
      </button>
    </div>
  );
}
