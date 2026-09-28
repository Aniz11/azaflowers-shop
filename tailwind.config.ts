import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

/**
 * Токены AzaFlowers (на основе дизайн-системы bukettery).
 * Цвета — только из палитры DESIGN.md (§2 + CSS Variable Tokens), роли подтверждены скриншотами
 * и references/INTERACTIONS.md (hover-цвет rgb(167,50,95) = #a7325f).
 * Шрифты — из @font-face DESIGN.md §3 (Jost, Montserrat, Marcellus, Lora).
 * [screens]   — значение снято замером со screens/*.png и округлено к сетке 4px.
 * [extension] — расширение системы для минималистичной редакции (согласовано), в DESIGN.md нет.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    // DESIGN.md §9 — выбраны значения из списка, совпадающие с целевыми 375 / 768 / 1440
    screens: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      '2xl': '1440px',
    },
    extend: {
      colors: {
        accent: {
          DEFAULT: '#a7325f', // палитра: danger → фактически бренд-акцент. Только точечно.
          hover: '#802649', // палитра
        },
        ink: '#000000', // wp--preset--color--black — текст и тёмные кнопки
        paper: '#ffffff', // surface-neutral-strong — фон страницы
        // a11y: #8d8d8d (3.3:1) и #999999 (2.9:1) не проходят WCAG AA на белом —
        // заменены на соседние оттенки из той же палитры DESIGN.md
        muted: {
          DEFAULT: '#6e6e6e', // thumb-neutral-weak-active — 5.1:1
          light: '#6c757d', // палитра — 4.7:1
        },
        line: {
          DEFAULT: '#e6e6e6', // волосяные линии и рамки
          strong: '#dbdbdb', // track-neutral — пустые звёзды, трек слайдера
        },
        surface: {
          DEFAULT: '#f4f4f4', // surface-neutral-weak — светлые плашки
          soft: '#fcfcfc', // surface-neutral
        },
        success: '#57bf6d',
        warning: '#e9c931',
        error: '#cc1818', // interactive-error-strong
      },
      fontFamily: {
        heading: ['var(--font-jost)', 'sans-serif'],
        body: ['var(--font-montserrat)', 'sans-serif'],
        // Marcellus не содержит кириллицы — кириллица падает на Lora (есть в @font-face DESIGN.md)
        nav: ['var(--font-marcellus)', 'var(--font-lora)', 'serif'],
      },
      fontSize: {
        // DESIGN.md: body 14px, caption 12px; остальное [screens] / [extension]
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.6' }],
        base: ['16px', { lineHeight: '1.6' }],
        lg: ['20px', { lineHeight: '1.4' }],
        xl: ['24px', { lineHeight: '1.3' }],
        '2xl': ['28px', { lineHeight: '1.2' }], // [screens] заголовок секции образца
        '3xl': ['32px', { lineHeight: '1.2' }], // [screens] подзаголовок hero
        '4xl': ['40px', { lineHeight: '1.15' }], // [screens] CTA-заголовок
        'display-sm': ['44px', { lineHeight: '1.05', letterSpacing: '-0.02em' }], // [extension] hero mobile
        '5xl': ['48px', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // [screens] H1 страниц
        '6xl': ['56px', { lineHeight: '1.05', letterSpacing: '-0.02em' }], // [extension] заголовки секций
        '7xl': ['72px', { lineHeight: '1', letterSpacing: '-0.02em' }], // [screens] hero образца
        display: ['96px', { lineHeight: '0.95', letterSpacing: '-0.02em' }], // [extension] hero desktop
      },
      letterSpacing: {
        tight: '-0.02em', // [extension] крупные заголовки
        nav: '0.15em', // [screens] меню Marcellus uppercase
        button: '0.2em', // [screens] кнопки и надстрочники uppercase
      },
      maxWidth: {
        container: '1280px', // [extension] было 1140px [screens]
      },
      borderRadius: {
        // DESIGN.md §5 scale: 4px, 15px, 20px, 50%
        none: '0',
        sm: '4px',
        md: '15px',
        lg: '20px',
        full: '9999px',
      },
      boxShadow: {
        // DESIGN.md §6 Overlay — только для hover и всплывающих элементов
        soft: '0 7px 35px 0 rgba(0,0,0,.05)',
        overlay:
          '0 5px 15px rgba(0,0,0,.08),0 15px 27px rgba(0,0,0,.07),0 30px 36px rgba(0,0,0,.04),0 50px 43px rgba(0,0,0,.02)',
      },
      zIndex: {
        // DESIGN.md §6 Z-Index Scale
        header: '50',
        floating: '99',
        drawer: '100',
      },
      transitionDuration: {
        DEFAULT: '200ms', // INTERACTIONS.md: transition 0.2s
        600: '600ms', // ANIMATIONS.md duration scale
        700: '700ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(.4,0,.2,1)', // ANIMATIONS.md
        expressive: 'cubic-bezier(.25,0,0,1)', // ANIMATIONS.md: modal appear
        'out-expo': 'cubic-bezier(.19,1,.22,1)', // ANIMATIONS.md easing list
      },
      keyframes: {
        // ANIMATIONS.md
        shakes: {
          '16.65%': { transform: 'translateX(10px)' },
          '33.33%': { transform: 'translateX(-8px)' },
          '49.95%': { transform: 'translateX(6px)' },
          '66.6%': { transform: 'translateX(-4px)' },
          '83.25%': { transform: 'translateX(3px)' },
          '100%': { transform: 'translateX(0)' },
        },
        ring: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'scale(1.2)', opacity: '0' },
        },
        'load-product': {
          '0%': { left: '-150px' },
          '100%': { left: '100%' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        // shadcn accordion: высота из CSS-переменной Radix
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        shakes: 'shakes 1s ease-in-out 1',
        ring: 'ring 1.5s linear infinite',
        'load-product': 'load-product 1.5s cubic-bezier(.4,0,.2,1) infinite',
        'fade-in': 'fade-in .3s ease-out',
        'spin-slow': 'spin 50s linear infinite', // [extension] декоративный круг в hero
        'accordion-down': 'accordion-down .3s cubic-bezier(.4,0,.2,1)',
        'accordion-up': 'accordion-up .3s cubic-bezier(.4,0,.2,1)',
      },
    },
  },
  plugins: [animate],
};

export default config;
