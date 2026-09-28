import type { Metadata } from 'next';
import { CheckoutView } from '@/components/checkout/checkout-view';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Overline } from '@/components/ui/section-heading';

export const metadata: Metadata = {
  title: 'Оформление заказа',
  description: 'Оформление заказа AzaFlowers: контакты, адрес, дата и время доставки, способ оплаты.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <header className="container-shop pb-10 pt-10 lg:pb-16 lg:pt-16">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Корзина', href: '/cart' },
            { label: 'Оформление' },
          ]}
        />
        <Overline index="02" className="mt-10">
          Шаг 2 из 2
        </Overline>
        <h1 className="mt-5 text-5xl text-ink lg:text-7xl">
          Оформление<span className="text-accent">.</span>
        </h1>
      </header>
      <CheckoutView />
    </>
  );
}
