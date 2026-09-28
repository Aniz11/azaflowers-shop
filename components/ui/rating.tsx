import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type RatingProps = { value: number; count?: number; className?: string; size?: 'sm' | 'md' };

export function Rating({ value, count, className, size = 'sm' }: RatingProps) {
  const rounded = Math.round(value);
  const star = size === 'sm' ? 'size-3' : 'size-4';
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="flex items-center gap-0.5" role="img" aria-label={`Рейтинг ${value.toFixed(1)} из 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            aria-hidden="true"
            className={cn(star, i < rounded ? 'fill-accent text-accent' : 'fill-line-strong text-line-strong')}
          />
        ))}
      </span>
      {count !== undefined && <span className="text-xs text-muted-light">({count})</span>}
    </div>
  );
}
