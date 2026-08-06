import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Название обязательно'),
  slug: z.string().min(1),
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  sort_order: z.coerce.number().default(0),
  is_active: z.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().int('Цена должна быть целым числом, без копеек').min(0),
  old_price: z.coerce.number().int('Старая цена должна быть целым числом, без копеек').min(0).optional().nullable().transform(v => v || null),
  category_id: z.string().uuid().optional().or(z.literal('')).nullable().transform(v => v || null),
  color_id: z.string().uuid().optional().or(z.literal('')).nullable().transform(v => v || null),
  size: z.string().optional(),
  material: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  is_new: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export const colorSchema = z.object({
  name: z.string().min(1),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Формат: #rrggbb'),
});

// Разрешённые схемы ссылок для контактов (кроме обычных http/https) —
// tel:/mailto: чаще всего и нужны для "Позвонить"/"Написать письмо".
const HREF_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;

export const contactSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  href: z
    .string()
    .optional()
    .transform(v => {
      const trimmed = v?.trim();
      if (!trimmed) return trimmed;
      // Если схема не указана (нет "https:", "tel:", "mailto:" и т.п.) —
      // считаем, что это домен/адрес сайта, и подставляем https://,
      // иначе браузер трактует значение как относительный путь на самом
      // сайте, и кнопка контакта ведёт "в никуда".
      return HREF_SCHEME_RE.test(trimmed) ? trimmed : `https://${trimmed}`;
    }),
  sort_order: z.coerce.number().default(0),
});
