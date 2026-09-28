import type { MetadataRoute } from 'next';
import { posts } from '@/data/posts';
import { products } from '@/data/products';
import { siteConfig } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ['', '/catalog', '/about', '/delivery', '/contacts', '/blog'].map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: path === '' || path === '/catalog' ? ('daily' as const) : ('monthly' as const),
    priority: path === '' ? 1 : 0.8,
  }));
  const productPages = products.map((p) => ({
    url: `${siteConfig.url}/catalog/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  const postPages = posts.map((p) => ({
    url: `${siteConfig.url}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'yearly' as const,
    priority: 0.5,
  }));
  return [...staticPages, ...productPages, ...postPages];
}
