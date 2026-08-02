'use client';
import { useRef, useState } from 'react';

export function GalleryUploadField({ name = 'gallery_files' }: { name?: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  return (
    <div>
      <label className="text-sm text-[#7f8c8d] block mb-1">Дополнительные фото (необязательно)</label>
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        multiple
        onChange={onChange}
        className="w-full text-sm"
      />
      {previews.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {previews.map((src, i) => (
            <img key={i} src={src} alt="" className="w-14 h-14 object-cover rounded-lg border border-[#ddd]" />
          ))}
        </div>
      )}
    </div>
  );
}
