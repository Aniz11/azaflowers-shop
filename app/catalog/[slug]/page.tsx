import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductCarousel } from '@/components/product/product-carousel';
import { ProductGallery } from '@/components/product/product-gallery';
import { ProductPurchase } from '@/components/product/product-purchase';
import { ProductTabs } from '@/components/product/product-tabs';
import { RecentlyViewed } from '@/components/product/recently-viewed';
import { Badge } from '@/components/ui/badge';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Rating } from '@/components/ui/rating';
import { Overline } from '@/components/ui/section-heading';
import { getCategory } from '@/data/categories';
import { getProductBySlug, products } from '@/data/products';
import { reviews } from '@/data/reviews';
import { getGallery, getSimilarProducts } from '@/lib/product';
import { siteConfig } from '@/lib/site';
import { formatPrice } from '@/lib/utils';

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: 'Товар не найден' };
  const description = `${product.shortDescription} ${formatPrice(product.price)}. Доставка по Астане от 60 минут.`;
  return {
    title: product.name,
    description,
    alternates: { canonical: `/catalog/${product.slug}` },
    openGraph: {
      type: 'website',
      title: `${product.name} — ${siteConfig.name}`,
      description,
      url: `/catalog/${product.slug}`,
      images: [{ url: product.images[0], width: 1200, height: 1500, alt: product.name }],
    },
  };
}

export default function ProductPage({ params }: Params) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const category = getCategory(product.category);
  const productReviews = reviews.filter((r) => r.productSlug === product.slug);

  // Структурированные данные для поисковиков
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    brand: { '@type': 'Brand', name: siteConfig.name },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewsCount },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'KZT',
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
      url: `${siteConfig.url}/catalog/${product.slug}`,
    },
  };

  const badges = (
    <>
      {product.oldPrice && (
        <Badge variant="sale">−{Math.round((1 - product.price / product.oldPrice) * 100)}%</Badge>
      )}
      {product.isHit && <Badge variant="light">Хит</Badge>}
      {product.isNew && <Badge variant="light">Новинка</Badge>}
    </>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="container-shop pb-16 pt-8 lg:pb-32 lg:pt-12">
        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Каталог', href: '/catalog' },
            ...(category ? [{ label: category.name, href: `/catalog?category=${category.slug}` }] : []),
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-12 lg:mt-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ProductGallery images={getGallery(product)} name={product.name} badges={badges} />
          </div>

          <div className="lg:col-span-5">
            <div>
              <div>
                <Overline index={product.id.replace('p', '')}>{category?.name ?? 'Букет'}</Overline>
                <h1 className="mt-5 text-4xl text-ink lg:text-5xl">{product.name}</h1>
                <div className="mt-4 flex items-center gap-4">
                  <Rating value={product.rating} size="md" />
                  <a href="#product-details" className="link-hover text-xs text-muted">
                    {product.rating.toFixed(1)} · {product.reviewsCount} оценок
                  </a>
                </div>
                <p className="mt-6 max-w-md text-base text-muted">{product.shortDescription}</p>
                <div className="mt-8 border-t border-line pt-8">
                  <ProductPurchase product={product} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="product-details" aria-label="Подробности о товаре" className="mt-24 scroll-mt-28 lg:mt-32">
          <ProductTabs product={product} reviews={productReviews} />
        </section>
      </article>

      <ProductCarousel
        id="similar-title"
        index="—"
        overline="Похожие"
        title="Вам может понравиться"
        products={getSimilarProducts(product)}
      />
      <RecentlyViewed currentId={product.id} />
    </>
  );
}
