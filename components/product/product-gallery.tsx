'use client';

import Image from 'next/image';
import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import { SafeImage } from '@/components/ui/safe-image';
import { cn } from '@/lib/utils';

type Props = { images: string[]; name: string; badges?: ReactNode };

const EASE: [number, number, number, number] = [0.19, 1, 0.22, 1];
const arrow =
  'flex size-12 items-center justify-center rounded-full border border-line bg-paper text-ink transition-colors duration-300 hover:border-ink';

export function ProductGallery({ images, name, badges }: Props) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [open, setOpen] = useState(false);
  // Свайп не должен открывать полноэкранный просмотр
  const dragged = useRef(false);
  const count = images.length;

  const go = (next: number) => {
    setDirection(next > index ? 1 : -1);
    setIndex((next + count) % count);
  };

  // Лупа: увеличиваем в 2 раза, точка трансформации следует за курсором
  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const alt = (i: number) => `${name} — фото ${i + 1} из ${count}`;

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {/* Миниатюры: снизу на мобильных, слева на десктопе */}
      <ul className="no-scrollbar flex gap-3 overflow-x-auto lg:w-20 lg:flex-col" aria-label="Миниатюры">
        {images.map((src, i) => (
          <li key={src} className="shrink-0">
            <button
              type="button"
              onClick={() => go(i)}
              aria-label={`Показать фото ${i + 1}`}
              aria-current={i === index}
              className={cn(
                'relative block size-20 overflow-hidden border transition-all duration-300',
                i === index ? 'border-ink' : 'border-transparent opacity-60 hover:opacity-100',
              )}
            >
              <SafeImage src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>

      <div className="relative flex-1">
        <div
          className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden bg-surface"
          onMouseMove={onMove}
          onMouseLeave={() => setZoom(null)}
          onClick={() => {
            if (dragged.current) {
              dragged.current = false;
              return;
            }
            setOpen(true);
          }}
          role="button"
          tabIndex={0}
          aria-label={`Открыть фото «${name}» на весь экран`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(true);
            }
            if (e.key === 'ArrowRight') go(index + 1);
            if (e.key === 'ArrowLeft') go(index - 1);
          }}
        >
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={images[index]}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ duration: 0.6, ease: EASE }}
              // Свайп на тач-устройствах
              drag={count > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragStart={() => {
                dragged.current = true;
              }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(index + 1);
                if (info.offset.x > 60) go(index - 1);
              }}
              className="absolute inset-0"
            >
              <SafeImage
                src={images[index]}
                alt={alt(index)}
                fill
                priority={index === 0}
                sizes="(min-width: 992px) 640px, 100vw"
                draggable={false}
                className="object-cover transition-transform duration-300 ease-out lg:group-hover:scale-[2]"
                style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              />
            </motion.div>
          </AnimatePresence>

          <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-1">{badges}</div>
          <span className="pointer-events-none absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-paper text-ink transition-opacity duration-300 lg:group-hover:opacity-0">
            <Expand className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <span className="pointer-events-none absolute bottom-4 left-4 font-nav text-xs tracking-button text-paper mix-blend-difference">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
        </div>

        {count > 1 && (
          <div className="absolute -bottom-6 right-6 hidden gap-2 lg:flex">
            <button type="button" onClick={() => go(index - 1)} aria-label="Предыдущее фото" className={arrow}>
              <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Следующее фото" className={arrow}>
              <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Полноэкранный просмотр */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-drawer bg-paper data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content
            aria-describedby={undefined}
            className="fixed inset-0 z-drawer flex flex-col focus-visible:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') go(index + 1);
              if (e.key === 'ArrowLeft') go(index - 1);
            }}
          >
            <div className="flex h-16 items-center justify-between px-4 md:px-8">
              <Dialog.Title className="font-heading text-base text-ink">{name}</Dialog.Title>
              <div className="flex items-center gap-6">
                <span className="font-nav text-xs tracking-button text-muted">
                  {index + 1} / {count}
                </span>
                <Dialog.Close aria-label="Закрыть" className="flex size-10 items-center justify-center hover:text-accent">
                  <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
                </Dialog.Close>
              </div>
            </div>
            <div className="relative flex-1">
              <Image src={images[index]} alt={alt(index)} fill sizes="100vw" className="object-contain" />
            </div>
            {count > 1 && (
              <div className="flex justify-center gap-3 py-6">
                <button type="button" onClick={() => go(index - 1)} aria-label="Предыдущее фото" className={arrow}>
                  <ArrowLeft className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => go(index + 1)} aria-label="Следующее фото" className={arrow}>
                  <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
