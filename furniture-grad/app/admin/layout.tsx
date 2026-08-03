import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <div className="bg-[#2c3e50] text-white px-4 md:px-8 py-4 flex gap-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <Link href="/admin/products" className="hover:text-[#e67e22] shrink-0">Товары</Link>
        <Link href="/admin/categories" className="hover:text-[#e67e22] shrink-0">Категории</Link>
        <Link href="/admin/colors" className="hover:text-[#e67e22] shrink-0">Цвета</Link>
        <Link href="/admin/settings" className="hover:text-[#e67e22] shrink-0">Настройки</Link>
        <Link href="/" className="ml-auto hover:text-[#e67e22] shrink-0">← На сайт</Link>
      </div>
      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">{children}</div>
    </div>
  );
}
