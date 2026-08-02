'use client';
import { useRef, useState } from 'react';
import { resizeImageFile } from '@/lib/crop-image';

const MAX_FILES = 20;

export function GalleryUploadField({ name = 'gallery_files' }: { name?: string }) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    if (picked.length === 0) return;

    const overLimit = picked.length > MAX_FILES;
    const files = picked.slice(0, MAX_FILES);
    setNotice(overLimit ? `Можно загрузить не больше ${MAX_FILES} фото — взяты первые ${MAX_FILES}.` : null);

    setIsProcessing(true);
    try {
      const resized = await Promise.all(files.map(f => resizeImageFile(f)));
      const dt = new DataTransfer();
      resized.forEach(f => dt.items.add(f));
      if (submitRef.current) submitRef.current.files = dt.files;
      setPreviews(resized.map(f => URL.createObjectURL(f)));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <label className="text-sm text-[#7f8c8d] block mb-1">
        Дополнительные фото (необязательно, до {MAX_FILES})
      </label>

      <input ref={pickerRef} type="file" accept="image/*" multiple onChange={onPick} className="hidden" />
      <input ref={submitRef} type="file" name={name} multiple className="hidden" />

      <button
        type="button"
        onClick={() => pickerRef.current?.click()}
        disabled={isProcessing}
        className="px-4 py-2 text-sm border-2 border-[#b5b5b5] rounded-lg hover:border-[#e67e22] hover:text-[#e67e22] transition-colors disabled:opacity-50"
      >
        {isProcessing ? 'Обработка фото…' : previews.length > 0 ? 'Заменить набор фото' : 'Выбрать фото'}
      </button>

      {notice && <p className="text-xs text-[#e67e22] mt-1">{notice}</p>}

      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {previews.map((src, i) => (
            <img key={i} src={src} alt="" className="w-14 h-14 object-cover rounded-lg border border-[#b5b5b5]" />
          ))}
        </div>
      )}
    </div>
  );
}
