import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

// Edge: в Node-рантайме Next 14 next/og под Windows падает с «Invalid URL» на встроенном шрифте
export const runtime = 'edge';
export const alt = `${siteConfig.name} — доставка цветов в Астане за 1 час`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Общая og-картинка сайта в стиле системы: белый фон, контурные круги, точка акцента */
export default async function OpengraphImage() {
  // Встроенный шрифт next/og без кириллицы — берём Jost из дизайн-системы (assets/fonts)
  const [light, regular] = await Promise.all([
    fetch(new URL('../assets/fonts/Jost-Light.ttf', import.meta.url)).then((r) => r.arrayBuffer()),
    fetch(new URL('../assets/fonts/Jost-Regular.ttf', import.meta.url)).then((r) => r.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          padding: 80,
          position: 'relative',
          fontFamily: 'Jost',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -120,
            top: -120,
            width: 560,
            height: 560,
            borderRadius: 9999,
            border: '1px solid #dbdbdb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 360, height: 360, borderRadius: 9999, border: '1px solid #dbdbdb', display: 'flex' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 9999,
              border: '1px solid #000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 24,
            }}
          >
            AF
          </div>
          <div style={{ display: 'flex', fontSize: 40, fontWeight: 400 }}>
            <span>Aza</span>
            <span style={{ color: '#6e6e6e' }}>Flowers</span>
            <span style={{ color: '#a7325f' }}>.</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontWeight: 300 }}>
          <div style={{ fontSize: 100, lineHeight: 1, letterSpacing: -2, color: '#000000' }}>Цветы, которые</div>
          <div style={{ fontSize: 100, lineHeight: 1, letterSpacing: -2, color: '#000000', display: 'flex' }}>
            говорят за вас<span style={{ color: '#a7325f' }}>.</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, fontSize: 24, color: '#6e6e6e', letterSpacing: 4 }}>
          <span>ДОСТАВКА ПО АСТАНЕ ЗА 60 МИНУТ</span>
          <span style={{ color: '#a7325f' }}>•</span>
          <span>AZAFLOWERS</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Jost', data: light, weight: 300, style: 'normal' },
        { name: 'Jost', data: regular, weight: 400, style: 'normal' },
      ],
    },
  );
}
