import type { Metadata } from 'next';
import { AdvantagesSection } from '@/components/home/advantages-section';
import { CategoriesSection } from '@/components/home/categories-section';
import { Hero } from '@/components/home/hero';
import { PopularSection } from '@/components/home/popular-section';
import { ReviewsSection } from '@/components/home/reviews-section';
import { SubscribeSection } from '@/components/home/subscribe-section';
import { img } from '@/data/images';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — доставка цветов в Астане за 1 час` },
  description: siteConfig.description,
  alternates: { canonical: '/' },
  openGraph: {
    title: `${siteConfig.name} — цветы, которые говорят за вас`,
    description: siteConfig.description,
    url: '/',
    images: [{ url: img.lushBouquet, width: 1200, height: 1500, alt: 'Букет AzaFlowers' }],
  },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesSection />
      <PopularSection />
      <AdvantagesSection />
      <ReviewsSection />
      <SubscribeSection />
    </>
  );
}
