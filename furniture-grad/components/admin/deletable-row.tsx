'use client';
import { useState, type ReactNode } from 'react';
import { useToast } from '@/lib/toast-context';

// Не навязывает обёртку (важно для <tr> внутри таблицы — обёртка в <div>
// сломала бы вёрстку). Вызывающий сам применяет rowClassName к своему
// корневому элементу (tr, div — не важно).
export function DeletableRow({
  children,
  onDelete,
  toastLabel,
}: {
  children: (opts: { onDeleteClick: () => void; rowClassName: string }) => ReactNode;
  onDelete: () => Promise<void>;
  toastLabel: string;
}) {
  const { runWithToast } = useToast();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const onDeleteClick = () => {
    setIsRemoving(true);
    // Сначала мгновенная анимация исчезновения, и только потом реально
    // убираем элемент и обращаемся к серверу в фоне (с тостом в углу).
    setTimeout(() => {
      setIsHidden(true);
      runWithToast(toastLabel, onDelete).then(success => {
        // Если удаление на сервере не удалось (RLS, сеть, не применённая
        // миграция) — возвращаем строку обратно, а не оставляем её пропавшей
        // только на экране, пока данные в базе всё ещё есть.
        if (!success) {
          setIsHidden(false);
          setIsRemoving(false);
        }
      });
    }, 200);
  };

  if (isHidden) return null;

  const rowClassName = `transition-all duration-200 ease-out ${
    isRemoving ? 'opacity-0 scale-[0.97]' : 'opacity-100 scale-100'
  }`;

  return <>{children({ onDeleteClick, rowClassName })}</>;
}
