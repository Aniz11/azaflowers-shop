import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Overline } from '@/components/ui/section-heading';

export default function ProductNotFound() {
  return (
    <section className="container-shop flex min-h-[60vh] flex-col items-start justify-center py-24">
      <Overline index="404">Товар не найден</Overline>
      <h1 className="mt-6 max-w-2xl text-5xl text-ink lg:text-7xl">
        Этот букет уже разобрали<span className="text-accent">.</span>
      </h1>
      <p className="mt-6 max-w-md text-base text-muted">Возможно, он снят с продажи. Посмотрите похожие в каталоге.</p>
      <Button asChild size="lg" className="mt-10">
        <Link href="/catalog">
          В каталог <ArrowRight aria-hidden="true" />
        </Link>
      </Button>
    </section>
  );
}
