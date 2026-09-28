'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldError, Label } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
};

/** Подпись + поле + ошибка. aria-describedby поле получает от вызывающего кода через errorId(id) */
export function Field({ id, label, required, error, hint, className, children }: FieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <div className="mt-1">{children}</div>
      {hint && !error && <p className="mt-2 text-xs text-muted-light">{hint}</p>}
      <FieldError id={errorId(id)} message={error} />
    </div>
  );
}

export const errorId = (id: string) => `${id}-error`;

/** Пропсы доступности для поля с ошибкой */
export const a11y = (id: string, error?: string) => ({
  id,
  'aria-invalid': error ? ('true' as const) : ('false' as const),
  'aria-describedby': error ? errorId(id) : undefined,
});

type RadioCardProps = InputHTMLAttributes<HTMLInputElement> & {
  title: ReactNode;
  note?: ReactNode;
  aside?: ReactNode;
};

/** Радио-кнопка в виде карточки: волосяная рамка, выбранная — чёрная рамка и точка акцента */
export const RadioCard = forwardRef<HTMLInputElement, RadioCardProps>(
  ({ title, note, aside, className, disabled, ...props }, ref) => (
    <label
      className={cn(
        'group relative flex cursor-pointer items-start gap-4 border border-line p-5 transition-colors duration-300 hover:border-line-strong has-[:checked]:border-ink has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent',
        disabled && 'cursor-not-allowed bg-surface-soft text-muted-light hover:border-line',
        className,
      )}
    >
      <input ref={ref} type="radio" className="peer sr-only" disabled={disabled} {...props} />
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-line-strong transition-colors peer-checked:border-ink [&>span]:scale-0 peer-checked:[&>span]:scale-100"
      >
        <span className="size-2 rounded-full bg-accent transition-transform duration-300" />
      </span>
      <span className="flex-1">
        <span className={cn('block text-sm', disabled ? 'text-muted-light' : 'text-ink')}>{title}</span>
        {note && <span className="mt-1 block text-xs text-muted">{note}</span>}
      </span>
      {aside}
    </label>
  ),
);
RadioCard.displayName = 'RadioCard';

type CheckFieldProps = {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  children: ReactNode;
  error?: string;
};

export function CheckField({ id, checked, onChange, children, error }: CheckFieldProps) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(v) => onChange(v === true)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId(id) : undefined}
          className={cn('mt-0.5', error && 'border-error')}
        />
        <label htmlFor={id} className="cursor-pointer text-sm text-ink">
          {children}
        </label>
      </div>
      <FieldError id={errorId(id)} message={error} />
    </div>
  );
}

export function FormSection({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  return (
    <fieldset className="min-w-0 border-t border-line pt-8">
      <legend className="float-left mb-8 flex w-full items-baseline gap-4">
        <span className="font-nav text-xs text-muted-light">{index}</span>
        <span className="font-heading text-2xl font-light text-ink">{title}</span>
      </legend>
      <div className="clear-left space-y-6">{children}</div>
    </fieldset>
  );
}
