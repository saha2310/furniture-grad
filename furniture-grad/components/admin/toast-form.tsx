'use client';
import { useTransition, type ReactNode } from 'react';
import { useToast } from '@/lib/toast-context';

export function ToastForm({
  action,
  toastLabel,
  className,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  toastLabel: string;
  className?: string;
  children: ReactNode;
}) {
  const { runWithToast } = useToast();
  const [, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(() => {
      runWithToast(toastLabel, () => action(formData));
    });
  };

  return (
    <form action={handleSubmit} className={className}>
      {children}
    </form>
  );
}
