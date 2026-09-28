import type { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva('inline-flex items-center justify-center leading-none', {
  variants: {
    variant: {
      // метки на фото товара — маленькие, плоские
      accent: 'bg-accent px-2 py-1 font-nav text-xs uppercase tracking-button text-paper',
      light: 'bg-paper px-2 py-1 font-nav text-xs uppercase tracking-button text-ink',
      sale: 'bg-ink px-2 py-1 font-nav text-xs uppercase tracking-button text-paper',
      // счётчики в сайдбаре каталога
      muted: 'min-w-6 rounded-full bg-surface px-2 py-1 font-body text-xs text-muted',
      // тонкий чип-фильтр
      outline:
        'gap-2 rounded-full border border-line px-4 py-2 font-body text-sm text-ink transition-colors hover:border-ink',
      // количество на иконке корзины
      count: 'size-5 rounded-full bg-accent font-body text-xs text-paper',
    },
  },
  defaultVariants: { variant: 'accent' },
});

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };
