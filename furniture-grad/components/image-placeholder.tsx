export function ImagePlaceholder({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-[#e8e8e0] flex items-center justify-center text-[#9a9a90] text-sm ${className}`}>
      Нет фото
    </div>
  );
}
