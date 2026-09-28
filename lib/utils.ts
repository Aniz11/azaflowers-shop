import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Объясняем tailwind-merge кастомные токены: иначе text-display (размер) и text-accent (цвет)
// попадут в одну группу и один из классов будет выброшен.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['display', 'display-sm'] }],
      'text-color': [
        { text: ['accent', 'accent-hover', 'ink', 'paper', 'muted', 'muted-light', 'success', 'warning', 'error'] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const priceFormatter = new Intl.NumberFormat('ru-RU');

export function formatPrice(value: number): string {
  // Неразрывный пробел: знак валюты не отрывается от числа при переносе
  return `${priceFormatter.format(value)} ₸`;
}

/** Склонение: plural(5, ['букет', 'букета', 'букетов']) → 'букетов' */
export function plural(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1];
  return forms[2];
}
