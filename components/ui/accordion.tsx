'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Accordion = AccordionPrimitive.Root;

export const AccordionItem = forwardRef<
  ElementRef<typeof AccordionPrimitive.Item>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('border-b border-line', className)} {...props} />
));
AccordionItem.displayName = 'AccordionItem';

// Плюс поворачивается в крестик; вопрос подсвечивается акцентом при hover
export const AccordionTrigger = forwardRef<
  ElementRef<typeof AccordionPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'group flex flex-1 items-center justify-between gap-6 py-6 text-left font-heading text-lg font-light text-ink transition-colors duration-300 hover:text-accent md:text-xl',
        className,
      )}
      {...props}
    >
      {children}
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-line transition-colors duration-300 group-hover:border-ink group-data-[state=open]:border-ink group-data-[state=open]:bg-ink group-data-[state=open]:text-paper">
        <Plus
          className="size-4 transition-transform duration-300 group-data-[state=open]:rotate-45"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = forwardRef<
  ElementRef<typeof AccordionPrimitive.Content>,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('max-w-2xl pb-6 pr-16 text-sm text-muted', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = 'AccordionContent';
