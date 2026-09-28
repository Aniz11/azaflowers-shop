'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;
export const SheetTitle = DialogPrimitive.Title;
export const SheetDescription = DialogPrimitive.Description;

/** Выезжающая слева панель (Radix Dialog): фокус-ловушка, Esc, блокировка скролла */
export const SheetContent = forwardRef<
  ElementRef<typeof DialogPrimitive.Content>,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { title: string }
>(({ className, children, title, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-drawer bg-ink/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-y-0 left-0 z-drawer flex w-96 max-w-[90vw] flex-col bg-paper duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left',
        className,
      )}
      {...props}
    >
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-6">
        <DialogPrimitive.Title className="font-nav text-xs uppercase tracking-button text-ink">{title}</DialogPrimitive.Title>
        <DialogPrimitive.Close
          className="-mr-2 flex size-10 items-center justify-center transition-colors hover:text-accent"
          aria-label="Закрыть"
        >
          <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </DialogPrimitive.Close>
      </div>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
SheetContent.displayName = 'SheetContent';
