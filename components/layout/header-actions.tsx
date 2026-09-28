'use client';

import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '@/components/cart/store-provider';
import { Badge } from '@/components/ui/badge';

const iconLink =
  'relative flex size-10 items-center justify-center text-ink transition-colors duration-300 hover:text-accent';

export function HeaderActions() {
  const { cartCount, favorites, hydrated, lastAddedAt } = useStore();
  const cart = hydrated ? cartCount : 0;
  const fav = hydrated ? favorites.length : 0;

  return (
    <div className="flex items-center gap-1">
      <Link href="/favorites" aria-label={`Избранное, товаров: ${fav}`} className={iconLink}>
        <Heart className="size-5" strokeWidth={1.5} aria-hidden="true" />
        {fav > 0 && (
          <Badge variant="count" className="absolute right-0 top-0" aria-hidden="true">
            {fav}
          </Badge>
        )}
      </Link>
      <Link href="/cart" aria-label={`Корзина, товаров: ${cart}`} className={iconLink}>
        {/* key перезапускает keyframe `shakes` из образца при каждом добавлении */}
        <span key={lastAddedAt} className={lastAddedAt ? 'animate-shakes' : undefined}>
          <ShoppingBag className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </span>
        {cart > 0 && (
          <Badge variant="count" className="absolute right-0 top-0" aria-hidden="true">
            {cart}
          </Badge>
        )}
      </Link>
    </div>
  );
}
