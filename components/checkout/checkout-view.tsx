'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Lock, ShoppingBag } from 'lucide-react';
import { useStore } from '@/components/cart/store-provider';
import { FreeDeliveryProgress, OrderTotals } from '@/components/cart/order-totals';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { SafeImage } from '@/components/ui/safe-image';
import { computeTotals } from '@/lib/cart';
import { DELIVERY_PRICE, deliveryCost } from '@/lib/delivery';
import {
  LAST_ORDER_KEY,
  checkoutSchema,
  formatPhone,
  isSlotAvailable,
  maxDateInput,
  paymentMethods,
  timeSlots,
  todayInput,
  type CheckoutValues,
  type Order,
} from '@/lib/checkout';
import { siteConfig } from '@/lib/site';
import { formatPrice } from '@/lib/utils';
import { CheckField, Field, FormSection, RadioCard, a11y } from './fields';

const reveal = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
  transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
} as const;

export function CheckoutView() {
  const router = useRouter();
  const { cart, hydrated, promoCode, clearCart, setPromoCode } = useStore();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onTouched',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      recipientIsOther: false,
      recipientName: '',
      recipientPhone: '',
      anonymous: false,
      deliveryMethod: 'courier',
      street: '',
      house: '',
      apartment: '',
      date: todayInput(),
      time: 'asap',
      payment: 'kaspi',
      cardText: '',
      comment: '',
      consent: false,
    },
  });

  const deliveryMethod = watch('deliveryMethod');
  const recipientIsOther = watch('recipientIsOther');
  const date = watch('date');
  const time = watch('time');
  const cardText = watch('cardText') ?? '';

  // Если выбранный интервал стал недоступен (сменили дату на сегодня) — берём первый доступный
  useEffect(() => {
    if (!isSlotAvailable(time, date)) {
      const first = timeSlots.find((s) => isSlotAvailable(s.value, date));
      if (first) setValue('time', first.value, { shouldValidate: false });
    }
  }, [date, time, setValue]);

  const totals = useMemo(() => computeTotals(cart, promoCode, deliveryMethod), [cart, promoCode, deliveryMethod]);

  const onSubmit = async (values: CheckoutValues) => {
    // Имитация отправки — бэкенда в проекте нет
    await new Promise((resolve) => setTimeout(resolve, 900));
    const number = `AF-${String(Date.now()).slice(-6)}`;
    const order: Order = {
      number,
      createdAt: new Date().toISOString(),
      customer: { name: values.name, phone: values.phone, email: values.email },
      recipient: values.recipientIsOther
        ? { name: values.recipientName ?? '', phone: values.recipientPhone ?? '', anonymous: values.anonymous }
        : undefined,
      delivery: {
        method: values.deliveryMethod,
        address:
          values.deliveryMethod === 'courier'
            ? [values.street, values.house && `д. ${values.house}`, values.apartment && `кв. ${values.apartment}`]
                .filter(Boolean)
                .join(', ')
            : siteConfig.address,
        date: values.date,
        timeLabel: timeSlots.find((s) => s.value === values.time)?.label ?? '',
      },
      paymentLabel: paymentMethods.find((p) => p.value === values.payment)?.label ?? '',
      cardText: values.cardText || undefined,
      items: totals.lines.map((line) => ({
        name: line.product.name,
        slug: line.product.slug,
        image: line.product.images[0],
        quantity: line.item.quantity,
        sizeLabel: line.sizeLabel,
        total: line.total,
      })),
      totals: {
        subtotal: totals.subtotal,
        discount: totals.discount,
        delivery: totals.delivery,
        total: totals.total,
        promoCode: totals.promo?.code,
      },
    };
    try {
      window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    } catch {
      // без localStorage страница успеха покажет номер из URL
    }
    setSubmitted(true);
    clearCart();
    setPromoCode(null);
    router.push(`/checkout/success?order=${number}`);
  };

  if (!hydrated || submitted) return <div aria-busy="true" className="min-h-[60vh]" />;

  if (totals.lines.length === 0) {
    return (
      <div className="container-shop pb-24">
        <div className="flex flex-col items-center border border-line px-6 py-24 text-center">
          <span className="flex size-16 items-center justify-center rounded-full border border-line-strong text-muted">
            <ShoppingBag className="size-6" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h2 className="mt-6 text-3xl text-ink">Нечего оформлять</h2>
          <p className="mt-3 max-w-sm text-sm text-muted">Корзина пуста — добавьте букет, и возвращайтесь сюда.</p>
          <Button asChild size="lg" className="mt-10">
            <Link href="/catalog">
              В каталог <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const today = todayInput();

  return (
    <div className="container-shop grid gap-12 pb-16 lg:grid-cols-12 lg:gap-16 lg:pb-32">
      <form
        id="checkout-form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        aria-label="Оформление заказа"
        className="min-w-0 space-y-12 lg:col-span-7"
      >
        <FormSection index="01" title="Ваши контакты">
          <Field id="name" label="Имя" required error={errors.name?.message}>
            <Input {...a11y('name', errors.name?.message)} autoComplete="name" {...register('name')} />
          </Field>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="phone" label="Телефон" required error={errors.phone?.message}>
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <Input
                    {...a11y('phone', errors.phone?.message)}
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+7 (7__) ___-__-__"
                    value={field.value}
                    onChange={(e) => field.onChange(formatPhone(e.target.value))}
                    onBlur={field.onBlur}
                    ref={field.ref}
                  />
                )}
              />
            </Field>
            <Field id="email" label="Email" required error={errors.email?.message} hint="Пришлём чек и статус заказа">
              <Input {...a11y('email', errors.email?.message)} type="email" autoComplete="email" {...register('email')} />
            </Field>
          </div>
          <Controller
            control={control}
            name="recipientIsOther"
            render={({ field }) => (
              <CheckField id="recipientIsOther" checked={field.value} onChange={field.onChange}>
                Букет получит другой человек
              </CheckField>
            )}
          />
          <AnimatePresence initial={false}>
            {recipientIsOther && (
              <motion.div {...reveal} className="overflow-hidden">
                <div className="space-y-6 pb-1 pt-2">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field id="recipientName" label="Имя получателя" required error={errors.recipientName?.message}>
                      <Input {...a11y('recipientName', errors.recipientName?.message)} {...register('recipientName')} />
                    </Field>
                    <Field id="recipientPhone" label="Телефон получателя" required error={errors.recipientPhone?.message}>
                      <Controller
                        control={control}
                        name="recipientPhone"
                        render={({ field }) => (
                          <Input
                            {...a11y('recipientPhone', errors.recipientPhone?.message)}
                            type="tel"
                            inputMode="tel"
                            placeholder="+7 (7__) ___-__-__"
                            value={field.value ?? ''}
                            onChange={(e) => field.onChange(formatPhone(e.target.value))}
                            onBlur={field.onBlur}
                            ref={field.ref}
                          />
                        )}
                      />
                    </Field>
                  </div>
                  <Controller
                    control={control}
                    name="anonymous"
                    render={({ field }) => (
                      <CheckField id="anonymous" checked={field.value} onChange={field.onChange}>
                        Анонимно — не называть отправителя
                      </CheckField>
                    )}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </FormSection>

        <FormSection index="02" title="Доставка">
          <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Способ получения">
            <RadioCard
              value="courier"
              {...register('deliveryMethod')}
              title="Курьером"
              note="По Астане от 60 минут"
              aside={
                <span className="text-xs text-muted">
                  {deliveryCost(totals.subtotal - totals.discount) === 0 ? 'Бесплатно' : formatPrice(DELIVERY_PRICE)}
                </span>
              }
            />
            <RadioCard
              value="pickup"
              {...register('deliveryMethod')}
              title="Самовывоз"
              note={siteConfig.address}
              aside={<span className="text-xs text-muted">Бесплатно</span>}
            />
          </div>

          <AnimatePresence initial={false} mode="wait">
            {deliveryMethod === 'courier' && (
              <motion.div key="address" {...reveal} className="overflow-hidden">
                <div className="grid gap-6 pb-1 pt-2 sm:grid-cols-6">
                  <Field id="street" label="Улица" required error={errors.street?.message} className="sm:col-span-6">
                    <Input
                      {...a11y('street', errors.street?.message)}
                      autoComplete="address-line1"
                      placeholder="пр. Мангилик Ел"
                      {...register('street')}
                    />
                  </Field>
                  <Field id="house" label="Дом" required error={errors.house?.message} className="sm:col-span-3">
                    <Input {...a11y('house', errors.house?.message)} {...register('house')} />
                  </Field>
                  <Field id="apartment" label="Квартира / офис" error={errors.apartment?.message} className="sm:col-span-3">
                    <Input {...a11y('apartment', errors.apartment?.message)} autoComplete="address-line2" {...register('apartment')} />
                  </Field>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Field id="date" label="Дата" required error={errors.date?.message} className="sm:max-w-xs">
            <Input
              {...a11y('date', errors.date?.message)}
              type="date"
              min={today}
              max={maxDateInput()}
              {...register('date')}
            />
          </Field>

          <div>
            <p id="time-label" className="font-nav text-xs uppercase tracking-button text-muted">
              Время <span className="text-accent">*</span>
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-labelledby="time-label">
              {timeSlots.map((slot) => {
                const available = isSlotAvailable(slot.value, date);
                return (
                  <RadioCard
                    key={slot.value}
                    value={slot.value}
                    disabled={!available}
                    {...register('time')}
                    title={slot.label}
                    note={!available ? (slot.value === 'asap' ? 'Только на сегодня' : 'Уже недоступно') : undefined}
                    className="p-4"
                  />
                );
              })}
            </div>
            {errors.time && (
              <p role="alert" className="mt-2 text-xs text-error">
                {errors.time.message}
              </p>
            )}
          </div>
        </FormSection>

        <FormSection index="03" title="Оплата">
          <div className="grid gap-3" role="radiogroup" aria-label="Способ оплаты">
            {paymentMethods.map((method) => (
              <RadioCard key={method.value} value={method.value} {...register('payment')} title={method.label} note={method.note} />
            ))}
          </div>
        </FormSection>

        <FormSection index="04" title="Пожелания">
          <Field
            id="cardText"
            label="Текст открытки"
            error={errors.cardText?.message}
            hint={`Напишем от руки на дизайнерской открытке — бесплатно · ${cardText.length}/200`}
          >
            <Textarea {...a11y('cardText', errors.cardText?.message)} rows={3} maxLength={200} {...register('cardText')} />
          </Field>
          <Field id="comment" label="Комментарий к заказу" error={errors.comment?.message}>
            <Textarea
              {...a11y('comment', errors.comment?.message)}
              rows={3}
              placeholder="Код домофона, ориентир, пожелания флористу"
              {...register('comment')}
            />
          </Field>
          <Controller
            control={control}
            name="consent"
            render={({ field }) => (
              <CheckField id="consent" checked={field.value} onChange={field.onChange} error={errors.consent?.message}>
                Согласен(на) на обработку персональных данных для выполнения заказа
              </CheckField>
            )}
          />
        </FormSection>
      </form>

      <aside aria-labelledby="checkout-summary-title" className="min-w-0 lg:col-span-5">
        <div className="border border-line p-6 md:p-8 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
          <div className="flex items-baseline justify-between">
            <h2 id="checkout-summary-title" className="font-nav text-xs uppercase tracking-button text-ink">
              Ваш заказ
            </h2>
            <Link href="/cart" className="link-underline text-xs text-muted hover:text-ink">
              Изменить
            </Link>
          </div>

          <ul className="mt-6 max-h-72 space-y-4 overflow-y-auto pr-2">
            {totals.lines.map((line) => (
              <li key={line.key} className="flex items-center gap-4">
                <span className="relative block size-16 shrink-0 overflow-hidden bg-surface">
                  <SafeImage src={line.product.images[0]} alt="" fill sizes="64px" className="object-cover" />
                  <span className="absolute right-0 top-0 flex size-5 items-center justify-center bg-ink text-xs text-paper">
                    {line.item.quantity}
                  </span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm text-ink">{line.product.name}</span>
                  {line.sizeLabel && <span className="block text-xs text-muted">{line.sizeLabel}</span>}
                </span>
                <span className="shrink-0 text-sm text-ink">{formatPrice(line.total)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-line pt-6">
            {deliveryMethod === 'courier' && (
              <div className="mb-6">
                <FreeDeliveryProgress amount={totals.subtotal - totals.discount} />
              </div>
            )}
            <OrderTotals totals={totals} deliveryLabel={deliveryMethod === 'pickup' ? 'Самовывоз' : 'Доставка курьером'} />
            {totals.promo && <p className="mt-3 text-xs text-muted">Промокод {totals.promo.code} применён</p>}
          </div>

          <Button type="submit" form="checkout-form" size="lg" className="mt-8 w-full whitespace-normal px-4" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border border-paper border-t-transparent" aria-hidden="true" />
                Отправляем…
              </>
            ) : (
              <>
                Подтвердить заказ <ArrowRight aria-hidden="true" />
              </>
            )}
          </Button>
          <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-muted">
            <Lock className="size-3 shrink-0" aria-hidden="true" /> Менеджер перезвонит для подтверждения
          </p>
          {Object.keys(errors).length > 0 && (
            <p role="alert" className="mt-4 text-center text-xs text-error">
              Проверьте отмеченные поля формы
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
