'use client';

import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Breadcrumbs, type Crumb } from '@/components/ui/breadcrumbs';
import { EASE_OUT_EXPO } from '@/components/ui/reveal';
import { Overline } from '@/components/ui/section-heading';
import { categories } from '@/data/categories';

/** Заголовок каталога подстраивается под выбранную категорию из URL */
export function CatalogHeading({ total }: { total: number }) {
  const slug = useSearchParams().get('category');
  const category = categories.find((c) => c.slug === slug);

  const crumbs: Crumb[] = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: category ? '/catalog' : undefined },
    ...(category ? [{ label: category.name }] : []),
  ];

  return (
    <header className="pb-12 pt-10 lg:pb-16 lg:pt-16">
      <Breadcrumbs items={crumbs} />
      <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Overline index={category ? undefined : String(total)}>{category ? 'Категория' : 'Позиций в каталоге'}</Overline>
          <motion.h1
            key={category?.slug ?? 'all'}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT_EXPO }}
            className="mt-5 text-5xl text-ink lg:text-7xl"
          >
            {category ? category.name : 'Каталог'}
            <span className="text-accent">.</span>
          </motion.h1>
        </div>
        <p className="max-w-sm text-sm text-muted">
          {category
            ? category.description
            : 'Свежие букеты, композиции и подарки. Выберите повод, оттенок и бюджет — остальное мы возьмём на себя.'}
        </p>
      </div>
    </header>
  );
}
