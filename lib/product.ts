import { getCategory } from '@/data/categories';
import { products } from '@/data/products';
import type { Product, ProductSize } from '@/types';

export type SizeVariant = { id: ProductSize; label: string; note: string; price: number };

const round500 = (n: number) => Math.round(n / 500) * 500;

// Цветочные букеты можно заказать в трёх размерах; подарки и сладости — только как есть
const SIZE_FACTORS: Record<ProductSize, number> = { S: 0.7, M: 1, L: 1.4 };
const SIZE_NOTES: Record<ProductSize, string> = { S: 'Компактнее', M: 'Как на фото', L: 'Пышнее' };
const SIZE_LABELS: Record<ProductSize, string> = { S: 'Небольшой', M: 'Стандарт', L: 'Большой' };

export function hasSizeVariants(product: Product): boolean {
  return product.category !== 'gifts' && product.category !== 'baskets';
}

export function getSizeVariants(product: Product): SizeVariant[] {
  if (!hasSizeVariants(product)) return [];
  // Цена на карточке — это размер «как на фото» (M)
  return (['S', 'M', 'L'] as const).map((id) => ({
    id,
    label: SIZE_LABELS[id],
    note: SIZE_NOTES[id],
    price: id === 'M' ? product.price : round500(product.price * SIZE_FACTORS[id]),
  }));
}

/** Цена позиции с учётом выбранного размера (используется и в корзине) */
export function getVariantPrice(product: Product, size?: string): number {
  const variant = getSizeVariants(product).find((v) => v.id === size);
  return variant?.price ?? product.price;
}

export function getGallery(product: Product): string[] {
  const categoryImage = getCategory(product.category)?.image;
  return Array.from(new Set([...product.images, ...(categoryImage ? [categoryImage] : [])]));
}

/** Похожие: та же категория, затем общие поводы и цвета */
export function getSimilarProducts(product: Product, limit = 8): Product[] {
  const score = (p: Product) =>
    (p.category === product.category ? 10 : 0) +
    p.occasions.filter((o) => product.occasions.includes(o)).length * 2 +
    p.colors.filter((c) => product.colors.includes(c)).length;
  return products
    .filter((p) => p.id !== product.id)
    .map((p) => ({ p, s: score(p) }))
    .filter(({ s }) => s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ p }) => p);
}
