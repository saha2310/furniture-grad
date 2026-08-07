import { cn } from '@/lib/utils';
export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn('w-full px-3 py-2 border-2 border-[#b5b5b5] rounded-lg text-sm outline-none focus:border-[#e67e22] transition-colors', className)} {...props} />;
}
