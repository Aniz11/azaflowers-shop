import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PostCard, postDate } from '@/components/blog/post-card';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Reveal, STAGGER } from '@/components/ui/reveal';
import { SafeImage } from '@/components/ui/safe-image';
import { SectionHeading } from '@/components/ui/section-heading';
import { getPost, postCategories, posts } from '@/data/posts';
import { siteConfig } from '@/lib/site';
import type { PostBlock } from '@/types';

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const post = getPost(params.slug);
  if (!post) return { title: 'Статья не найдена' };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.cover, width: 1200, height: 900, alt: post.coverAlt }],
    },
  };
}

function Block({ block }: { block: PostBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="mt-14 font-heading text-3xl font-light text-ink">{block.text}</h2>;
    case 'quote':
      return (
        <figure className="my-12 border-l border-accent pl-8">
          <blockquote className="font-heading text-2xl font-light leading-snug text-ink lg:text-3xl">«{block.text}»</blockquote>
          {block.author && (
            <figcaption className="mt-4 font-nav text-xs uppercase tracking-button text-muted">{block.author}</figcaption>
          )}
        </figure>
      );
    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag className="mt-6 space-y-3">
          {block.items.map((item, i) => (
            <li key={item} className="flex gap-4 text-base leading-relaxed text-ink">
              {block.ordered ? (
                <span className="font-nav text-xs leading-7 text-muted-light">{String(i + 1).padStart(2, '0')}</span>
              ) : (
                <span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-accent" />
              )}
              <span>{item}</span>
            </li>
          ))}
        </Tag>
      );
    }
    default:
      return <p className="mt-6 text-base leading-relaxed text-ink lg:text-lg lg:leading-relaxed">{block.text}</p>;
  }
}

export default function PostPage({ params }: Params) {
  const post = getPost(params.slug);
  if (!post) notFound();

  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const index = sorted.findIndex((p) => p.slug === post.slug);
  const prev = sorted[index + 1];
  const next = sorted[index - 1];
  const related = posts.filter((p) => p.slug !== post.slug && p.category === post.category).concat(
    posts.filter((p) => p.slug !== post.slug && p.category !== post.category),
  ).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: [post.cover],
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: siteConfig.name },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article>
        <header className="container-shop pb-12 pt-10 lg:pt-16">
          <Breadcrumbs
            items={[
              { label: 'Главная', href: '/' },
              { label: 'Блог', href: '/blog' },
              { label: post.title },
            ]}
          />
          <Reveal className="mx-auto mt-12 max-w-3xl text-center lg:mt-20">
            <p className="flex items-center justify-center gap-3 font-nav text-xs uppercase tracking-button text-muted">
              <span className="text-accent">{postCategories[post.category]}</span>
              <span aria-hidden="true" className="size-1 rounded-full bg-line-strong" />
              <time dateTime={post.date}>{postDate.format(new Date(post.date))}</time>
              <span aria-hidden="true" className="size-1 rounded-full bg-line-strong" />
              <span>{post.readingMinutes} мин</span>
            </p>
            <h1 className="mt-6 text-4xl text-ink lg:text-6xl">{post.title}</h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted">{post.excerpt}</p>
            <p className="mt-8 text-sm text-ink">{post.author}</p>
          </Reveal>
        </header>

        <Reveal className="container-shop">
          <div className="relative aspect-[16/9] overflow-hidden bg-surface">
            <SafeImage src={post.cover} alt={post.coverAlt} fill priority sizes="(min-width: 1280px) 1200px, 100vw" className="object-cover" />
          </div>
        </Reveal>

        <div className="container-shop">
          <div className="mx-auto max-w-2xl py-16 lg:py-24">
            {post.content.map((block, i) => (
              <Block key={i} block={block} />
            ))}

            <div className="mt-16 flex flex-col items-start gap-6 border-t border-line pt-10 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">Понравилась статья? Подберите букет в каталоге.</p>
              <Button asChild variant="outline">
                <Link href="/catalog">
                  В каталог <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <nav aria-label="Другие статьи" className="mt-12 grid gap-6 sm:grid-cols-2">
              {prev ? (
                <Link href={`/blog/${prev.slug}`} className="group border border-line p-6 transition-colors hover:border-ink">
                  <span className="flex items-center gap-2 font-nav text-xs uppercase tracking-button text-muted">
                    <ArrowLeft className="size-3 transition-transform group-hover:-translate-x-1" aria-hidden="true" /> Предыдущая
                  </span>
                  <span className="mt-3 block font-heading text-lg text-ink">{prev.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {next && (
                <Link href={`/blog/${next.slug}`} className="group border border-line p-6 text-right transition-colors hover:border-ink">
                  <span className="flex items-center justify-end gap-2 font-nav text-xs uppercase tracking-button text-muted">
                    Следующая <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                  <span className="mt-3 block font-heading text-lg text-ink">{next.title}</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </article>

      <section aria-labelledby="related-title" className="section border-t border-line">
        <div className="container-shop">
          <SectionHeading id="related-title" overline="Читайте также" title="Ещё статьи" action={{ href: '/blog', label: 'Все статьи' }} />
          <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p, i) => (
              <li key={p.slug}>
                <Reveal delay={i * STAGGER} className="h-full">
                  <PostCard post={p} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
