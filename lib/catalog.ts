import { categories } from '@/data/categories';
import type { CategorySlug, FlowerColor, Occasion, Product, ProductSize } from '@/types';

export const PAGE_SIZE = 12;

export const occasionLabels: Record<Occasion, string> = {
  birthday: 'День рождения',
  love: 'Любимой',
  wedding: 'Свадьба',
  mom: 'Маме',
  thanks: 'Благодарность',
  'just-because': 'Без повода',
};

// Оттенки кружков — только значения из DESIGN.md (палитра §2 и CSS-токены surface-*)
export const colorSwatches: Record<FlowerColor, { label: string; value: string }> = {
  red: { label: 'Красные', value: '#cc1818' },
  pink: { label: 'Розовые', value: '#a7325f' },
  white: { label: 'Белые', value: '#ffffff' },
  peach: { label: 'Персиковые', value: '#fde6be' },
  yellow: { label: 'Жёлтые', value: '#e9c931' },
  blue: { label: 'Синие', value: '#3858e9' },
  mixed: {
    label: 'Микс',
    value: 'conic-gradient(#cc1818, #e9c931, #3858e9, #a7325f, #cc1818)',
  },
};

export const sizeLabels: Record<ProductSize, string> = {
  S: 'Небольшой',
  M: 'Средний',
  L: 'Большой',
};

export const sortOptions = [
  { value: 'popular', label: 'По популярности' },
  { value: 'rating', label: 'По рейтингу' },
  { value: 'new', label: 'Сначала новинки' },
  { value: 'price-asc', label: 'Сначала дешевле' },
  { value: 'price-desc', label: 'Сначала дороже' },
] as const;

export type SortValue = (typeof sortOptions)[number]['value'];

export type CatalogFilters = {
  category: CategorySlug | null;
  minPrice: number;
  maxPrice: number;
  occasions: Occasion[];
  colors: FlowerColor[];
  flowers: string[];
  sizes: ProductSize[];
};

export type CatalogState = CatalogFilters & { sort: SortValue; page: number };

export function getPriceBounds(list: Product[]): { min: number; max: number } {
  const prices = list.map((p) => p.price);
  const step = 500;
  return {
    min: Math.floor(Math.min(...prices) / step) * step,
    max: Math.ceil(Math.max(...prices) / step) * step,
  };
}

export function getFlowerOptions(list: Product[]): string[] {
  return Array.from(new Set(list.flatMap((p) => p.flowers))).sort((a, b) => a.localeCompare(b, 'ru'));
}

// ---------- URL <-> состояние ----------

const isCategory = (v: string): v is CategorySlug => categories.some((c) => c.slug === v);
const isOccasion = (v: string): v is Occasion => v in occasionLabels;
const isColor = (v: string): v is FlowerColor => v in colorSwatches;
const isSize = (v: string): v is ProductSize => v in sizeLabels;
const isSort = (v: string): v is SortValue => sortOptions.some((o) => o.value === v);

const list = (params: URLSearchParams, key: string) =>
  (params.get(key) ?? '').split(',').filter(Boolean);

const num = (value: string | null, fallback: number) => {
  const n = Number(value);
  return value !== null && Number.isFinite(n) ? n : fallback;
};

export function parseCatalogParams(params: URLSearchParams, bounds: { min: number; max: number }): CatalogState {
  const category = params.get('category');
  const sort = params.get('sort') ?? '';
  const minPrice = Math.max(bounds.min, num(params.get('minPrice'), bounds.min));
  const maxPrice = Math.min(bounds.max, num(params.get('maxPrice'), bounds.max));
  return {
    category: category && isCategory(category) ? category : null,
    minPrice: Math.min(minPrice, maxPrice),
    maxPrice: Math.max(minPrice, maxPrice),
    occasions: list(params, 'occasion').filter(isOccasion),
    colors: list(params, 'color').filter(isColor),
    flowers: list(params, 'flower'),
    sizes: list(params, 'size').filter(isSize),
    sort: isSort(sort) ? sort : 'popular',
    page: Math.max(1, Math.floor(num(params.get('page'), 1))),
  };
}

export function buildCatalogQuery(state: CatalogState, bounds: { min: number; max: number }): string {
  const params = new URLSearchParams();
  if (state.category) params.set('category', state.category);
  if (state.minPrice > bounds.min) params.set('minPrice', String(state.minPrice));
  if (state.maxPrice < bounds.max) params.set('maxPrice', String(state.maxPrice));
  if (state.occasions.length) params.set('occasion', state.occasions.join(','));
  if (state.colors.length) params.set('color', state.colors.join(','));
  if (state.flowers.length) params.set('flower', state.flowers.join(','));
  if (state.sizes.length) params.set('size', state.sizes.join(','));
  if (state.sort !== 'popular') params.set('sort', state.sort);
  if (state.page > 1) params.set('page', String(state.page));
  const query = params.toString();
  return query ? `?${query}` : '';
}

// ---------- фильтрация и сортировка ----------

const intersects = <T,>(a: T[], b: T[]) => b.length === 0 || a.some((x) => b.includes(x));

export function filterProducts(list: Product[], f: CatalogFilters): Product[] {
  return list.filter(
    (p) =>
      (!f.category || p.category === f.category) &&
      p.price >= f.minPrice &&
      p.price <= f.maxPrice &&
      intersects(p.occasions, f.occasions) &&
      intersects(p.colors, f.colors) &&
      intersects(p.flowers, f.flowers) &&
      (f.sizes.length === 0 || f.sizes.includes(p.size)),
  );
}

const popularity = (p: Product) => (p.isHit ? 1000 : 0) + p.reviewsCount * p.rating;

export function sortProducts(list: Product[], sort: SortValue): Product[] {
  const sorted = [...list];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
    case 'new':
      return sorted.sort((a, b) => Number(Boolean(b.isNew)) - Number(Boolean(a.isNew)) || popularity(b) - popularity(a));
    default:
      return sorted.sort((a, b) => popularity(b) - popularity(a));
  }
}

/** Сколько товаров даст фильтр, если переключить одно значение — для счётчиков у чекбоксов */
export function countWith(list: Product[], f: CatalogFilters, patch: Partial<CatalogFilters>): number {
  return filterProducts(list, { ...f, ...patch }).length;
}

export function countActiveFilters(f: CatalogFilters, bounds: { min: number; max: number }): number {
  return (
    (f.category ? 1 : 0) +
    (f.minPrice > bounds.min || f.maxPrice < bounds.max ? 1 : 0) +
    f.occasions.length +
    f.colors.length +
    f.flowers.length +
    f.sizes.length
  );
}
