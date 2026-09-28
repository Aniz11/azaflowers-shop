'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Checkbox = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'peer flex size-4 shrink-0 items-center justify-center rounded-none border border-line-strong bg-paper transition-colors duration-200 hover:border-ink data-[state=checked]:border-ink data-[state=checked]:bg-ink data-[state=checked]:text-paper disabled:cursor-not-allowed disabled:border-line disabled:bg-surface',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="animate-fade-in">
      <Check className="size-3" strokeWidth={2} aria-hidden="true" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';
