import type { Metadata } from 'next';
import { FavoritesView } from '@/components/product/favorites-view';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Overline } from '@/components/ui/section-heading';

export const metadata: Metadata = {
  title: 'Избранное',
  description: 'Сохранённые букеты AzaFlowers.',
  robots: { index: false, follow: true },
};

export default function FavoritesPage() {
  return (
    <div className="container-shop pb-16 lg:pb-32">
      <header className="pb-12 pt-10 lg:pb-16 lg:pt-16">
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Избранное' }]} />
        <Overline className="mt-10">Сохранённое</Overline>
        <h1 className="mt-5 text-5xl text-ink lg:text-7xl">
          Избранное<span className="text-accent">.</span>
        </h1>
      </header>
      <FavoritesView />
    </div>
  );
}
