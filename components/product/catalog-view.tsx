'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Grid2x2, Grid3x3, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getCategory } from '@/data/categories';
import {
  PAGE_SIZE,
  buildCatalogQuery,
  colorSwatches,
  countActiveFilters,
  filterProducts,
  getFlowerOptions,
  getPriceBounds,
  occasionLabels,
  parseCatalogParams,
  sizeLabels,
  sortOptions,
  sortProducts,
  type CatalogFilters,
  type CatalogState,
  type SortValue,
} from '@/lib/catalog';
import { cn, formatPrice, plural } from '@/lib/utils';
import type { Product } from '@/types';
import { CatalogFiltersPanel } from './catalog-filters';
import { ProductGrid } from './product-grid';

type Chip = { key: string; label: string; patch: Partial<CatalogFilters> };

const toFilters = ({ sort: _sort, page: _page, ...filters }: CatalogState): CatalogFilters => filters;

const sameFilters = (a: CatalogFilters, b: CatalogFilters) => JSON.stringify(a) === JSON.stringify(b);

export function CatalogView({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const topRef = useRef<HTMLDivElement>(null);

  const bounds = useMemo(() => getPriceBounds(products), [products]);
  const flowerOptions = useMemo(() => getFlowerOptions(products), [products]);
  const state = useMemo(
    () => parseCatalogParams(new URLSearchParams(searchParams.toString()), bounds),
    [searchParams, bounds],
  );
  const applied = useMemo(() => toFilters(state), [state]);

  // Черновик фильтров: меняется в сайдбаре, в URL уходит только по «Применить»
  const [draft, setDraft] = useState<CatalogFilters>(applied);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dense, setDense] = useState(false);

  useEffect(() => setDraft(applied), [applied]);

  const filtered = useMemo(() => sortProducts(filterProducts(products, applied), state.sort), [products, applied, state.sort]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(state.page, totalPages);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeCount = countActiveFilters(applied, bounds);

  // Прокрутка к началу списка — только после перерисовки с новыми фильтрами,
  // и с отступом под липкий хедер (80px + воздух), иначе тулбар уезжает под него
  const pendingScroll = useRef(false);
  const scrollToTop = () => {
    const el = topRef.current;
    if (!el) return;
    // Next после навигации сам вызывает scrollTo(0, текущий Y), что обрывает плавную прокрутку, —
    // поэтому стартуем через кадр, уже после него
    window.setTimeout(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - 112;
      if (window.scrollY > top) window.scrollTo({ top, behavior: 'smooth' });
    }, 50);
  };

  const navigate = (next: CatalogState, { scroll = false } = {}) => {
    pendingScroll.current = scroll;
    router.push(`${pathname}${buildCatalogQuery(next, bounds)}`, { scroll: false });
  };

  useEffect(() => {
    if (!pendingScroll.current) return;
    pendingScroll.current = false;
    scrollToTop();
  }, [state]);

  const applyDraft = () => {
    navigate({ ...state, ...draft, page: 1 }, { scroll: true });
    setSheetOpen(false);
  };

  const resetAll = () => {
    navigate({ ...state, category: null, minPrice: bounds.min, maxPrice: bounds.max, occasions: [], colors: [], flowers: [], sizes: [], page: 1 });
    setSheetOpen(false);
  };

  // При смене страницы — плавно к началу сетки
  const prevPage = useRef(page);
  useEffect(() => {
    if (prevPage.current !== page) scrollToTop();
    prevPage.current = page;
  }, [page]);

  const chips: Chip[] = [
    ...(applied.category ? [{ key: 'cat', label: getCategory(applied.category)?.name ?? '', patch: { category: null } }] : []),
    ...(applied.minPrice > bounds.min || applied.maxPrice < bounds.max
      ? [
          {
            key: 'price',
            label: `${formatPrice(applied.minPrice)} — ${formatPrice(applied.maxPrice)}`,
            patch: { minPrice: bounds.min, maxPrice: bounds.max },
          },
        ]
      : []),
    ...applied.occasions.map((o) => ({
      key: `o-${o}`,
      label: occasionLabels[o],
      patch: { occasions: applied.occasions.filter((x) => x !== o) },
    })),
    ...applied.colors.map((c) => ({
      key: `c-${c}`,
      label: colorSwatches[c].label,
      patch: { colors: applied.colors.filter((x) => x !== c) },
    })),
    ...applied.flowers.map((f) => ({
      key: `f-${f}`,
      label: f,
      patch: { flowers: applied.flowers.filter((x) => x !== f) },
    })),
    ...applied.sizes.map((s) => ({
      key: `s-${s}`,
      label: sizeLabels[s],
      patch: { sizes: applied.sizes.filter((x) => x !== s) },
    })),
  ];

  const panel = (
    <CatalogFiltersPanel
      products={products}
      draft={draft}
      onChange={setDraft}
      onApply={applyDraft}
      onReset={resetAll}
      bounds={bounds}
      flowerOptions={flowerOptions}
      dirty={!sameFilters(draft, applied)}
    />
  );

  const from = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <div ref={topRef} className="grid gap-10 lg:grid-cols-[256px_1fr] lg:gap-12 xl:grid-cols-[288px_1fr] xl:gap-16">
      <aside aria-labelledby="filters-title" className="hidden lg:block">
        <h2 id="filters-title" className="sr-only">
          Фильтры
        </h2>
        {/* Своя прокрутка: панель выше экрана, иначе нижние фильтры были бы недостижимы */}
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain pr-3">{panel}</div>
      </aside>

      <div>
        {/* Панель инструментов: счётчик, мобильные фильтры, плотность, сортировка */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <p id="catalog-status" className="text-sm text-muted" aria-live="polite">
            {filtered.length === 0 ? (
              'Ничего не найдено'
            ) : (
              <>
                Показано <span className="text-ink">{from}–{to}</span> из{' '}
                <span className="text-ink">
                  {filtered.length} {plural(filtered.length, ['товара', 'товаров', 'товаров'])}
                </span>
              </>
            )}
          </p>

          <div className="flex items-center gap-4">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 font-nav text-xs uppercase tracking-button text-ink transition-colors hover:text-accent lg:hidden"
                >
                  <SlidersHorizontal className="size-4" strokeWidth={1.5} aria-hidden="true" />
                  Фильтры
                  {activeCount > 0 && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-accent font-body text-xs text-paper">
                      {activeCount}
                    </span>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent title="Фильтры" aria-describedby={undefined}>
                <div className="flex-1 overflow-y-auto px-6 py-6">{panel}</div>
              </SheetContent>
            </Sheet>

            <div className="hidden items-center gap-1 xl:flex" role="group" aria-label="Плотность сетки">
              {[
                { value: false, icon: Grid2x2, label: '3 в ряд' },
                { value: true, icon: Grid3x3, label: '4 в ряд' },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  aria-pressed={dense === value}
                  onClick={() => setDense(value)}
                  className={cn(
                    'flex size-8 items-center justify-center transition-colors',
                    dense === value ? 'text-ink' : 'text-line-strong hover:text-muted',
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
              ))}
            </div>

            <label className="sr-only" id="sort-label">
              Сортировка
            </label>
            <Select
              value={state.sort}
              onValueChange={(value) => navigate({ ...state, sort: value as SortValue, page: 1 })}
            >
              <SelectTrigger aria-labelledby="sort-label" className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Активные фильтры — снимаются по одному */}
        <AnimatePresence initial={false}>
          {chips.length > 0 && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex flex-wrap items-center gap-2 overflow-hidden pt-4"
              aria-label="Активные фильтры"
            >
              {chips.map((chip) => (
                <li key={chip.key}>
                  <button
                    type="button"
                    onClick={() => navigate({ ...state, ...chip.patch, page: 1 })}
                    aria-label={`Убрать фильтр «${chip.label}»`}
                    className="group flex items-center gap-2 rounded-full border border-line py-1 pl-3 pr-2 text-xs text-ink transition-colors hover:border-ink"
                  >
                    {chip.label}
                    <X className="size-3 text-muted transition-colors group-hover:text-accent" aria-hidden="true" />
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={resetAll} className="link-underline ml-2 text-xs text-muted hover:text-ink">
                  Сбросить всё
                </button>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>

        <div className="pt-10">
          <h2 className="sr-only">Товары</h2>
          {visible.length > 0 ? (
            <ProductGrid
              key={`${buildCatalogQuery(state, bounds)}-${dense}`}
              products={visible}
              priorityCount={4}
              columns={dense ? 4 : 3}
              className={dense ? 'md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6' : undefined}
            />
          ) : (
            <div className="flex flex-col items-center border border-line px-6 py-20 text-center">
              <span className="flex size-16 items-center justify-center rounded-full border border-line-strong font-nav text-xl text-muted">
                ?
              </span>
              <h2 className="mt-6 text-3xl text-ink">Таких букетов пока нет</h2>
              <p className="mt-3 max-w-sm text-sm text-muted">
                Попробуйте ослабить фильтры или напишите нам — соберём букет под ваш запрос.
              </p>
              <Button variant="outline" className="mt-8" onClick={resetAll}>
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>

        <Pagination
          className="mt-16 lg:mt-24"
          page={page}
          totalPages={totalPages}
          hrefFor={(p) => `${pathname}${buildCatalogQuery({ ...state, page: p }, bounds)}`}
        />
      </div>
    </div>
  );
}
