import type { Metadata } from 'next';
import { BlogView } from '@/components/blog/blog-view';
import { PageHeader } from '@/components/layout/page-header';
import { posts } from '@/data/posts';

export const metadata: Metadata = {
  title: 'Блог о цветах',
  description: 'Советы флористов AzaFlowers: уход за букетами, язык цветов, тренды сезона и истории из мастерской.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Блог о цветах — AzaFlowers',
    url: '/blog',
    images: [{ url: posts[0].cover, width: 1200, height: 900, alt: posts[0].coverAlt }],
  },
};

export default function BlogPage() {
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Главная', href: '/' }, { label: 'Блог' }]}
        index={String(posts.length).padStart(2, '0')}
        overline="Статей в журнале"
        title="Журнал о цветах"
        lead="Советы по уходу, гиды по выбору и истории из нашей мастерской."
      />
      <div className="container-shop pb-16 lg:pb-32">
        <BlogView posts={sorted} />
      </div>
    </>
  );
}
