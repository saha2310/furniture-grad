'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { productSchema } from '@/lib/validations';
import { uploadImageIfPresent, uploadMultipleImages } from '@/lib/storage';
import { slugifyUnique } from '@/lib/slugify';
import { Product } from '@/lib/types';

const SELECT = '*, categories(*), colors(*), product_images(*)';

// Для витрины — только активные товары.
export async function getProducts(filters?: {
  category?: string | string[]; minPrice?: number; maxPrice?: number;
  color?: string | string[]; discount?: boolean; isNew?: boolean;
}) {
  const supabase = await createClient();
  let query = supabase.from('products').select(SELECT).eq('is_active', true);

  // Фильтры "категория"/"цвет" в каталоге — мультивыбор (можно отметить
  // несколько галочек), поэтому принимаем и одиночную строку, и массив.
  const categories = filters?.category
    ? (Array.isArray(filters.category) ? filters.category : [filters.category]).filter(Boolean)
    : [];
  const colors = filters?.color
    ? (Array.isArray(filters.color) ? filters.color : [filters.color]).filter(Boolean)
    : [];

  if (categories.length > 0) query = query.in('category_id', categories);
  if (filters?.minPrice) query = query.gte('price', filters.minPrice);
  if (filters?.maxPrice) query = query.lte('price', filters.maxPrice);
  if (colors.length > 0) query = query.in('color_id', colors);
  if (filters?.discount) query = query.not('old_price', 'is', null);
  if (filters?.isNew) query = query.eq('is_new', true);

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Для админки — включая скрытые товары, иначе кнопка "Скрыть" была бы
// дорогой в один конец: скрыл — и товар пропадает даже из самой админки.
export async function getAllProductsForAdmin() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select(SELECT).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select(SELECT).eq('slug', slug).single();
  if (error) throw error;
  return data;
}

export async function getProductById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select(SELECT).eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();
  const imageUrl = await uploadImageIfPresent(formData);
  const galleryUrls = await uploadMultipleImages(formData);
  const raw = Object.fromEntries(formData);

  const parsed = productSchema.parse({
    ...raw,
    slug: slugifyUnique(String(raw.name || 'tovar')),
    image: imageUrl ?? '',
    is_new: raw.is_new === 'on',
    is_active: raw.is_active === 'on',
  });

  const { data, error } = await supabase.from('products').insert(parsed).select('id').single();
  if (error) throw error;

  if (galleryUrls.length > 0) {
    const rows = galleryUrls.map((image, i) => ({ product_id: data.id, image, sort_order: i }));
    const { error: imgError } = await supabase.from('product_images').insert(rows);
    if (imgError) throw imgError;
  }

  revalidatePath('/catalog');
  revalidatePath('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();
  const removeImageFlag = formData.get('image_file_remove') === 'on';
  const imageUrl = removeImageFlag ? '' : await uploadImageIfPresent(formData);
  const galleryUrls = await uploadMultipleImages(formData);
  const raw = Object.fromEntries(formData);

  const parsed = productSchema.parse({
    ...raw,
    slug: String(raw.current_slug || slugifyUnique(String(raw.name || 'tovar'))),
    image: removeImageFlag ? '' : imageUrl ?? (raw.current_image as string) ?? '',
    is_new: raw.is_new === 'on',
    is_active: raw.is_active === 'on',
  });

  const { error } = await supabase.from('products').update(parsed).eq('id', id);
  if (error) throw error;

  if (galleryUrls.length > 0) {
    const { data: existing } = await supabase
      .from('product_images')
      .select('sort_order')
      .eq('product_id', id)
      .order('sort_order', { ascending: false })
      .limit(1);
    const startOrder = existing && existing[0] ? existing[0].sort_order + 1 : 0;
    const rows = galleryUrls.map((image, i) => ({ product_id: id, image, sort_order: startOrder + i }));
    const { error: imgError } = await supabase.from('product_images').insert(rows);
    if (imgError) throw imgError;
  }

  revalidatePath('/catalog');
  revalidatePath('/admin/products');
}

export async function deleteProductImage(imageId: string, productId?: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('product_images').delete().eq('id', imageId);
  if (error) throw error;
  revalidatePath('/catalog');
  revalidatePath('/admin/products');
  // Раньше здесь не было ревалидации конкретно этой страницы редактирования —
  // фото удалялось в базе, но список на экране не обновлялся.
  if (productId) revalidatePath(`/admin/products/${productId}/edit`);
}

export async function toggleProductActive(id: string, nextActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from('products').update({ is_active: nextActive }).eq('id', id);
  if (error) throw error;
  revalidatePath('/catalog');
  revalidatePath('/admin/products');
  revalidatePath('/');
}

export async function getProductsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select(SELECT).in('id', ids).eq('is_active', true);
  if (error) throw error;
  return data || [];
}

// Похожие товары под карточкой товара (см. app/catalog/[slug]/page.tsx):
// сначала товары той же категории (кроме самого товара), если их не хватает
// до лимита — добираем активными новинками.
export async function getRelatedProducts(product: Product, limit = 8) {
  const supabase = await createClient();
  const related: Product[] = [];
  const seen = new Set([product.id]);

  if (product.category_id) {
    const { data, error } = await supabase
      .from('products')
      .select(SELECT)
      .eq('category_id', product.category_id)
      .eq('is_active', true)
      .neq('id', product.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    for (const p of data || []) {
      if (!seen.has(p.id)) {
        related.push(p);
        seen.add(p.id);
      }
    }
  }

  if (related.length < limit) {
    const { data, error } = await supabase
      .from('products')
      .select(SELECT)
      .eq('is_new', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    for (const p of data || []) {
      if (related.length >= limit) break;
      if (!seen.has(p.id)) {
        related.push(p);
        seen.add(p.id);
      }
    }
  }

  return related.slice(0, limit);
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/products');
}
