'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';

interface ToastItem {
  id: number;
  message: string;
  done: boolean;
  failed: boolean;
}

const ToastContext = createContext<{
  runWithToast: (message: string, action: () => Promise<void>) => Promise<void>;
} | null>(null);

let nextId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const runWithToast = async (message: string, action: () => Promise<void>) => {
    const id = ++nextId;
    setToasts(prev => [...prev, { id, message, done: false, failed: false }]);
    try {
      await action();
      setToasts(prev => prev.map(t => (t.id === id ? { ...t, done: true } : t)));
    } catch (err) {
      console.error(err);
      setToasts(prev => prev.map(t => (t.id === id ? { ...t, done: true, failed: true } : t)));
    } finally {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 1200);
    }
  };

  return (
    <ToastContext.Provider value={{ runWithToast }}>
      {children}
      <div className="fixed bottom-4 right-4 left-4 md:left-auto z-[2000] flex flex-col gap-2 items-end">
        {toasts.map(t => (
          <div
            key={t.id}
            className="bg-[#2c3e50] text-white rounded-xl shadow-lg px-4 py-3 w-full md:w-[280px] overflow-hidden animate-[toast-in_0.2s_ease]"
          >
            <div className="text-sm mb-2">
              {t.failed ? '⚠ Не получилось: ' : t.done ? '✓ ' : ''}
              {t.message}
            </div>
            <div className="h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${t.failed ? 'bg-red-400 w-full' : t.done ? 'bg-[#4caf50] w-full' : 'bg-[#e67e22] animate-[toast-progress_1.1s_ease-in-out_infinite]'}`}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast должен использоваться внутри ToastProvider');
  return ctx;
}
