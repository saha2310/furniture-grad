'use server';

import { createClient } from '@/lib/supabase/server';
import { getTemplateById } from '@/lib/ai-templates';

// Дневной лимит генераций — защита от случайных лишних трат, пока в
// админку не добавлена авторизация. Меняется одной цифрой.
const DAILY_LIMIT = 5;

// Модель подбирается на момент реализации — Google меняет доступные модели
// довольно часто, актуальное имя стоит свериться в документации перед стартом.
const MODEL = 'gemini-2.5-flash-image';

export interface AiImageResult {
  ok: boolean;
  imageBase64?: string;
  mimeType?: string;
  error?: string;
}

async function checkAndIncrementDailyLimit(): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: row } = await supabase.from('ai_usage').select('count').eq('day', today).maybeSingle();
  const current = row?.count ?? 0;

  if (current >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  await supabase.from('ai_usage').upsert({ day: today, count: current + 1 }, { onConflict: 'day' });
  return { allowed: true, remaining: DAILY_LIMIT - current - 1 };
}

/**
 * Отправляет фото товара + промпт (по шаблону или свой текст) в Gemini,
 * возвращает обработанное изображение как base64 или понятную ошибку.
 *
 * ВАЖНО: GEMINI_API_KEY читается только здесь, на сервере — эта функция
 * никогда не выполняется в браузере ('use server').
 */
export async function processProductImage(formData: FormData): Promise<AiImageResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: 'На сервере не настроен GEMINI_API_KEY — добавьте его в переменные окружения.' };
  }

  const file = formData.get('image') as File | null;
  const templateId = formData.get('templateId') as string | null;
  const customPrompt = (formData.get('customPrompt') as string | null)?.trim();

  if (!file || file.size === 0) {
    return { ok: false, error: 'Фото не найдено — попробуйте выбрать его заново.' };
  }
  // Простая защита от слишком тяжёлых файлов (экономит и деньги, и время запроса).
  if (file.size > 10 * 1024 * 1024) {
    return { ok: false, error: 'Файл больше 10 МБ — уменьшите фото и попробуйте снова.' };
  }

  const template = templateId ? getTemplateById(templateId) : undefined;
  const prompt = template?.prompt || customPrompt;
  if (!prompt) {
    return { ok: false, error: 'Не выбран шаблон и не указан свой запрос.' };
  }

  const limit = await checkAndIncrementDailyLimit();
  if (!limit.allowed) {
    return {
      ok: false,
      error: `Достигнут дневной лимит генераций (${DAILY_LIMIT}/день). Попробуйте завтра или увеличьте лимит в настройках.`,
    };
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer()).toString('base64');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inline_data: { mime_type: file.type || 'image/jpeg', data: bytes } },
              ],
            },
          ],
        }),
      }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return { ok: false, error: 'Gemini API: превышен лимит запросов (429). Попробуйте позже.' };
      }
      if (status === 401 || status === 403) {
        return { ok: false, error: 'Gemini API: ключ недействителен или нет доступа (проверьте GEMINI_API_KEY).' };
      }
      const body = await response.text().catch(() => '');
      return { ok: false, error: `Gemini API вернул ошибку ${status}: ${body.slice(0, 200)}` };
    }

    const data = await response.json();
    const parts = data?.candidates?.[0]?.content?.parts ?? [];
    const imagePart = parts.find((p: any) => p.inline_data || p.inlineData);
    const inline = imagePart?.inline_data || imagePart?.inlineData;

    if (!inline?.data) {
      // Модель могла отказаться генерировать (например, из-за политики) —
      // в этом случае обычно есть finishReason вместо картинки.
      const finishReason = data?.candidates?.[0]?.finishReason;
      return {
        ok: false,
        error: finishReason
          ? `Нейросеть не вернула изображение (причина: ${finishReason}).`
          : 'Нейросеть не вернула изображение — попробуйте другой шаблон или фото.',
      };
    }

    return { ok: true, imageBase64: inline.data, mimeType: inline.mime_type || inline.mimeType || 'image/png' };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return { ok: false, error: 'Превышено время ожидания ответа от нейросети (60 сек). Попробуйте ещё раз.' };
    }
    return { ok: false, error: `Не удалось связаться с Gemini API: ${err?.message || 'неизвестная ошибка'}.` };
  }
}
