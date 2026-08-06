'use client';
import { useRef, useState } from 'react';
import { resizeImageFile } from '@/lib/crop-image';

const MAX_FILES = 20;

interface StagedImage {
  key: string;
  file: File;
  url: string;
}

export function GalleryUploadField({ name = 'gallery_files' }: { name?: string }) {
  const pickerRef = useRef<HTMLInputElement>(null);
  const submitRef = useRef<HTMLInputElement>(null);
  const [staged, setStaged] = useState<StagedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const syncSubmitInput = (items: StagedImage[]) => {
    const dt = new DataTransfer();
    items.forEach(item => dt.items.add(item.file));
    if (submitRef.current) submitRef.current.files = dt.files;
  };

  const onPick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    if (picked.length === 0) return;

    const freeSlots = MAX_FILES - staged.length;
    if (freeSlots <= 0) {
      setNotice(`Уже выбрано максимум ${MAX_FILES} фото — сначала удалите лишние.`);
      return;
    }
    const overLimit = picked.length > freeSlots;
    const files = picked.slice(0, freeSlots);

    setIsProcessing(true);
    try {
      // Обрабатываем каждый файл независимо — если один не получится
      // (например, HEIC с iPhone), остальные всё равно загрузятся.
      const results = await Promise.allSettled(files.map(f => resizeImageFile(f)));
      const succeeded: File[] = [];
      let failedCount = 0;
      results.forEach(r => {
        if (r.status === 'fulfilled') succeeded.push(r.value);
        else failedCount++;
      });

      const newItems: StagedImage[] = succeeded.map(file => ({
        key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        url: URL.createObjectURL(file),
      }));

      setStaged(prev => {
        const next = [...prev, ...newItems];
        syncSubmitInput(next);
        return next;
      });

      const messages: string[] = [];
      if (overLimit) messages.push(`Можно выбрать не больше ${MAX_FILES} фото — взяты первые ${freeSlots}.`);
      if (failedCount > 0) messages.push(`Не удалось обработать ${failedCount} фото — возможно, неподдерживаемый формат (например HEIC с iPhone). Остальные загружены.`);
      setNotice(messages.length > 0 ? messages.join(' ') : null);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeStaged = (key: string) => {
    setStaged(prev => {
      const next = prev.filter(item => item.key !== key);
      syncSubmitInput(next);
      return next;
    });
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
        {isProcessing ? 'Обработка фото…' : 'Добавить фото'}
      </button>

      {notice && <p className="text-xs text-[#e67e22] mt-1">{notice}</p>}

      {staged.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {staged.map(item => (
            <div key={item.key} className="relative group">
              <img src={item.url} alt="" className="w-14 h-14 object-cover rounded-lg border border-[#b5b5b5]" />
              <button
                type="button"
                onClick={() => removeStaged(item.key)}
                aria-label="Убрать фото"
                className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full shadow-md text-red-500 text-xs leading-none border border-[#ddd] opacity-80 group-hover:opacity-100 hover:bg-red-50 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
