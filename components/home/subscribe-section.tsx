'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FieldError, Input, Label } from '@/components/ui/input';
import { Reveal } from '@/components/ui/reveal';
import { Overline } from '@/components/ui/section-heading';
import { subscribeSchema, type SubscribeValues } from '@/lib/validation';
import { cn } from '@/lib/utils';

export function SubscribeSection() {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscribeValues>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { email: '', consent: false },
  });

  const onSubmit = async () => {
    // Имитация запроса — бэкенда в проекте нет
    await new Promise((resolve) => setTimeout(resolve, 600));
    setDone(true);
    reset();
  };

  return (
    <section aria-labelledby="subscribe-title" className="section border-t border-line">
      <div className="container-shop">
        <Reveal className="relative overflow-hidden bg-surface px-6 py-16 md:px-16 lg:py-24">
          {/* Декор: концентрические контурные круги и точка акцента */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 hidden md:block">
            <div className="flex size-[480px] items-center justify-center rounded-full border border-line-strong">
              <div className="flex size-80 items-center justify-center rounded-full border border-line-strong">
                <div className="size-40 rounded-full border border-line-strong" />
              </div>
            </div>
          </div>
          <span aria-hidden="true" className="absolute bottom-10 left-1/2 hidden size-2 rounded-full bg-accent lg:block" />

          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-end">
            <div>
              <Overline index="06">Рассылка</Overline>
              <h2 id="subscribe-title" className="mt-5 text-4xl text-ink lg:text-6xl">
                −10% на первый заказ
              </h2>
              <p className="mt-5 max-w-md text-base text-muted">
                Подпишитесь, чтобы получить промокод и узнавать о сезонных цветах раньше всех. Не чаще раза в неделю.
              </p>
            </div>

            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  role="status"
                  className="flex items-start gap-4"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-ink">
                    <Check className="size-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-heading text-xl text-ink">Готово! Промокод уже в пути.</p>
                    <p className="mt-1 text-sm text-muted">
                      Используйте код <span className="font-medium text-accent">HELLO10</span> при оформлении заказа.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, y: -16 }}
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  aria-label="Подписка на рассылку"
                >
                  <Label htmlFor="subscribe-email" required>
                    Email
                  </Label>
                  <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                      <Input
                        id="subscribe-email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'subscribe-email-error' : undefined}
                        {...register('email')}
                      />
                    </div>
                    <Button type="submit" variant="dark" disabled={isSubmitting} className="sm:w-auto">
                      {isSubmitting ? 'Отправляем…' : 'Подписаться'}
                      <ArrowRight aria-hidden="true" />
                    </Button>
                  </div>
                  <FieldError id="subscribe-email-error" message={errors.email?.message} />

                  <label className="mt-6 flex cursor-pointer items-start gap-3 text-xs text-muted">
                    <input
                      type="checkbox"
                      className={cn(
                        'mt-0.5 size-4 shrink-0 cursor-pointer rounded-none border-line-strong accent-accent',
                        errors.consent && 'outline outline-1 outline-error',
                      )}
                      aria-invalid={errors.consent ? 'true' : 'false'}
                      aria-describedby={errors.consent ? 'subscribe-consent-error' : undefined}
                      {...register('consent')}
                    />
                    Согласен(на) получать письма и принимаю политику конфиденциальности
                  </label>
                  <FieldError id="subscribe-consent-error" message={errors.consent?.message} />
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
