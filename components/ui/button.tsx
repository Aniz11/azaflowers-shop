import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// Прямые углы, uppercase и разрядка — из образца. Последняя иконка (стрелка) сдвигается на hover.
const buttonVariants = cva(
  'group/button inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-none font-heading font-normal uppercase tracking-button transition-colors duration-300 disabled:pointer-events-none disabled:border-line disabled:bg-surface disabled:text-muted [&_svg]:size-4 [&_svg]:shrink-0 [&_svg:last-child]:transition-transform [&_svg:last-child]:duration-300 hover:[&_svg:last-child]:translate-x-1',
  {
    variants: {
      variant: {
        // Главное действие — одно на экран, единственная крупная площадь акцента
        primary: 'bg-accent text-paper hover:bg-accent-hover',
        dark: 'bg-ink text-paper hover:bg-accent',
        outline: 'border border-ink bg-transparent text-ink hover:bg-ink hover:text-paper',
        // Тонкая рамка для второстепенных действий
        subtle: 'border border-line bg-paper text-ink hover:border-ink',
        light: 'bg-paper text-ink hover:bg-ink hover:text-paper',
        ghost: 'bg-transparent text-ink hover:text-accent',
      },
      size: {
        sm: 'h-10 px-4 text-xs',
        md: 'h-12 px-8 text-xs',
        lg: 'h-14 px-10 text-xs',
        icon: 'size-12 p-0 tracking-normal',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...(asChild ? {} : { type: type ?? 'button' })}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };
