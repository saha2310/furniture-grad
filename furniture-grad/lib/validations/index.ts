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
  price: z.coerce.number().min(0),
  old_price: z.coerce.number().min(0).optional().nullable().transform(v => v || null),
  category_id: z.string().uuid().optional().or(z.literal('')).nullable().transform(v => v || null),
  color_id: z.string().uuid().optional().or(z.literal('')).nullable().transform(v => v || null),
  size: z.string().optional(),
  material: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  is_new: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export const widgetSchema = z.object({
  name: z.string().min(1),
  image: z.string().url().optional().or(z.literal('')),
  category_ids: z.array(z.string().uuid()).default([]),
  sort_order: z.coerce.number().default(0),
  is_visible: z.boolean().default(true),
});

export const colorSchema = z.object({
  name: z.string().min(1),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Формат: #rrggbb'),
});

export const contactSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  href: z.string().optional(),
  sort_order: z.coerce.number().default(0),
});
