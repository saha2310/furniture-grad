'use client';
import { useState } from 'react';

const PREVIEW_LENGTH = 100;

export function ProductDescription({ text }: { text: string | null }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > PREVIEW_LENGTH;
  const preview = text.slice(0, PREVIEW_LENGTH).trimEnd();

  return (
    <p className="text-[#7f8c8d] mb-6 leading-relaxed break-words">
      {expanded || !isLong ? text : `${preview}…`}
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="ml-2 text-[#e67e22] font-semibold hover:text-[#d35400] transition-colors whitespace-nowrap"
        >
          {expanded ? '(свернуть)' : '(читать далее)'}
        </button>
      )}
    </p>
  );
}
