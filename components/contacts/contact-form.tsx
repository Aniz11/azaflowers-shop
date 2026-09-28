'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { CheckField, Field, a11y } from '@/components/checkout/fields';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { contactSchema, contactTopics, type ContactValues } from '@/lib/validation';

export function ContactForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: { name: '', email: '', topic: 'order', message: '', consent: false },
  });
  const message = watch('message');

  const onSubmit = async (values: ContactValues) => {
    // Имитация отправки — бэкенда в проекте нет
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSentTo(values.email);
    reset();
  };

  return (
    <AnimatePresence mode="wait">
      {sentTo ? (
        <motion.div
          key="sent"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          role="status"
          className="flex flex-col items-start border border-line p-8 md:p-12"
        >
          <span className="flex size-14 items-center justify-center rounded-full border border-ink">
            <Check className="size-5 text-accent" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h3 className="mt-8 font-heading text-3xl font-light text-ink">Сообщение отправлено</h3>
          <p className="mt-3 max-w-md text-sm text-muted">
            Спасибо! Ответим на {sentTo} в течение рабочего дня — обычно гораздо быстрее.
          </p>
          <Button variant="outline" className="mt-8" onClick={() => setSentTo(null)}>
            Написать ещё
          </Button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0, y: -16 }}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-label="Форма обратной связи"
          className="space-y-8"
        >
          <fieldset className="min-w-0">
            <legend className="font-nav text-xs uppercase tracking-button text-muted">Тема обращения</legend>
            <div className="mt-4 flex flex-wrap gap-2">
              {contactTopics.map((topic) => (
                <label key={topic.value} className="cursor-pointer">
                  <input type="radio" value={topic.value} className="peer sr-only" {...register('topic')} />
                  <span
                    className={cn(
                      'block rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors duration-300',
                      'hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent',
                    )}
                  >
                    {topic.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-8 sm:grid-cols-2">
            <Field id="contact-name" label="Ваше имя" required error={errors.name?.message}>
              <Input {...a11y('contact-name', errors.name?.message)} autoComplete="name" {...register('name')} />
            </Field>
            <Field id="contact-email" label="Email" required error={errors.email?.message}>
              <Input
                {...a11y('contact-email', errors.email?.message)}
                type="email"
                autoComplete="email"
                {...register('email')}
              />
            </Field>
          </div>

          <Field
            id="contact-message"
            label="Сообщение"
            required
            error={errors.message?.message}
            hint={`${message.length}/1000`}
          >
            <Textarea
              {...a11y('contact-message', errors.message?.message)}
              rows={5}
              maxLength={1000}
              placeholder="Расскажите, чем мы можем помочь"
              {...register('message')}
            />
          </Field>

          <Controller
            control={control}
            name="consent"
            render={({ field }) => (
              <CheckField id="contact-consent" checked={field.value} onChange={field.onChange} error={errors.consent?.message}>
                Согласен(на) на обработку персональных данных
              </CheckField>
            )}
          />

          <Button type="submit" variant="dark" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Отправляем…' : 'Отправить'}
            <ArrowRight aria-hidden="true" />
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
