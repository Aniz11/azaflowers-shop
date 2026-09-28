import { Camera, Clock3, Flower2, Gift } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Reveal, STAGGER } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';

type Advantage = { icon: LucideIcon; title: string; text: string };

const advantages: Advantage[] = [
  { icon: Clock3, title: 'Доставка за 60 минут', text: 'Курьеры по всей Астане ежедневно с 8:00 до 23:00.' },
  { icon: Flower2, title: 'Только свежие цветы', text: 'Поставки каждое утро. Собираем букет в день заказа.' },
  { icon: Camera, title: 'Фото перед отправкой', text: 'Покажем готовый букет, прежде чем он поедет к получателю.' },
  { icon: Gift, title: 'Открытка в подарок', text: 'Напишем ваши слова от руки на дизайнерской открытке.' },
];

export function AdvantagesSection() {
  return (
    <section aria-labelledby="advantages-title" className="section border-t border-line bg-surface-soft">
      <div className="container-shop">
        <SectionHeading id="advantages-title" index="04" overline="Почему мы" title="Заботимся о каждой детали" />

        <ul className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              className="group border-b border-line py-10 sm:px-8 sm:odd:border-r sm:odd:pl-0 lg:border-b-0 lg:border-r lg:py-12 lg:odd:pl-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
            >
              <Reveal delay={i * STAGGER} className="h-full">
                <div className="flex items-start justify-between">
                  {/* При hover иконка «вздрагивает» — keyframe shakes из образца */}
                  <span className="flex size-14 items-center justify-center rounded-full border border-line text-ink transition-colors duration-300 group-hover:border-accent group-hover:text-accent">
                    <Icon className="size-5 group-hover:animate-shakes" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="font-nav text-xs text-muted-light">{String(i + 1).padStart(2, '0')} / 04</span>
                </div>
                <h3 className="mt-8 font-heading text-xl font-normal text-ink">{title}</h3>
                <p className="mt-3 text-sm text-muted">{text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
