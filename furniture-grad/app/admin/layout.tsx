import Link from 'next/link';
import { getAiUsageStatus } from '@/actions/ai-image';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { used, limit, remaining } = await getAiUsageStatus();
  const isLow = remaining === 0;

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <div className="bg-[#2c3e50] text-white px-4 md:px-8 py-4 flex gap-6 items-center overflow-x-auto whitespace-nowrap scrollbar-hide">
        <Link href="/admin/products" className="hover:text-[#e67e22] shrink-0">Товары</Link>
        <Link href="/admin/categories" className="hover:text-[#e67e22] shrink-0">Категории</Link>
        <Link href="/admin/colors" className="hover:text-[#e67e22] shrink-0">Цвета</Link>
        <Link href="/admin/settings" className="hover:text-[#e67e22] shrink-0">Настройки</Link>
        <span
          title={`Использовано сегодня: ${used} из ${limit}`}
          className={`shrink-0 text-xs px-2.5 py-1 rounded-full ${isLow ? 'bg-[#e74c3c] text-white' : 'bg-white/10 text-[#f0f0f0]'}`}
        >
          🖼️ {remaining}/{limit} обработок сегодня
        </span>
        <Link href="/" className="ml-auto hover:text-[#e67e22] shrink-0">← На сайт</Link>
      </div>
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">{children}</div>
    </div>
  );
}
