import { getCategoryById } from '../../utils/constants';

export default function CategoryBadge({ category, size = 'sm' }) {
  const cat = getCategoryById(category);
  if (!cat) return null;
  const p = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3.5 py-1.5 text-sm';
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border
      ${p} ${cat.bg} ${cat.text} ${cat.border}`}>
      {cat.icon} {cat.label}
    </span>
  );
}
