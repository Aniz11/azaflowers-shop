'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '@/lib/utils';

type SliderProps = ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  /** aria-label для каждого бегунка */
  thumbLabels?: string[];
};

// Волосяной трек, чёрный диапазон, круглые контурные бегунки
export const Slider = forwardRef<ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, thumbLabels = [], ...props }, ref) => {
    const count = (props.value ?? props.defaultValue ?? [0]).length;
    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn('relative flex h-6 w-full touch-none select-none items-center', className)}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-px w-full grow bg-line-strong">
          <SliderPrimitive.Range className="absolute h-px bg-ink" />
        </SliderPrimitive.Track>
        {Array.from({ length: count }, (_, i) => (
          <SliderPrimitive.Thumb
            key={i}
            aria-label={thumbLabels[i]}
            className="block size-4 rounded-full border border-ink bg-paper transition-transform duration-200 hover:scale-125 focus-visible:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          />
        ))}
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = 'Slider';
