import { forwardRef, type InputHTMLAttributes, type LabelHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Минималистичное поле: только нижняя волосяная линия, на фокусе — акцент
const fieldBase =
  'w-full rounded-none border-0 border-b border-line-strong bg-transparent px-0 font-body text-base text-ink transition-colors duration-300 placeholder:text-muted-light focus:border-accent focus:outline-none focus-visible:outline-none disabled:text-muted aria-[invalid=true]:border-error';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, type = 'text', ...props }, ref) => (
  <input ref={ref} type={type} className={cn(fieldBase, 'h-12', className)} {...props} />
));
Input.displayName = 'Input';

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, rows = 4, ...props }, ref) => (
  <textarea ref={ref} rows={rows} className={cn(fieldBase, 'resize-y py-3', className)} {...props} />
));
Textarea.displayName = 'Textarea';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean };

export function Label({ className, children, required, ...props }: LabelProps) {
  return (
    <label
      className={cn('block font-nav text-xs uppercase tracking-button text-muted', className)}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="text-accent">
          {' '}
          *
        </span>
      )}
    </label>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-2 text-xs text-error">
      {message}
    </p>
  );
}
