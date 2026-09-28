import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Overline } from '@/components/ui/section-heading';

export default function NotFound() {
  return (
    <section className="container-shop flex min-h-[60vh] flex-col items-start justify-center py-24">
      <Overline index="404">Страница не найдена</Overline>
      <h1 className="mt-6 max-w-2xl text-5xl text-ink lg:text-7xl">
        Кажется, этот цветок ещё не распустился<span className="text-accent">.</span>
      </h1>
      <p className="mt-6 max-w-md text-base text-muted">Проверьте адрес или вернитесь на главную.</p>
      <div className="mt-10 flex flex-wrap items-center gap-8">
        <Button asChild size="lg">
          <Link href="/">
            На главную <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <Link href="/catalog" className="link-underline pb-1 font-heading text-xs uppercase tracking-button">
          Каталог
        </Link>
      </div>
    </section>
  );
}
