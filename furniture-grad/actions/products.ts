'use server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { productSchema } from '@/lib/validations';
import { uploadImageIfPresent, uploadMultipleImages } from '@/lib/storage';
import { slugifyUnique } from '@/lib/slugify';

const SELECT = '*, categories(*), colors(*), product_images(*)';

export async function getProducts(filters?: {
  category?: string; minPrice?: number; maxPrice?: number;
  color?: string; discount?: boolean; isNew?: boolean;
}) {
  const supabase = await createClient();
  let query = supabase.from('products').select(SELECT).eq('is_active', true);

  if (filters?.category) query = query.eq('category_id', filters.category);
  if (filters?.minPrice) query = query.gte('price', filters.minPrice);
  if (filters?.maxPrice) query = query.lte('price', filters.maxPrice);
  if (filters?.color) query = query.eq('color_id', filters.color);
  if (filters?.discount) query = query.not('old_price', 'is', null);
  if (filters?.isNew) query = query.eq('is_new', true);

  const { data, error } = await query.order('created_at', { ascending: false });
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
  const imageUrl = await uploadImageIfPresent(formData);
  const galleryUrls = await uploadMultipleImages(formData);
  const raw = Object.fromEntries(formData);

  const parsed = productSchema.parse({
    ...raw,
    slug: String(raw.current_slug || slugifyUnique(String(raw.name || 'tovar'))),
    image: imageUrl ?? (raw.current_image as string) ?? '',
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

export async function deleteProductImage(imageId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('product_images').delete().eq('id', imageId);
  if (error) throw error;
  revalidatePath('/catalog');
  revalidatePath('/admin/products');
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/products');
}
