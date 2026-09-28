import type { Metadata } from 'next';
import { ArrowUpRight, Clock3, Instagram, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ContactForm } from '@/components/contacts/contact-form';
import { PageHeader } from '@/components/layout/page-header';
import { Reveal, STAGGER } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { defaultOgImage, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Контакты',
  description: `Контакты AzaFlowers: ${siteConfig.phone}, ${siteConfig.address}. ${siteConfig.workHours}. Напишите нам — поможем выбрать букет.`,
  alternates: { canonical: '/contacts' },
  openGraph: { title: 'Контакты — AzaFlowers', url: '/contacts', images: [defaultOgImage] },
};

// Координаты мастерской (моковые) для карты OpenStreetMap — без API-ключей и трекинга
const LAT = 51.0915;
const LON = 71.4185;
const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${LON - 0.012}%2C${LAT - 0.006}%2C${LON + 0.012}%2C${LAT + 0.006}&layer=mapnik&marker=${LAT}%2C${LON}`;
const mapLink = `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LON}#map=16/${LAT}/${LON}`;

type Contact = { icon: LucideIcon; label: string; value: string; href?: string };

const contacts: Contact[] = [
  { icon: Phone, label: 'Телефон', value: siteConfig.phone, href: siteConfig.phoneHref },
  { icon: Mail, label: 'Email', value: siteConfig.email, href: `mailto:${siteConfig.email}` },
  { icon: MapPin, label: 'Мастерская', value: siteConfig.address },
  { icon: Clock3, label: 'Приём заказов', value: siteConfig.workHours },
];

const socials: { icon: LucideIcon; label: string; handle: string; href: string }[] = [
  { icon: Instagram, label: 'Instagram', handle: siteConfig.instagram, href: siteConfig.instagramHref },
  { icon: Send, label: 'Telegram', handle: '@azaflowers', href: siteConfig.telegramHref },
  { icon: MessageCircle, label: 'WhatsApp', handle: siteConfig.phone, href: siteConfig.whatsappHref },
];

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Florist',
  name: siteConfig.name,
  telephone: siteConfig.phone,
  email: siteConfig.email,
  address: { '@type': 'PostalAddress', streetAddress: 'пр. Мангилик Ел, 28', addressLocality: 'Астана', addressCountry: 'KZ' },
  geo: { '@type': 'GeoCoordinates', latitude: LAT, longitude: LON },
  openingHours: 'Mo-Su 08:00-23:00',
  url: siteConfig.url,
};

export default function ContactsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
      <PageHeader
        crumbs={[{ label: 'Главная', href: '/' }, { label: 'Контакты' }]}
        index="01"
        overline="Контакты"
        title="Остались вопросы?"
        lead="Позвоните, напишите в мессенджер или оставьте сообщение — ответим в течение 15 минут в рабочее время."
      />

      <section aria-label="Контакты и обратная связь" className="container-shop pb-16 lg:pb-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <address className="not-italic">
              <ul className="border-t border-line">
                {contacts.map(({ icon: Icon, label, value, href }, i) => (
                  <li key={label} className="border-b border-line">
                    <Reveal delay={i * STAGGER} className="group flex items-start gap-5 py-6">
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                        <Icon className="size-4" strokeWidth={1.5} aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block font-nav text-xs uppercase tracking-button text-muted">{label}</span>
                        {href ? (
                          <a href={href} className="link-hover mt-1 block font-heading text-xl text-ink">
                            {value}
                          </a>
                        ) : (
                          <span className="mt-1 block font-heading text-xl text-ink">{value}</span>
                        )}
                      </span>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </address>

            <Reveal className="mt-12">
              <h2 className="font-nav text-xs uppercase tracking-button text-muted">Мы в соцсетях</h2>
              <ul className="mt-4 space-y-2">
                {socials.map(({ icon: Icon, label, handle, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between border border-line px-5 py-4 transition-colors duration-300 hover:border-ink"
                    >
                      <span className="flex items-center gap-4">
                        <Icon className="size-4 text-ink" strokeWidth={1.5} aria-hidden="true" />
                        <span className="text-sm text-ink">{label}</span>
                        <span className="text-xs text-muted">{handle}</span>
                      </span>
                      <ArrowUpRight
                        className="size-4 text-muted transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                        aria-hidden="true"
                      />
                      <span className="sr-only">(откроется в новой вкладке)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div className="min-w-0 lg:col-span-6 lg:col-start-7">
            <Reveal>
              <h2 className="mb-10 font-heading text-3xl font-light text-ink lg:text-4xl">Напишите нам</h2>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="map-title" className="section border-t border-line">
        <div className="container-shop">
          <SectionHeading
            id="map-title"
            index="02"
            overline="Как добраться"
            title="Мастерская на карте"
            description={`${siteConfig.address}. Самовывоз готов через 30 минут после подтверждения заказа.`}
            action={{ href: mapLink, label: 'Открыть карту' }}
          />
          <Reveal className="relative aspect-[4/3] overflow-hidden border border-line bg-surface md:aspect-[21/9]">
            <iframe
              title={`Карта: ${siteConfig.name}, ${siteConfig.address}`}
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="absolute inset-0 size-full grayscale transition-[filter] duration-700 hover:grayscale-0"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
