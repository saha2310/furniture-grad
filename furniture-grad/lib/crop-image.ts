function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', reject);
    image.crossOrigin = 'anonymous';
    image.src = url;
  });
}

export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Максимальная ширина/высота готового файла. Раньше было 1600px/85% JPEG —
// заметно мылило фото, особенно после обработки в PhotoRoom. Подняли до
// 3000px и почти без потерь по качеству (0.95). Файлы стали крупнее (обычно
// 1–3 МБ вместо 200–400 КБ), это осознанный компромисс в пользу чёткости.
const MAX_OUTPUT_DIMENSION = 3000;
const JPEG_QUALITY = 0.95;

// Вырезает область pixelCrop из картинки по адресу imageSrc, при необходимости
// уменьшает результат до разумного размера и превращает в компактный File,
// который затем подставляется в обычный <input type="file"> формы.
export async function getCroppedImageFile(
  imageSrc: string,
  pixelCrop: PixelCrop,
  fileName: string
): Promise<File> {
  const image = await createImage(imageSrc);

  const scale = Math.min(1, MAX_OUTPUT_DIMENSION / Math.max(pixelCrop.width, pixelCrop.height));
  const outWidth = Math.round(pixelCrop.width * scale);
  const outHeight = Math.round(pixelCrop.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = outWidth;
  canvas.height = outHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context недоступен');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    outWidth,
    outHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) { reject(new Error('Не удалось создать изображение')); return; }
      resolve(new File([blob], fileName, { type: 'image/jpeg' }));
    }, 'image/jpeg', JPEG_QUALITY);
  });
}

// Для галереи (без обрезки) — просто уменьшает и сжимает файл, если он крупный.
export async function resizeImageFile(file: File): Promise<File> {
  const url = URL.createObjectURL(file);
  try {
    const image = await createImage(url);
    const scale = Math.min(1, MAX_OUTPUT_DIMENSION / Math.max(image.width, image.height));
    const outWidth = Math.round(image.width * scale);
    const outHeight = Math.round(image.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = outWidth;
    canvas.height = outHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(image, 0, 0, outWidth, outHeight);

    return await new Promise<File>((resolve, reject) => {
      canvas.toBlob(blob => {
        if (!blob) { reject(new Error('Не удалось создать изображение')); return; }
        resolve(new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' }));
      }, 'image/jpeg', JPEG_QUALITY);
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
