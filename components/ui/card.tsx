import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Плоские карточки с волосяной рамкой; тень появляется только при интерактиве (interactive)
const cardVariants = cva('bg-paper transition-shadow duration-300', {
  variants: {
    variant: {
      outline: 'border border-line',
      rounded: 'rounded-lg border border-line',
      muted: 'bg-surface',
    },
    padding: {
      none: 'p-0',
      md: 'p-6',
      lg: 'p-8 md:p-10',
    },
    interactive: {
      true: 'hover:shadow-soft',
      false: '',
    },
  },
  defaultVariants: { variant: 'outline', padding: 'md', interactive: false },
});

export type CardProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant, padding, interactive }), className)} {...props} />
  ),
);
Card.displayName = 'Card';

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-heading text-lg font-normal text-ink', className)} {...props} />;
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted', className)} {...props} />;
}
