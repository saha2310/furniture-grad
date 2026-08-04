'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Category, Color } from '@/lib/types';

export function CatalogFilters({ categories, colors }: { categories: Category[]; colors: Color[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Локальная копия параметров — обновляется МГНОВЕННО по клику,
  // а сама навигация/поиск товаров идёт в фоне (startTransition),
  // поэтому галочка больше не "подвисает" в ожидании сервера.
  const [params, setParams] = useState(() => new URLSearchParams(searchParams.toString()));
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setParams(new URLSearchParams(searchParams.toString()));
  }, [searchParams]);

  const navigate = (next: URLSearchParams) => {
    setParams(next);
    startTransition(() => {
      router.push(`/catalog?${next.toString()}`);
    });
  };

  const toggleParam = (name: string, value: string) => {
    const current = params.getAll(name);
    const next = new URLSearchParams(params.toString());
    next.delete(name);
    if (current.includes(value)) {
      current.filter(v => v !== value).forEach(v => next.append(name, v));
    } else {
      current.forEach(v => next.append(name, v));
      next.append(name, value);
    }
    navigate(next);
  };

  const isChecked = (name: string, value: string) => params.getAll(name).includes(value);

  const setRange = (name: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(name, value);
    else next.delete(name);
    navigate(next);
  };

  const toggleDiscount = () => {
    const next = new URLSearchParams(params.toString());
    if (next.has('discount')) next.delete('discount');
    else next.set('discount', '1');
    navigate(next);
  };

  const reset = () => navigate(new URLSearchParams());

  return (
    <>
      {/* Кнопка-триггер фильтров — видна только на мобильном */}
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="md:hidden w-full flex items-center justify-center gap-2 bg-white border border-[#eee] rounded-xl py-3 mb-4 font-semibold text-[#2c3e50] shadow-sm"
      >
        ☰ Фильтры
      </button>

      {/* Затемнение фона под выезжающей панелью на мобильном */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[999] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static top-0 bottom-0 left-0 md:left-auto w-[85%] max-w-[340px] md:w-[280px] shrink-0 z-[1000] md:z-auto transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="bg-white p-6 h-full md:h-auto overflow-y-auto rounded-none md:rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] md:sticky md:top-24">
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h3 className="text-lg font-bold text-[#2c3e50]">Фильтры</h3>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Закрыть"
              className="w-10 h-10 flex items-center justify-center text-3xl text-[#95a5a6] hover:text-[#e74c3c] transition-colors"
            >
              ×
            </button>
          </div>

        <div className="mb-6 pb-5 border-b border-[#eee]">
          <h3 className="text-lg font-bold text-[#2c3e50] mb-4">🏷️ Категории</h3>
          {categories.map(cat => (
            <Checkbox
              key={cat.id}
              label={cat.name}
              checked={isChecked('category', cat.id)}
              onChange={() => toggleParam('category', cat.id)}
            />
          ))}
        </div>

        <div className="mb-6 pb-5 border-b border-[#eee]">
          <h3 className="text-lg font-bold text-[#2c3e50] mb-4">💰 Цена</h3>
          <div className="flex gap-2.5 items-center">
            <Input
              type="number"
              placeholder="От"
              className="w-full"
              defaultValue={params.get('min') || ''}
              onChange={e => setRange('min', e.target.value)}
            />
            <span className="text-[#95a5a6]">—</span>
            <Input
              type="number"
              placeholder="До"
              className="w-full"
              defaultValue={params.get('max') || ''}
              onChange={e => setRange('max', e.target.value)}
            />
          </div>
        </div>

        {colors.length > 0 && (
          <div className="mb-6 pb-5 border-b border-[#eee]">
            <h3 className="text-lg font-bold text-[#2c3e50] mb-4">🎨 Цвет</h3>
            {colors.map(c => (
              <label key={c.id} className="flex items-center gap-2 py-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isChecked('color', c.id)}
                  onChange={() => toggleParam('color', c.id)}
                  className="accent-[#e67e22]"
                />
                <span
                  className="w-4 h-4 rounded-full border border-[#999] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.15)] shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-sm text-[#444]">{c.name}</span>
              </label>
            ))}
          </div>
        )}

        <div className="mb-6 pb-5 border-b border-[#eee]">
          <h3 className="text-lg font-bold text-[#2c3e50] mb-4">⭐ Скидки</h3>
          <Checkbox
            label="Только со скидкой"
            checked={params.has('discount')}
            onChange={toggleDiscount}
          />
        </div>

        {isPending && (
          <div className="mb-4 text-sm text-[#e67e22] flex items-center gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-[#e67e22] border-t-transparent animate-spin" />
            Обновляем список…
          </div>
        )}

          <Button variant="secondary" className="w-full" onClick={reset}>
            Сбросить фильтры
          </Button>
        </div>
      </aside>
    </>
  );
}
