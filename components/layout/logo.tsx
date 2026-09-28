import Link from 'next/link';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/lib/site';

type LogoProps = { size?: 'md' | 'lg'; className?: string };

// Словесный знак Marcellus + точка акцента. Контурный круг — отсылка к круглому логотипу образца.
export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.name} — на главную`}
      className={cn('group inline-flex items-center gap-3 text-ink', className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          'hidden items-center justify-center rounded-full border sm:flex border-ink font-nav transition-colors duration-300 group-hover:border-accent group-hover:text-accent',
          size === 'lg' ? 'size-12 text-base' : 'size-10 text-sm',
        )}
      >
        AF
      </span>
      <span className={cn('font-nav leading-none', size === 'lg' ? 'text-3xl' : 'text-xl')}>
        Aza<span className="text-muted">Flowers</span>
        <span className="text-accent">.</span>
      </span>
    </Link>
  );
}
