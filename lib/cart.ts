import { getProductById } from '@/data/products';
import { deliveryCost } from '@/lib/delivery';
import { getSizeVariants, getVariantPrice } from '@/lib/product';
import { checkPromo, findPromo, type Promo } from '@/lib/promo';
import type { CartItem, Product } from '@/types';

export type CartLine = {
  key: string;
  item: CartItem;
  product: Product;
  sizeLabel?: string;
  unitPrice: number;
  total: number;
};

export type DeliveryMethod = 'courier' | 'pickup';

export type CartTotals = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
  promo?: Promo;
  /** Промокод сохранён, но перестал подходить (например, сумма уменьшилась) */
  promoError?: string;
};

export const lineKey = (item: CartItem) => `${item.productId}:${item.size ?? '-'}`;

export function computeTotals(
  items: CartItem[],
  promoCode: string | null,
  deliveryMethod: DeliveryMethod = 'courier',
): CartTotals {
  const lines: CartLine[] = items.flatMap((item) => {
    const product = getProductById(item.productId);
    if (!product) return [];
    const unitPrice = getVariantPrice(product, item.size);
    const sizeLabel = getSizeVariants(product).find((v) => v.id === item.size)?.label;
    return [{ key: lineKey(item), item, product, sizeLabel, unitPrice, total: unitPrice * item.quantity }];
  });

  const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
  const count = lines.reduce((sum, line) => sum + line.item.quantity, 0);

  let promo = findPromo(promoCode);
  let promoError: string | undefined;
  if (promo) {
    const check = checkPromo(promo.code, subtotal);
    if (!check.ok) {
      promoError = check.error;
      promo = undefined;
    }
  }

  const discount =
    promo?.kind === 'percent'
      ? Math.round((subtotal * promo.value) / 100)
      : promo?.kind === 'fixed'
        ? Math.min(promo.value, subtotal)
        : 0;

  const delivery =
    deliveryMethod === 'pickup' || promo?.kind === 'free-delivery' ? 0 : deliveryCost(subtotal - discount);

  return { lines, count, subtotal, discount, delivery, total: subtotal - discount + delivery, promo, promoError };
}
