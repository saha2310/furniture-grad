import { randomUUID } from 'crypto';
import { createClient } from '@/lib/supabase/server';

const BUCKET = 'images';

// Если в formData есть файл под указанным именем — загружает его в Supabase
// Storage и возвращает публичную ссылку. Если файла нет (поле пустое) — null,
// это значит "изображение не менялось / не выбрано".
export async function uploadImageIfPresent(
  formData: FormData,
  fieldName = 'image_file'
): Promise<string | null> {
  const file = formData.get(fieldName);
  if (!(file instanceof File) || file.size === 0) return null;

  const supabase = await createClient();
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
  const path = `${randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Загружает все файлы, выбранные в <input type="file" multiple name={fieldName}>,
// и возвращает список публичных ссылок (для галереи товара).
export async function uploadMultipleImages(
  formData: FormData,
  fieldName = 'gallery_files'
): Promise<string[]> {
  const files = formData.getAll(fieldName).filter(f => f instanceof File && f.size > 0) as File[];
  if (files.length === 0) return [];

  const supabase = await createClient();

  const uploads = files.map(async file => {
    const ext = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
    const path = `${randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type || 'application/octet-stream',
      upsert: false,
    });
    if (error) throw error;
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    return data.publicUrl;
  });

  // Один "плохой" файл не должен обрушивать всю пачку — собираем то, что
  // получилось загрузить, а остальное просто пропускаем.
  const results = await Promise.allSettled(uploads);
  return results
    .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
    .map(r => r.value);
}
