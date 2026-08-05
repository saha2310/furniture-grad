// Шаблоны обработки фона фото товара.
//
// Два разных механизма "под капотом":
//  - kind: 'photoroom' — цвет фона рисует сам PhotoRoom (параметр bg_color),
//    вызывается один раз, платится один вызов API.
//  - kind: 'gradient'  — локальный (бесплатный) вариант: используется ОДИН
//    и тот же вырезанный на прозрачном фоне PNG (шаблон 'transparent'),
//    а градиент подкладывается под него на canvas в браузере, без новых
//    обращений к PhotoRoom. Поэтому таких шаблонов можно добавлять сколько
//    угодно, не тратя лишние кредиты.
export interface AiTemplate {
  id: string;
  label: string;
  icon: string;
  description: string;
  kind: 'photoroom' | 'gradient';
  /** Параметры для PhotoRoom API (см. actions/ai-image.ts). Используются для kind: 'photoroom',
   *  а также как параметры получения прозрачного PNG для всех 'gradient' шаблонов. */
  params: {
    bgColor?: string; // hex с решёткой, например '#FFFFFF'. Не задан = прозрачный фон.
    format: 'png' | 'jpg';
    crop: boolean;
  };
  /** Только для kind: 'gradient' — два цвета линейного градиента и угол в градусах. */
  gradient?: { from: string; to: string; angle: number };
}

export const AI_TEMPLATES: AiTemplate[] = [
  {
    id: 'white-studio',
    label: 'Белый студийный фон',
    icon: '⬜',
    description: 'Чистый белый фон вместо исходного',
    kind: 'photoroom',
    params: { bgColor: '#FFFFFF', format: 'jpg', crop: true },
  },
  {
    id: 'catalog-cover',
    label: 'Обложка каталога',
    icon: '🖼️',
    description: 'Серый фон под цвет сайта (#f0f0f0)',
    kind: 'photoroom',
    params: { bgColor: '#F0F0F0', format: 'jpg', crop: true },
  },
  {
    id: 'transparent',
    label: 'Без фона',
    icon: '✂️',
    description: 'Товар вырезан на прозрачную подложку (PNG)',
    kind: 'photoroom',
    params: { format: 'png', crop: true },
  },
  {
    id: 'gradient-warm',
    label: 'Тёплый градиент',
    icon: '🌅',
    description: 'Бежево-персиковый переход — уютно, для мебели из дерева',
    kind: 'gradient',
    params: { format: 'png', crop: true },
    gradient: { from: '#FFF3E6', to: '#F3C89A', angle: 165 },
  },
  {
    id: 'gradient-cool',
    label: 'Холодный градиент',
    icon: '❄️',
    description: 'Серо-голубой переход — строго и современно',
    kind: 'gradient',
    params: { format: 'png', crop: true },
    gradient: { from: '#EAF1F5', to: '#B9C9D3', angle: 165 },
  },
  {
    id: 'gradient-graphite',
    label: 'Графитовый градиент',
    icon: '🌑',
    description: 'Светло- к тёмно-серому — премиальный, контрастный вид',
    kind: 'gradient',
    params: { format: 'png', crop: true },
    gradient: { from: '#F2F2F2', to: '#9AA0A6', angle: 165 },
  },
  {
    id: 'gradient-sage',
    label: 'Зелёный градиент',
    icon: '🌿',
    description: 'Мятно-оливковый переход — свежо, для интерьерных сцен',
    kind: 'gradient',
    params: { format: 'png', crop: true },
    gradient: { from: '#EEF3E9', to: '#B9CBA6', angle: 165 },
  },
];

export function getTemplateById(id: string): AiTemplate | undefined {
  return AI_TEMPLATES.find(t => t.id === id);
}
