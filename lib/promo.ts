export type Promo =
  | { code: string; kind: 'percent'; value: number; minSubtotal?: number; description: string }
  | { code: string; kind: 'fixed'; value: number; minSubtotal?: number; description: string }
  | { code: string; kind: 'free-delivery'; minSubtotal?: number; description: string };

// Моковые промокоды. HELLO10 выдаётся при подписке на главной.
export const promoCodes: Promo[] = [
  { code: 'HELLO10', kind: 'percent', value: 10, description: '−10% на первый заказ' },
  { code: 'AZA2000', kind: 'fixed', value: 2000, minSubtotal: 20000, description: '−2 000 ₸ при заказе от 20 000 ₸' },
  { code: 'FREEDELIVERY', kind: 'free-delivery', description: 'Бесплатная доставка' },
];

export type PromoCheck = { ok: true; promo: Promo } | { ok: false; error: string };

export function checkPromo(rawCode: string, subtotal: number): PromoCheck {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: 'Введите промокод' };
  const promo = promoCodes.find((p) => p.code === code);
  if (!promo) return { ok: false, error: 'Такого промокода нет' };
  if (promo.minSubtotal && subtotal < promo.minSubtotal) {
    return { ok: false, error: `Промокод действует от ${new Intl.NumberFormat('ru-RU').format(promo.minSubtotal)} ₸` };
  }
  return { ok: true, promo };
}

export function findPromo(code: string | null): Promo | undefined {
  return code ? promoCodes.find((p) => p.code === code) : undefined;
}
