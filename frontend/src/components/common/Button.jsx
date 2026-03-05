// Reusable Button component
const variants = {
  primary:   'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-900/30',
  secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
  outline:   'border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white',
  ghost:     'hover:bg-gray-800 text-gray-400 hover:text-white',
  danger:    'bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/30',
};
const sizes = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

export default function Button({
  children, variant = 'primary', size = 'md',
  loading = false, className = '', disabled, ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-semibold rounded-xl transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      )}
      {children}
    </button>
  );
}
