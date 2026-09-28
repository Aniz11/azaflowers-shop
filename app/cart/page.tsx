import type { Metadata } from 'next';
import { CartView } from '@/components/cart/cart-view';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Overline } from '@/components/ui/section-heading';

export const metadata: Metadata = {
  title: 'Корзина',
  description: 'Корзина AzaFlowers: проверьте заказ, примените промокод и оформите доставку.',
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <header className="container-shop pb-10 pt-10 lg:pb-12 lg:pt-16">
        <Breadcrumbs items={[{ label: 'Главная', href: '/' }, { label: 'Корзина' }]} />
        <Overline index="01" className="mt-10">
          Шаг 1 из 2
        </Overline>
        <h1 className="mt-5 text-5xl text-ink lg:text-7xl">
          Корзина<span className="text-accent">.</span>
        </h1>
      </header>
      <CartView />
    </>
  );
}
