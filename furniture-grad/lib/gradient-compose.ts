// Подкладывает линейный градиент под изображение с прозрачным фоном (PNG),
// полностью на клиенте, без обращений к PhotoRoom. Используется для
// gradient-шаблонов в AiEditModal — базовый вырез запрашивается у PhotoRoom
// один раз и переиспользуется для всех градиентных вариантов.

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function composeGradientFile(
  cutoutBase64: string,
  cutoutMimeType: string,
  gradient: { from: string; to: string; angle: number },
  fileName: string
): Promise<File> {
  const src = `data:${cutoutMimeType};base64,${cutoutBase64}`;
  const img = await loadImage(src);

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context недоступен');

  // Направление градиента по углу (0° — снизу вверх, по часовой стрелке).
  const rad = ((gradient.angle - 90) * Math.PI) / 180;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const len = Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2;
  const x0 = cx - Math.cos(rad) * len;
  const y0 = cy - Math.sin(rad) * len;
  const x1 = cx + Math.cos(rad) * len;
  const y1 = cy + Math.sin(rad) * len;

  const linGradient = ctx.createLinearGradient(x0, y0, x1, y1);
  linGradient.addColorStop(0, gradient.from);
  linGradient.addColorStop(1, gradient.to);
  ctx.fillStyle = linGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) { reject(new Error('Не удалось собрать изображение с градиентом')); return; }
      resolve(new File([blob], fileName, { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.95);
  });
}
