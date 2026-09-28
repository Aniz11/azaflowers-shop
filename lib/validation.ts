import { z } from 'zod';

export const subscribeSchema = z.object({
  email: z.string().trim().min(1, 'Введите email').email('Проверьте формат email'),
  consent: z.boolean().refine((value) => value, 'Нужно согласие на получение писем'),
});

export type SubscribeValues = z.infer<typeof subscribeSchema>;

export const contactTopics = [
  { value: 'order', label: 'Вопрос по заказу' },
  { value: 'custom', label: 'Индивидуальный букет' },
  { value: 'corporate', label: 'Для компаний и событий' },
  { value: 'feedback', label: 'Отзыв или предложение' },
] as const;

type Topic = (typeof contactTopics)[number]['value'];

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Как к вам обращаться?').max(60, 'Слишком длинное имя'),
  email: z.string().trim().min(1, 'Введите email').email('Проверьте формат email'),
  topic: z.enum(contactTopics.map((t) => t.value) as [Topic, ...Topic[]], {
    errorMap: () => ({ message: 'Выберите тему' }),
  }),
  message: z
    .string()
    .trim()
    .min(10, 'Расскажите чуть подробнее — минимум 10 символов')
    .max(1000, 'Не больше 1000 символов'),
  consent: z.boolean().refine((v) => v, 'Нужно согласие на обработку данных'),
});

export type ContactValues = z.infer<typeof contactSchema>;
