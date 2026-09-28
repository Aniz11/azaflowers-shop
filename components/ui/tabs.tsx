'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export const Tabs = TabsPrimitive.Root;

export const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('no-scrollbar flex gap-8 overflow-x-auto border-b border-line md:gap-12', className)}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

// Активная вкладка — чёрная линия снизу и точка акцента
export const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'relative -mb-px flex shrink-0 items-center gap-2 whitespace-nowrap border-b border-transparent pb-4 font-nav text-xs uppercase tracking-button text-muted transition-colors duration-300 hover:text-ink data-[state=active]:border-ink data-[state=active]:text-ink',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('pt-10 focus-visible:outline-none data-[state=active]:animate-fade-in', className)}
    {...props}
  />
));
TabsContent.displayName = 'TabsContent';
