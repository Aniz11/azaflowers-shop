import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CatalogHeading } from '@/components/product/catalog-heading';
import { CatalogView } from '@/components/product/catalog-view';
import { img } from '@/data/images';
import { products } from '@/data/products';

export const metadata: Metadata = {
  title: 'Каталог букетов',
  description:
    'Каталог букетов AzaFlowers: розы, пионы, авторские композиции, цветы в коробке и подарки. Фильтры по поводу, цвету, составу и цене.',
  alternates: { canonical: '/catalog' },
  openGraph: {
    title: 'Каталог букетов — AzaFlowers',
    description: 'Свежие букеты с доставкой по Астане за 60 минут.',
    url: '/catalog',
    images: [{ url: img.gardenRoses, width: 1200, height: 1200, alt: 'Садовые розы' }],
  },
};

function CatalogFallback() {
  return (
    <div aria-busy="true" aria-label="Загрузка каталога" className="grid grid-cols-2 gap-8 pt-16 lg:grid-cols-4">
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="relative aspect-[4/5] overflow-hidden bg-surface">
          <span className="absolute inset-y-0 w-36 animate-load-product bg-gradient-to-r from-transparent via-paper to-transparent" />
        </div>
      ))}
    </div>
  );
}

export default function CatalogPage() {
  return (
    <div className="container-shop pb-16 lg:pb-32">
      {/* useSearchParams в клиентских компонентах требует Suspense для статической сборки */}
      <Suspense fallback={<CatalogFallback />}>
        <CatalogHeading total={products.length} />
        <CatalogView products={products} />
      </Suspense>
    </div>
  );
}
