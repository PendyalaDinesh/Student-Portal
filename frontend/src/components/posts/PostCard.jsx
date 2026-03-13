// PostCard — narrower, cleaner, fixed width cards
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { timeAgo, getPostPrice, getPostBadgeInfo } from '../../utils/helpers';
import { getCategoryById } from '../../utils/constants';
import { postsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import CategoryBadge from '../common/CategoryBadge';
import toast from 'react-hot-toast';

export function PostCardSkeleton() {
  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="skeleton h-40" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <div className="skeleton h-6 w-6 rounded-full" />
            <div className="skeleton h-3 w-16" />
          </div>
          <div className="skeleton h-4 w-14" />
        </div>
      </div>
    </div>
  );
}

export default function PostCard({ post }) {
  const { isLoggedIn, dbUser } = useAuth();
  const cat   = getCategoryById(post.category);
  const price = getPostPrice(post);
  const badge = getPostBadgeInfo(post);

  const [saved,     setSaved]     = useState(() => post.savedBy?.some(id => id === dbUser?._id) ?? false);
  const [saveCount, setSaveCount] = useState(post.savedBy?.length ?? 0);
  const [saving,    setSaving]    = useState(false);

  const handleSave = async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!isLoggedIn) { toast.error('Please log in to save posts'); return; }
    setSaving(true);
    try {
      const { data } = await postsAPI.toggleSave(post._id);
      setSaved(data.saved); setSaveCount(data.savedCount);
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  return (
    <Link to={`/posts/${post._id}`} className="group block">
      <article className="h-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden
        hover:border-gray-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30
        transition-all duration-200">

        {/* Image — shorter height */}
        <div className="relative h-40 bg-gray-800 overflow-hidden">
          {post.images?.[0] ? (
            <img src={post.images[0].url} alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl opacity-10">{cat?.icon}</div>
          )}
          <div className="absolute top-2 left-2">
            <CategoryBadge category={post.category} />
          </div>
          <button onClick={handleSave} disabled={saving}
            className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full
              bg-black/50 backdrop-blur-sm text-sm hover:bg-black/70 transition-all">
            {saved ? '❤️' : '🤍'}
          </button>
        </div>

        {/* Content — tighter padding */}
        <div className="p-3 flex flex-col gap-1.5">
          <h3 className="font-semibold text-white text-sm line-clamp-2 leading-snug">{post.title}</h3>

          {badge && <p className={`text-xs font-medium ${cat?.text}`}>{badge}</p>}

          {post.location && (
            <p className="text-xs text-gray-500 flex items-center gap-1 truncate">
              <span>📍</span> {post.location}
            </p>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-1.5 border-t border-gray-800 mt-0.5">
            <div className="flex items-center gap-1.5">
              <Avatar user={post.author} size={22} />
              <span className="text-xs text-gray-500 truncate max-w-[80px]">{post.author?.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {post.avgRating > 0 && <span className="text-xs text-yellow-400">★{post.avgRating}</span>}
              {price
                ? <span className={`text-sm font-bold ${cat?.text}`}>{price}</span>
                : <span className="text-xs text-gray-600">{timeAgo(post.createdAt)}</span>
              }
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
