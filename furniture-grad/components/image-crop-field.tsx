'use client';
import { useState, useRef, useCallback } from 'react';
import Cropper, { type Area } from 'react-easy-crop';
import { getCroppedImageFile } from '@/lib/crop-image';
import { AiEditModal } from '@/components/ai-edit-modal';

export function ImageCropField({
  name,
  label = 'Изображение',
  aspect = 4 / 3,
  hint,
  defaultPreview,
  removable = false,
}: {
  name: string;
  label?: string;
  aspect?: number;
  hint?: string;
  defaultPreview?: string | null;
  removable?: boolean;
}) {
  const [rawSrc, setRawSrc] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(defaultPreview ?? null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const pickerRef = useRef<HTMLInputElement>(null);
  const hiddenSubmitRef = useRef<HTMLInputElement>(null);
  const removeFlagRef = useRef<HTMLInputElement>(null);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (removeFlagRef.current) removeFlagRef.current.checked = false;
    setRawSrc(URL.createObjectURL(file));
    setShowCropper(true);
    e.target.value = '';
  };

  const removeImage = () => {
    setPreview(null);
    if (hiddenSubmitRef.current) hiddenSubmitRef.current.files = new DataTransfer().files;
    if (removeFlagRef.current) removeFlagRef.current.checked = true;
  };

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const applyAiResult = (file: File) => {
    const dt = new DataTransfer();
    dt.items.add(file);
    if (hiddenSubmitRef.current) hiddenSubmitRef.current.files = dt.files;
    if (removeFlagRef.current) removeFlagRef.current.checked = false;
    setPreview(URL.createObjectURL(file));
    setShowAiModal(false);
  };

  const confirmCrop = async () => {
    if (!rawSrc || !croppedAreaPixels) return;
    const file = await getCroppedImageFile(rawSrc, croppedAreaPixels, `${name}.jpg`);
    const dt = new DataTransfer();
    dt.items.add(file);
    if (hiddenSubmitRef.current) hiddenSubmitRef.current.files = dt.files;
    if (removeFlagRef.current) removeFlagRef.current.checked = false;
    setPreview(URL.createObjectURL(file));
    setShowCropper(false);
  };

  return (
    <div>
      <label className="text-sm text-[#7f8c8d] block mb-1">{label}</label>
      {hint && <p className="text-xs text-[#95a5a6] mb-2">{hint}</p>}

      <input ref={pickerRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
      <input ref={hiddenSubmitRef} type="file" name={name} className="hidden" />
      {removable && <input ref={removeFlagRef} type="checkbox" name={`${name}_remove`} className="hidden" />}

      <div className="flex flex-wrap items-center gap-3">
        {preview && (
          <img src={preview} alt="" className="w-16 h-16 object-cover rounded-lg border border-[#b5b5b5] shrink-0" />
        )}
        <button
          type="button"
          onClick={() => pickerRef.current?.click()}
          className="px-4 py-2 text-sm border-2 border-[#b5b5b5] rounded-lg hover:border-[#e67e22] hover:text-[#e67e22] transition-colors"
        >
          {preview ? 'Заменить фото' : 'Выбрать фото'}
        </button>
        {removable && preview && (
          <button
            type="button"
            onClick={removeImage}
            className="px-4 py-2 text-sm border-2 border-[#b5b5b5] rounded-lg text-red-500 hover:border-red-500 transition-colors"
          >
            Удалить фото
          </button>
        )}
        {preview && (
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="px-4 py-2 text-sm border-2 border-[#e67e22] text-[#e67e22] rounded-lg hover:bg-[#e67e22] hover:text-white transition-colors"
          >
            🖼️ Обработать фон
          </button>
        )}
      </div>

      {showAiModal && hiddenSubmitRef.current?.files?.[0] && (
        <AiEditModal
          sourceFile={hiddenSubmitRef.current.files[0]}
          onApply={applyAiResult}
          onClose={() => setShowAiModal(false)}
        />
      )}

      {showCropper && rawSrc && (
        <div
          className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-6"
          onClick={() => setShowCropper(false)}
        >
          <div
            className="bg-white rounded-2xl overflow-hidden w-full max-w-[500px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-[350px] bg-[#222]">
              <Cropper
                image={rawSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="p-4 flex flex-col gap-3">
              <input
                type="range"
                min={1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                className="w-full accent-[#e67e22]"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCropper(false)}
                  className="px-5 py-2 rounded-full text-sm border-2 border-[#b5b5b5] hover:border-[#e74c3c] hover:text-[#e74c3c] transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  onClick={confirmCrop}
                  className="px-5 py-2 rounded-full text-sm bg-[#e67e22] text-white font-semibold hover:bg-[#d35400] transition-colors"
                >
                  Обрезать и сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
