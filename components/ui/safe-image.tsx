'use client';

import Image, { type ImageProps } from 'next/image';
import { useState } from 'react';
import { Flower2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * next/image с деликатным плейсхолдером: пока фото грузится — скелетон (keyframe load-product),
 * если не загрузилось — светлая плашка с контурным кругом и цветком вместо «битой» картинки.
 */
export function SafeImage({ className, alt, onLoad, ...props }: ImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  if (status === 'error') {
    return (
      <div role="img" aria-label={alt} className="absolute inset-0 flex items-center justify-center bg-surface">
        <span className="flex size-20 items-center justify-center rounded-full border border-line-strong text-muted">
          <Flower2 className="size-8" aria-hidden="true" />
        </span>
      </div>
    );
  }

  return (
    <>
      {status === 'loading' && (
        <span aria-hidden="true" className="absolute inset-0 overflow-hidden bg-surface">
          <span className="absolute inset-y-0 w-36 animate-load-product bg-gradient-to-r from-transparent via-paper to-transparent" />
        </span>
      )}
      <Image
        alt={alt}
        className={cn('transition-opacity duration-700', status === 'loaded' ? 'opacity-100' : 'opacity-0', className)}
        onLoad={(e) => {
          setStatus('loaded');
          onLoad?.(e);
        }}
        onError={() => setStatus('error')}
        {...props}
      />
    </>
  );
}
