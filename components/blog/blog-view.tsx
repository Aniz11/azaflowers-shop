'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal } from '@/components/ui/reveal';
import { postCategories } from '@/data/posts';
import { cn } from '@/lib/utils';
import type { Post, PostCategory } from '@/types';
import { PostCard } from './post-card';

type Filter = PostCategory | 'all';

export function BlogView({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [featured, ...rest] = posts;
  const filtered = filter === 'all' ? rest : posts.filter((p) => p.category === filter);
  const filters: [Filter, string][] = [['all', 'Все статьи'], ...(Object.entries(postCategories) as [PostCategory, string][])];

  return (
    <>
      <h2 className="sr-only">Статьи</h2>
      {filter === 'all' && featured && (
        <Reveal className="border-b border-line pb-16 lg:pb-24">
          <PostCard post={featured} featured priority />
        </Reveal>
      )}

      <div
        role="group"
        aria-label="Фильтр по рубрикам"
        className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-10 md:mx-0 md:flex-wrap md:px-0"
      >
        {filters.map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            aria-pressed={filter === value}
            className={cn(
              'shrink-0 rounded-full border px-5 py-2 text-sm transition-colors duration-300',
              filter === value ? 'border-ink bg-ink text-paper' : 'border-line text-ink hover:border-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.ul layout className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((post) => (
            <motion.li
              key={post.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            >
              <PostCard post={post} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {filtered.length === 0 && <p className="py-16 text-center text-sm text-muted">В этой рубрике пока нет статей.</p>}
    </>
  );
}
