import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SuccessView } from '@/components/checkout/success-view';

export const metadata: Metadata = {
  title: 'Заказ оформлен',
  description: 'Спасибо за заказ в AzaFlowers.',
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div aria-busy="true" className="min-h-[60vh]" />}>
      <SuccessView />
    </Suspense>
  );
}
