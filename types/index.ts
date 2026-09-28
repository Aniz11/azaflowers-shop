export type CategorySlug = 'roses' | 'peonies' | 'author' | 'boxes' | 'baskets' | 'gifts';

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  image: string;
};

export type Occasion = 'birthday' | 'love' | 'wedding' | 'mom' | 'thanks' | 'just-because';

export type FlowerColor = 'red' | 'pink' | 'white' | 'peach' | 'blue' | 'yellow' | 'mixed';

export type ProductSize = 'S' | 'M' | 'L';

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  price: number;
  oldPrice?: number;
  images: string[];
  rating: number;
  reviewsCount: number;
  shortDescription: string;
  description: string;
  /** Состав: «Роза Эквадор — 15 шт.» */
  composition: string[];
  /** Для фильтра «состав» */
  flowers: string[];
  occasions: Occasion[];
  colors: FlowerColor[];
  size: ProductSize;
  /** Высота букета, см */
  height: number;
  isHit?: boolean;
  isNew?: boolean;
  inStock: boolean;
};

export type Review = {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string; // ISO
  text: string;
  productSlug?: string;
};

export type PostCategory = 'care' | 'guides' | 'trends' | 'stories';

export type PostBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string; author?: string }
  | { type: 'list'; items: string[]; ordered?: boolean };

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: PostCategory;
  cover: string;
  coverAlt: string;
  date: string; // ISO
  author: string;
  readingMinutes: number;
  content: PostBlock[];
};

export type CartItem = {
  productId: string;
  quantity: number;
  size?: string;
};
