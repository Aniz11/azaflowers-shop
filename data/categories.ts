import type { Category, CategorySlug } from '@/types';
import { img } from './images';

export const categories: Category[] = [
  { slug: 'roses', name: 'Розы', description: 'Классические и кустовые розы любых оттенков', image: img.gardenRoses },
  { slug: 'peonies', name: 'Пионы и гортензии', description: 'Сезонные пышные букеты', image: img.hydrangea },
  { slug: 'author', name: 'Авторские букеты', description: 'Собраны флористом по настроению', image: img.lushBouquet },
  { slug: 'boxes', name: 'Цветы в коробке', description: 'Шляпные коробки и лёгкие композиции', image: img.tulipsVase },
  { slug: 'baskets', name: 'Корзины', description: 'Большие композиции для особых дат', image: img.flowerShop },
  { slug: 'gifts', name: 'Сладости и подарки', description: 'Клубника в шоколаде, бенто-торты, открытки', image: img.flowerCake },
];

export function getCategory(slug: CategorySlug): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
