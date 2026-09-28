'use client';

import { useState, type FormEvent } from 'react';
import { Check, X } from 'lucide-react';
import { useStore } from '@/components/cart/store-provider';
import { FieldError, Input } from '@/components/ui/input';
import type { Promo } from '@/lib/promo';
import { checkPromo } from '@/lib/promo';

type Props = { subtotal: number; promo?: Promo; promoError?: string };

export function PromoCode({ subtotal, promo, promoError }: Props) {
  const { setPromoCode } = useStore();
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | undefined>();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const result = checkPromo(value, subtotal);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(undefined);
    setValue('');
    setPromoCode(result.promo.code);
  };

  if (promo) {
    return (
      <div className="flex items-center justify-between gap-4 border border-line px-4 py-3" role="status">
        <p className="flex items-center gap-3 text-sm">
          <Check className="size-4 text-success" aria-hidden="true" />
          <span>
            <span className="font-medium text-ink">{promo.code}</span>
            <span className="text-muted"> · {promo.description}</span>
          </span>
        </p>
        <button
          type="button"
          onClick={() => setPromoCode(null)}
          aria-label={`Убрать промокод ${promo.code}`}
          className="flex size-8 items-center justify-center text-muted transition-colors hover:text-accent"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate aria-label="Промокод">
      <label htmlFor="promo" className="font-nav text-xs uppercase tracking-button text-muted">
        Промокод
      </label>
      <div className="mt-1 flex items-end gap-4">
        <Input
          id="promo"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(undefined);
          }}
          placeholder="Например, HELLO10"
          autoComplete="off"
          className="uppercase placeholder:normal-case"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error || promoError ? 'promo-error' : undefined}
        />
        <button
          type="submit"
          className="h-12 shrink-0 border-b border-ink font-heading text-xs uppercase tracking-button text-ink transition-colors hover:border-accent hover:text-accent"
        >
          Применить
        </button>
      </div>
      <FieldError id="promo-error" message={error ?? promoError} />
    </form>
  );
}
