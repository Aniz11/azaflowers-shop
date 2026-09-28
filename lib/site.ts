export const siteConfig = {
  name: 'AzaFlowers',
  description:
    'Авторские букеты и живые цветы с доставкой по Астане за 1 час. Свежие розы, пионы, композиции в коробках и подарки.',
  url: 'https://azaflowers.example',
  city: 'Астана',
  phone: '+7 (777) 123-45-67',
  phoneHref: 'tel:+77771234567',
  email: 'hello@azaflowers.example',
  whatsappHref: 'https://wa.me/77771234567',
  instagram: '@azaflowers',
  instagramHref: 'https://instagram.com/azaflowers',
  telegramHref: 'https://t.me/azaflowers',
  address: 'г. Астана, пр. Мангилик Ел, 28',
  workHours: 'Ежедневно с 8:00 до 23:00',
} as const;

/** Общая og-картинка (app/opengraph-image.tsx) — для страниц без своей обложки */
export const defaultOgImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'AzaFlowers — доставка цветов в Астане за 1 час',
};

export type NavLink = {
  href: string;
  label: string;
};

export const mainNav: NavLink[] = [
  { href: '/', label: 'Главная' },
  { href: '/catalog', label: 'Каталог' },
  { href: '/about', label: 'О нас' },
  { href: '/delivery', label: 'Доставка' },
  { href: '/blog', label: 'Блог' },
  { href: '/contacts', label: 'Контакты' },
];

export const topBarLinks: NavLink[] = [
  { href: '/contacts', label: 'Контакты' },
  { href: '/delivery', label: 'Доставка и оплата' },
];

export const footerClientLinks: NavLink[] = [
  { href: '/about', label: 'О магазине' },
  { href: '/delivery', label: 'Доставка и оплата' },
  { href: '/blog', label: 'Блог о цветах' },
  { href: '/contacts', label: 'Контакты' },
];
