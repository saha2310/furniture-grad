'use client';
import { useContactModal } from '@/lib/contact-modal-context';

export function ContactSellerButton() {
  const { open } = useContactModal();

  return (
    <button
      onClick={open}
      className="w-full md:w-auto px-10 py-4 bg-[#e67e22] text-white rounded-full font-bold text-lg hover:bg-[#d35400] [@media(hover:hover)]:hover:scale-105 transition-all shadow-[0_4px_15px_rgba(230,126,34,0.3)]"
    >
      💬 Связаться с продавцом
    </button>
  );
}
