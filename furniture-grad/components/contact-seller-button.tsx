'use client';
import { useContactModal } from '@/lib/contact-modal-context';

export function ContactSellerButton() {
  const { open } = useContactModal();

  return (
    <button
      onClick={open}
      className="flex-1 min-w-0 md:flex-initial w-full md:w-auto px-6 py-3 md:px-10 md:py-4 bg-[#e67e22] text-white rounded-full font-bold text-base md:text-lg hover:bg-[#d35400] [@media(hover:hover)]:hover:scale-105 transition-all shadow-[0_4px_15px_rgba(230,126,34,0.3)] whitespace-nowrap overflow-hidden text-ellipsis"
    >
      💬 <span className="max-md:hidden">Связаться с продавцом</span>
      <span className="hidden max-md:inline">Связаться</span>
    </button>
  );
}
