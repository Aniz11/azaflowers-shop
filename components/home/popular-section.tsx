import { ProductGrid } from '@/components/product/product-grid';
import { SectionHeading } from '@/components/ui/section-heading';
import { getPopularProducts } from '@/data/products';

export function PopularSection() {
  return (
    <section aria-labelledby="popular-title" className="section border-t border-line">
      <div className="container-shop">
        <SectionHeading
          id="popular-title"
          index="03"
          overline="Популярное"
          title="Выбирают чаще всего"
          description="Букеты, которые наши клиенты заказывают снова и снова."
          action={{ href: '/catalog?sort=popular', label: 'Смотреть все' }}
        />
        <ProductGrid products={getPopularProducts(8)} />
      </div>
    </section>
  );
}
