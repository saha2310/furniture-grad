// Шаблоны обработки фона фото товара через PhotoRoom Remove Background API.
// В отличие от генеративных нейросетей, тут нет свободного текстового промпта —
// каждый шаблон это просто набор параметров вызова API (цвет фона, формат, обрезка).

export interface AiTemplate {
  id: string;
  label: string;
  icon: string;
  description: string;
  /** Параметры для PhotoRoom API (см. actions/ai-image.ts) */
  params: {
    bgColor?: string; // hex без решётки, например 'FFFFFF'. Не задан = прозрачный фон.
    format: 'png' | 'jpg';
    crop: boolean;
  };
}

export const AI_TEMPLATES: AiTemplate[] = [
  {
    id: 'white-studio',
    label: 'Белый студийный фон',
    icon: '⬜',
    description: 'Чистый белый фон вместо исходного',
    params: { bgColor: 'FFFFFF', format: 'jpg', crop: true },
  },
  {
    id: 'catalog-cover',
    label: 'Обложка каталога',
    icon: '🖼️',
    description: 'Серый фон под цвет сайта (#f0f0f0)',
    params: { bgColor: 'F0F0F0', format: 'jpg', crop: true },
  },
  {
    id: 'transparent',
    label: 'Без фона',
    icon: '✂️',
    description: 'Товар вырезан на прозрачную подложку (PNG)',
    params: { format: 'png', crop: true },
  },
];

export function getTemplateById(id: string): AiTemplate | undefined {
  return AI_TEMPLATES.find(t => t.id === id);
}
