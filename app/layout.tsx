import type { Metadata, Viewport } from 'next';
import { Jost, Lora, Marcellus, Montserrat } from 'next/font/google';
import { StoreProvider } from '@/components/cart/store-provider';
import { FloatingActions } from '@/components/layout/floating-actions';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { MotionProvider } from '@/components/ui/motion-provider';
import { siteConfig } from '@/lib/site';
import './globals.css';

const jost = Jost({ subsets: ['latin', 'cyrillic'], variable: '--font-jost', display: 'swap' });
const montserrat = Montserrat({ subsets: ['latin', 'cyrillic'], variable: '--font-montserrat', display: 'swap' });
const marcellus = Marcellus({ subsets: ['latin'], weight: '400', variable: '--font-marcellus', display: 'swap' });
const lora = Lora({ subsets: ['cyrillic'], weight: '400', variable: '--font-lora', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — доставка цветов в Астане за 1 час`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: siteConfig.name,
    title: `${siteConfig.name} — свежие букеты с доставкой`,
    description: siteConfig.description,
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#a7325f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${jost.variable} ${montserrat.variable} ${marcellus.variable} ${lora.variable}`}>
      <body className="flex min-h-screen flex-col">
        <MotionProvider>
          <StoreProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-drawer focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
            >
              Перейти к содержимому
            </a>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <FloatingActions />
          </StoreProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
