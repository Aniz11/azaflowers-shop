'use client';

import { useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { categories } from '@/data/categories';
import {
  colorSwatches,
  countWith,
  occasionLabels,
  sizeLabels,
  type CatalogFilters,
} from '@/lib/catalog';
import { cn, formatPrice, plural } from '@/lib/utils';
import type { FlowerColor, Occasion, Product, ProductSize } from '@/types';

type Props = {
  products: Product[];
  draft: CatalogFilters;
  onChange: (draft: CatalogFilters) => void;
  onApply: () => void;
  onReset: () => void;
  bounds: { min: number; max: number };
  flowerOptions: string[];
  /** Черновик отличается от применённых фильтров */
  dirty: boolean;
};

const toggle = <T,>(list: T[], value: T): T[] =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

function Group({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className="border-b border-line py-6 first:pt-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between font-nav text-xs uppercase tracking-button text-ink transition-colors hover:text-accent"
        >
          {title}
          {open ? (
            <Minus className="size-3" aria-hidden="true" />
          ) : (
            <Plus className="size-3" aria-hidden="true" />
          )}
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckRow({
  id,
  label,
  count,
  checked,
  onToggle,
}: {
  id: string;
  label: string;
  count: number;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <li className="flex items-center gap-3">
      <Checkbox id={id} checked={checked} onCheckedChange={onToggle} disabled={!checked && count === 0} />
      <label
        htmlFor={id}
        className={cn(
          'flex flex-1 cursor-pointer items-center justify-between text-sm transition-colors hover:text-accent',
          !checked && count === 0 ? 'cursor-not-allowed text-muted-light hover:text-muted-light' : 'text-ink',
        )}
      >
        {label}
        <span className="text-xs text-muted-light">{count}</span>
      </label>
    </li>
  );
}

export function CatalogFiltersPanel({ products, draft, onChange, onApply, onReset, bounds, flowerOptions, dirty }: Props) {
  const uid = useId();
  const previewCount = countWith(products, draft, {});
  const set = (patch: Partial<CatalogFilters>) => onChange({ ...draft, ...patch });

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1">
        <Group title="Категория">
          <ul className="space-y-3">
            <li>
              <button
                type="button"
                onClick={() => set({ category: null })}
                aria-pressed={draft.category === null}
                className={cn(
                  'flex w-full items-center justify-between text-left text-sm transition-colors hover:text-accent',
                  draft.category === null ? 'text-accent' : 'text-ink',
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn('size-1 rounded-full bg-accent transition-transform', draft.category === null ? 'scale-100' : 'scale-0')}
                  />
                  Все букеты
                </span>
                <span className="text-xs text-muted-light">{countWith(products, draft, { category: null })}</span>
              </button>
            </li>
            {categories.map((category) => {
              const active = draft.category === category.slug;
              const count = countWith(products, draft, { category: category.slug });
              return (
                <li key={category.slug}>
                  <button
                    type="button"
                    onClick={() => set({ category: active ? null : category.slug })}
                    aria-pressed={active}
                    className={cn(
                      'group flex w-full items-center justify-between text-left text-sm transition-colors hover:text-accent',
                      active ? 'text-accent' : count === 0 ? 'text-muted-light' : 'text-ink',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={cn('size-1 rounded-full bg-accent transition-transform', active ? 'scale-100' : 'scale-0')}
                      />
                      {category.name}
                    </span>
                    <span className="text-xs text-muted-light">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Group>

        <Group title="Цена">
          <Slider
            min={bounds.min}
            max={bounds.max}
            step={500}
            minStepsBetweenThumbs={1}
            value={[draft.minPrice, draft.maxPrice]}
            onValueChange={([minPrice, maxPrice]) => set({ minPrice, maxPrice })}
            thumbLabels={['Минимальная цена', 'Максимальная цена']}
          />
          <div className="mt-4 flex items-center justify-between text-sm text-ink">
            <output aria-live="polite">{formatPrice(draft.minPrice)}</output>
            <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
            <output aria-live="polite">{formatPrice(draft.maxPrice)}</output>
          </div>
        </Group>

        <Group title="Повод">
          <ul className="space-y-3">
            {(Object.keys(occasionLabels) as Occasion[]).map((occasion) => (
              <CheckRow
                key={occasion}
                id={`${uid}-occ-${occasion}`}
                label={occasionLabels[occasion]}
                checked={draft.occasions.includes(occasion)}
                count={countWith(products, draft, { occasions: [occasion] })}
                onToggle={() => set({ occasions: toggle(draft.occasions, occasion) })}
              />
            ))}
          </ul>
        </Group>

        <Group title="Цвет">
          <ul className="flex flex-wrap gap-3">
            {(Object.keys(colorSwatches) as FlowerColor[]).map((color) => {
              const active = draft.colors.includes(color);
              const { label, value } = colorSwatches[color];
              return (
                <li key={color}>
                  <button
                    type="button"
                    title={label}
                    aria-label={label}
                    aria-pressed={active}
                    onClick={() => set({ colors: toggle(draft.colors, color) })}
                    className={cn(
                      'relative flex size-9 items-center justify-center rounded-full border transition-all duration-300',
                      active ? 'border-ink' : 'border-transparent hover:border-line-strong',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="size-6 rounded-full border border-line"
                      style={{ background: value }}
                    />
                    {active && (
                      <Check
                        aria-hidden="true"
                        className={cn(
                          'absolute size-3',
                          color === 'white' || color === 'peach' ? 'text-ink' : 'text-paper',
                        )}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </Group>

        <Group title="Состав" defaultOpen={false}>
          <ul className="space-y-3">
            {flowerOptions.map((flower, i) => (
              <CheckRow
                key={flower}
                id={`${uid}-fl-${i}`}
                label={flower}
                checked={draft.flowers.includes(flower)}
                count={countWith(products, draft, { flowers: [flower] })}
                onToggle={() => set({ flowers: toggle(draft.flowers, flower) })}
              />
            ))}
          </ul>
        </Group>

        <Group title="Размер">
          <ul className="grid grid-cols-3 gap-2">
            {(Object.keys(sizeLabels) as ProductSize[]).map((size) => {
              const active = draft.sizes.includes(size);
              return (
                <li key={size}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => set({ sizes: toggle(draft.sizes, size) })}
                    className={cn(
                      'flex h-14 w-full flex-col items-center justify-center border text-xs transition-colors duration-300',
                      active ? 'border-ink bg-ink text-paper' : 'border-line text-ink hover:border-ink',
                    )}
                  >
                    <span className="font-heading text-base">{size}</span>
                    <span className={active ? 'text-paper' : 'text-muted'}>{sizeLabels[size]}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Group>
      </div>

      <div className="sticky bottom-0 -mx-1 flex flex-col gap-3 bg-paper px-1 pb-1 pt-6">
        <Button type="button" variant={dirty ? 'dark' : 'subtle'} onClick={onApply} disabled={previewCount === 0}>
          {previewCount === 0
            ? 'Ничего не найдено'
            : `Применить · ${previewCount} ${plural(previewCount, ['товар', 'товара', 'товаров'])}`}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onReset}>
          Сбросить всё
        </Button>
      </div>
    </div>
  );
}
