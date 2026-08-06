'use client';
import { useState } from 'react';
import { Product } from '@/lib/types';

const PREVIEW_LENGTH = 160;

function buildBullets(product: Product): string[] {
  const bullets: string[] = [];
  if (product.size) bullets.push(`Размер: ${product.size}`);
  if (product.material) bullets.push(`Материал: ${product.material}`);
  if (product.colors) bullets.push(`Цвет: ${product.colors.name}`);
  return bullets;
}

export function ProductDetailsSection({ product }: { product: Product }) {
  const [sectionOpen, setSectionOpen] = useState(true);
  const [textExpanded, setTextExpanded] = useState(false);

  const text = product.description;
  const bullets = buildBullets(product);

  if (!text && bullets.length === 0) return null;

  const isLong = !!text && text.length > PREVIEW_LENGTH;
  const preview = text ? text.slice(0, PREVIEW_LENGTH).trimEnd() : '';

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
          {text && (
            <p className="text-[#7f8c8d] leading-relaxed break-words mb-4">
              {textExpanded || !isLong ? text : `${preview}…`}
            </p>
          )}

          {bullets.length > 0 && (
            <ul className="mb-4 space-y-1.5">
              {bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#444]">
                  <span className="text-[#e67e22] mt-1.5 w-1.5 h-1.5 rounded-full bg-[#e67e22] shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          )}

          {isLong && (
            <button
              type="button"
              onClick={() => setTextExpanded(e => !e)}
              className="text-[#e67e22] font-semibold hover:text-[#d35400] transition-colors"
            >
              {textExpanded ? 'Свернуть' : 'Читать полностью'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
