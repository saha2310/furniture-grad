'use client';
import { useState } from 'react';
import { Product } from '@/lib/types';

const PREVIEW_LENGTH = 160;

export function ProductDetailsSection({ product }: { product: Product }) {
  const [sectionOpen, setSectionOpen] = useState(true);
  const [textExpanded, setTextExpanded] = useState(false);

  const text = product.description;

  if (!text) return null;

  const isLong = text.length > PREVIEW_LENGTH;
  const preview = text.slice(0, PREVIEW_LENGTH).trimEnd();

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-6 md:p-8">
      <button
        type="button"
        onClick={() => setSectionOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <h2 className="text-xl font-bold text-[#2c3e50]">Описание товара</h2>
        <span
          className={`shrink-0 text-[#95a5a6] transition-transform duration-200 ${
            sectionOpen ? 'rotate-180' : ''
          }`}
          aria-hidden
        >
          ⌄
        </span>
      </button>

      {sectionOpen && (
        <div className="mt-4">
          <p className="text-[#7f8c8d] leading-relaxed break-words">
            {textExpanded || !isLong ? text : `${preview}…`}
          </p>

          {isLong && (
            <button
              type="button"
              onClick={() => setTextExpanded(e => !e)}
              className="mt-2 text-[#e67e22] font-semibold hover:text-[#d35400] transition-colors"
            >
              {textExpanded ? 'Свернуть' : 'Читать полностью'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
