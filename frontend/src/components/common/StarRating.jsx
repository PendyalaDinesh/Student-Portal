// Week 8 — Star rating display & input
export default function StarRating({ value = 0, max = 5, onChange, size = 'md' }) {
  const sizes = { sm: 'text-base', md: 'text-xl', lg: 'text-3xl' };
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => i + 1).map(n => (
        <button key={n} type="button"
          className={`transition-transform hover:scale-110 ${sizes[size]}
            ${n <= value ? 'text-yellow-400' : 'text-gray-600'}
            ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
          onClick={() => onChange?.(n)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
