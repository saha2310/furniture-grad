'use client';
import { useState } from 'react';
import { AI_TEMPLATES } from '@/lib/ai-templates';
import { processProductImage } from '@/actions/ai-image';

function base64ToFile(base64: string, mimeType: string, filename: string): File {
  const bytes = atob(base64);
  const arr = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new File([arr], filename, { type: mimeType });
}

export function AiEditModal({
  sourceFile,
  onApply,
  onClose,
}: {
  sourceFile: File;
  onApply: (file: File) => void;
  onClose: () => void;
}) {
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewUrl = URL.createObjectURL(sourceFile);

  const runTemplate = async (templateId: string | null) => {
    setError(null);
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.set('image', sourceFile);
      if (templateId) formData.set('templateId', templateId);
      if (!templateId) formData.set('customPrompt', customPrompt.trim());

      const result = await processProductImage(formData);

      if (!result.ok || !result.imageBase64) {
        setError(result.error || 'Не удалось обработать фото — попробуйте ещё раз.');
        return;
      }

      const file = base64ToFile(result.imageBase64, result.mimeType || 'image/png', 'ai-result.png');
      onApply(file);
    } catch {
      setError('Не удалось связаться с сервером — проверьте соединение и попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[1100] flex items-center justify-center p-6"
      onClick={() => !isLoading && onClose()}
    >
      <div
        className="bg-white rounded-2xl overflow-hidden w-full max-w-[480px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#eee] flex justify-between items-center">
          <h3 className="font-bold text-[#2c3e50]">✨ Обработать фото нейросетью</h3>
          {!isLoading && (
            <button type="button" onClick={onClose} aria-label="Закрыть" className="text-2xl text-[#95a5a6] hover:text-[#e74c3c] w-8 h-8 flex items-center justify-center">×</button>
          )}
        </div>

        <div className="p-5">
          <img src={previewUrl} alt="" className="w-full h-40 object-contain bg-[#f0f0f0] rounded-lg mb-4" />

          {isLoading ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span className="w-8 h-8 rounded-full border-4 border-[#e67e22] border-t-transparent animate-spin" />
              <p className="text-sm font-semibold text-[#2c3e50]">Обрабатываем фото нейросетью…</p>
              <p className="text-xs text-[#e67e22]">Не закрывайте и не покидайте эту вкладку, пока идёт обработка.</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-[#fdecea] text-[#e74c3c] text-sm">{error}</div>
              )}

              <p className="text-sm text-[#7f8c8d] mb-2">Выберите готовый шаблон:</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {AI_TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => runTemplate(t.id)}
                    className="text-left p-3 border-2 border-[#b5b5b5] rounded-lg hover:border-[#e67e22] transition-colors"
                  >
                    <div className="text-lg mb-1">{t.icon}</div>
                    <div className="text-sm font-semibold text-[#2c3e50]">{t.label}</div>
                    <div className="text-xs text-[#95a5a6]">{t.description}</div>
                  </button>
                ))}
              </div>

              <p className="text-sm text-[#7f8c8d] mb-2">…или свой запрос:</p>
              <textarea
                value={customPrompt}
                onChange={e => setCustomPrompt(e.target.value)}
                placeholder="Например: сделай фон тёмно-зелёным"
                className="w-full px-3 py-2 border-2 border-[#b5b5b5] rounded-lg text-sm outline-none focus:border-[#e67e22] transition-colors mb-3"
                rows={2}
              />
              <button
                type="button"
                disabled={!customPrompt.trim()}
                onClick={() => runTemplate(null)}
                className="w-full px-4 py-2 text-sm rounded-full bg-[#2c3e50] text-white font-semibold disabled:opacity-40 hover:bg-[#1a252f] transition-colors"
              >
                Применить свой запрос
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
