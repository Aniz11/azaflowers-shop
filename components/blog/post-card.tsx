import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SafeImage } from '@/components/ui/safe-image';
import { postCategories } from '@/data/posts';
import { cn } from '@/lib/utils';
import type { Post } from '@/types';

export const postDate = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

export function PostCard({ post, featured = false, priority = false }: { post: Post; featured?: boolean; priority?: boolean }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className={cn('group relative flex h-full flex-col', featured && 'lg:grid lg:grid-cols-12 lg:gap-12')}>
      <div className={cn('relative overflow-hidden bg-surface', featured ? 'aspect-[4/3] lg:col-span-7' : 'aspect-[4/3]')}>
        <SafeImage
          src={post.cover}
          alt={post.coverAlt}
          fill
          priority={priority}
          sizes={featured ? '(min-width: 992px) 720px, 100vw' : '(min-width: 992px) 400px, 100vw'}
          className="object-cover transition-transform duration-700 ease-out-expo group-hover:scale-105"
        />
        <span className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full bg-paper text-ink opacity-0 transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:opacity-100">
          <ArrowUpRight className="size-4 -rotate-45" strokeWidth={1.5} aria-hidden="true" />
        </span>
      </div>
      <div className={cn('flex flex-1 flex-col pt-6', featured && 'lg:col-span-5 lg:justify-center lg:pt-0')}>
        <p className="flex items-center gap-3 font-nav text-xs uppercase tracking-button text-muted">
          <span className="text-accent">{postCategories[post.category]}</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-line-strong" />
          <time dateTime={post.date}>{postDate.format(new Date(post.date))}</time>
        </p>
        <h3 className={cn('mt-4 font-heading font-light text-ink transition-colors group-hover:text-accent', featured ? 'text-3xl lg:text-5xl' : 'text-2xl')}>
          {/* Ссылка растянута на всю карточку через ::after */}
          <Link href={href} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className={cn('mt-4 text-sm text-muted', featured && 'lg:text-base')}>{post.excerpt}</p>
        <p className="mt-auto pt-6 text-xs text-muted-light">
          {post.readingMinutes} мин чтения · {post.author}
        </p>
      </div>
    </article>
  );
}
