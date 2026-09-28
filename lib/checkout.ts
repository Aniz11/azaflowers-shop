import { z } from 'zod';

export const PHONE_RE = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

/**
 * Маска телефона: «87011234567» / «+77011234567» / «7011234567» → «+7 (701) 123-45-67».
 * Работает по мере ввода: код страны отбрасываем только если он явно есть
 * (строка уже начинается с «+», ведущая «8» или введено 11 цифр) — иначе «7» мобильного кода терялась бы.
 */
export function formatPhone(input: string): string {
  const raw = input.trim();
  let digits = raw.replace(/\D/g, '');
  const plus = raw.startsWith('+');
  if (plus) digits = digits.slice(1);
  else if (digits.startsWith('8') || (digits.length > 10 && digits.startsWith('7'))) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  // Пользователь набирает «+7» вручную — не мешаем
  if (!digits) return plus ? (raw.replace(/\D/g, '') ? '+7' : '+') : '';
  let out = '+7 (' + digits.slice(0, 3);
  // Скобку закрываем только когда пошли следующие цифры — иначе Backspace «застревает»
  if (digits.length > 3) out += ')';
  if (digits.length > 3) out += ' ' + digits.slice(3, 6);
  if (digits.length > 6) out += '-' + digits.slice(6, 8);
  if (digits.length > 8) out += '-' + digits.slice(8, 10);
  return out;
}

export const timeSlots = [
  { value: 'asap', label: 'Как можно скорее · от 60 минут', endHour: 22 },
  { value: '09-12', label: '09:00 — 12:00', endHour: 12 },
  { value: '12-15', label: '12:00 — 15:00', endHour: 15 },
  { value: '15-18', label: '15:00 — 18:00', endHour: 18 },
  { value: '18-21', label: '18:00 — 21:00', endHour: 21 },
  { value: '21-23', label: '21:00 — 23:00', endHour: 23 },
] as const;

export type TimeSlot = (typeof timeSlots)[number]['value'];

export const paymentMethods = [
  { value: 'kaspi', label: 'Kaspi', note: 'Счёт в приложении Kaspi.kz' },
  { value: 'card', label: 'Картой онлайн', note: 'Visa, Mastercard — ссылка после подтверждения' },
  { value: 'cash', label: 'При получении', note: 'Наличными или картой курьеру' },
] as const;

export type PaymentMethod = (typeof paymentMethods)[number]['value'];

export const toDateInput = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const todayInput = () => toDateInput(new Date());

export const maxDateInput = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return toDateInput(d);
};

/** Слот недоступен сегодня, если до его конца меньше часа (время на сборку и дорогу) */
export function isSlotAvailable(slot: TimeSlot, date: string, now = new Date()): boolean {
  if (date !== toDateInput(now)) return slot !== 'asap';
  const endHour = timeSlots.find((s) => s.value === slot)?.endHour ?? 0;
  return now.getHours() + 1 < endHour;
}

const optionalText = (max: number) => z.string().trim().max(max, `Не больше ${max} символов`).optional().or(z.literal(''));

export const checkoutSchema = z
  .object({
    name: z.string().trim().min(2, 'Как к вам обращаться?').max(60, 'Слишком длинное имя'),
    phone: z.string().regex(PHONE_RE, 'Телефон в формате +7 (7XX) XXX-XX-XX'),
    email: z.string().trim().min(1, 'Введите email').email('Проверьте формат email'),

    recipientIsOther: z.boolean(),
    recipientName: optionalText(60),
    recipientPhone: z.string().optional().or(z.literal('')),
    anonymous: z.boolean(),

    deliveryMethod: z.enum(['courier', 'pickup']),
    street: optionalText(120),
    house: optionalText(20),
    apartment: optionalText(20),
    date: z.string().min(1, 'Выберите дату'),
    time: z.enum(timeSlots.map((s) => s.value) as [TimeSlot, ...TimeSlot[]], {
      errorMap: () => ({ message: 'Выберите время' }),
    }),

    payment: z.enum(paymentMethods.map((p) => p.value) as [PaymentMethod, ...PaymentMethod[]], {
      errorMap: () => ({ message: 'Выберите способ оплаты' }),
    }),
    cardText: optionalText(200),
    comment: optionalText(500),
    consent: z.boolean().refine((v) => v, 'Нужно согласие на обработку данных'),
  })
  .superRefine((data, ctx) => {
    if (data.recipientIsOther) {
      if (!data.recipientName || data.recipientName.length < 2)
        ctx.addIssue({ code: 'custom', path: ['recipientName'], message: 'Укажите имя получателя' });
      if (!data.recipientPhone || !PHONE_RE.test(data.recipientPhone))
        ctx.addIssue({ code: 'custom', path: ['recipientPhone'], message: 'Телефон получателя в формате +7 (7XX) XXX-XX-XX' });
    }
    if (data.deliveryMethod === 'courier') {
      if (!data.street) ctx.addIssue({ code: 'custom', path: ['street'], message: 'Укажите улицу' });
      if (!data.house) ctx.addIssue({ code: 'custom', path: ['house'], message: 'Укажите дом' });
    }
    if (data.date) {
      if (data.date < todayInput()) ctx.addIssue({ code: 'custom', path: ['date'], message: 'Дата уже прошла' });
      else if (data.date > maxDateInput())
        ctx.addIssue({ code: 'custom', path: ['date'], message: 'Принимаем заказы на 30 дней вперёд' });
      else if (!isSlotAvailable(data.time, data.date))
        ctx.addIssue({ code: 'custom', path: ['time'], message: 'Этот интервал уже недоступен — выберите другой' });
    }
  });

export type CheckoutValues = z.infer<typeof checkoutSchema>;

export type Order = {
  number: string;
  createdAt: string;
  customer: { name: string; phone: string; email: string };
  recipient?: { name: string; phone: string; anonymous: boolean };
  delivery: { method: 'courier' | 'pickup'; address?: string; date: string; timeLabel: string };
  paymentLabel: string;
  cardText?: string;
  items: { name: string; slug: string; image: string; quantity: number; sizeLabel?: string; total: number }[];
  totals: { subtotal: number; discount: number; delivery: number; total: number; promoCode?: string };
};

export const LAST_ORDER_KEY = 'azaflowers:last-order';
