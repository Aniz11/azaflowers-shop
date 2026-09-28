import { Reveal, STAGGER } from '@/components/ui/reveal';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';
import { ProductCard } from './product-card';

type ProductGridProps = {
  products: Product[];
  className?: string;
  priorityCount?: number;
  /** Плотность сетки: 4 — главная и каталог в плотном режиме, 3 — каталог с сайдбаром */
  columns?: 3 | 4;
};

const columnClasses: Record<3 | 4, string> = {
  4: 'lg:grid-cols-4',
  3: 'md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3',
};

/** Сетка с каскадным появлением (шаг 80ms, сбрасывается на каждой строке) */
export function ProductGrid({ products, className, priorityCount = 0, columns = 4 }: ProductGridProps) {
  return (
    <ul className={cn('grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:gap-y-16', columnClasses[columns], className)}>
      {products.map((product, i) => (
        <li key={product.id}>
          <Reveal delay={(i % columns) * STAGGER} className="h-full">
            <ProductCard product={product} priority={i < priorityCount} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
