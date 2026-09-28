# AzaFlowers — интернет-магазин букетов

Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui (Radix) · Framer Motion · lucide-react · react-hook-form + zod.
Визуальная система основана на извлечённой дизайн-системе bukettery (`../DESIGN.md`, `../screens/`) в минималистичной редакции.

**Сайт:** https://azaflowers-shop.vercel.app

## Запуск

```bash
npm install
npm run dev        # http://localhost:3000
npm run typecheck  # tsc --noEmit
npm run lint
npm run build && npm start
```

## Страницы

| Маршрут | Что внутри |
|---|---|
| `/` | Hero, категории, 8 популярных букетов, «Почему мы», отзывы, подписка |
| `/catalog` | Фильтры (категория, цена, повод, цвет, состав, размер), сортировка, 3/4 колонки, пагинация. Состояние — в URL |
| `/catalog/[slug]` | Галерея с лупой и полноэкранным просмотром, размеры, количество, табы, похожие, недавно просмотренные |
| `/favorites` | Избранное (localStorage) |
| `/cart` | Количество, удаление с отменой, промокоды, прогресс до бесплатной доставки, «С этим покупают» |
| `/checkout`, `/checkout/success` | Форма заказа с условной валидацией, сводка, страница подтверждения |
| `/about`, `/delivery`, `/contacts` | История и счётчики, тарифы и FAQ, форма обратной связи и карта |
| `/blog`, `/blog/[slug]` | Журнал с фильтром по рубрикам и страница статьи |

## Структура

```
app/            маршруты, sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx, template.tsx (переходы)
components/
  ui/           Button, Input, Card, Badge, Slider, Checkbox, Select, Sheet, Tabs, Accordion, Reveal, …
  layout/       Header, Footer, TopBar, MainNav, MobileMenu, PageHeader, FloatingActions
  product/      ProductCard, ProductGrid, CatalogView, CatalogFilters, ProductGallery, ProductPurchase, …
  cart/         StoreProvider (корзина, избранное, промокод), CartView, CartItemRow, PromoCode, OrderTotals
  checkout/ contacts/ blog/ home/
data/           products.ts (20), categories.ts (6), reviews.ts (10), posts.ts, faq.ts, images.ts
lib/            catalog.ts (фильтры/сортировка/URL), cart.ts (итоги), checkout.ts (схема, маска телефона),
                promo.ts, delivery.ts, product.ts, validation.ts, site.ts, utils.ts
hooks/          use-local-storage, use-recently-viewed
```

## Дизайн-токены

Все значения — в `tailwind.config.ts` с пометками источника:

- без пометки — из `DESIGN.md` (палитра, радиусы, тени, keyframes, transition 0.2s);
- `[screens]` — снято со скриншотов образца;
- `[extension]` — расширение для минималистичной редакции (крупная типографика, контейнер 1280px).

Акцент `#a7325f` используется точечно. Вторичный текст — `#6e6e6e` / `#6c757d` (оттенки из той же палитры,
проходящие WCAG AA; исходные `#8d8d8d` / `#999999` давали контраст 3.3:1 и 2.9:1).

## Деплой

Проект `azaflowers-shop` на Vercel подключён к этому репозиторию:
push в `main` → продакшен-деплой, push в любую другую ветку → preview-ссылка.

Абсолютный URL сайта (canonical, og, sitemap, JSON-LD) берётся из `NEXT_PUBLIC_SITE_URL`,
а на Vercel — автоматически из продакшн-домена (`VERCEL_PROJECT_PRODUCTION_URL`).
Для своего домена задайте `NEXT_PUBLIC_SITE_URL=https://ваш-домен` в настройках проекта Vercel.

## Данные и моки

- Фото — Unsplash, каждое проверено вручную (`data/images.ts`). Если фото не загрузится, `SafeImage` покажет плейсхолдер.
- Отправка заказа, формы контактов и подписки имитируется (задержка + localStorage), бэкенда нет.
- Промокоды: `HELLO10` (−10%), `AZA2000` (−2 000 ₸ от 20 000 ₸), `FREEDELIVERY`.
- Контакты и координаты мастерской — вымышленные.

## Проверено

- 0 нарушений axe-core (WCAG 2.1 AA + best practices) на всех типах страниц при 1440 / 768 / 375 px.
- Нет горизонтального скролла на 375 / 768 / 1440 px.
- 45 внутренних ссылок без битых; навигация с клавиатуры, skip-link, видимый фокус, `prefers-reduced-motion`.
