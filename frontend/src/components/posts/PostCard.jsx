// Week 3 (basic), Week 4 (category), Week 5 (price display), Week 7 (save button)
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
      <div className="skeleton h-48" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="skeleton h-7 w-7 rounded-full" />
            <div className="skeleton h-3 w-20" />
          </div>
          <div className="skeleton h-4 w-16" />
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

  const [saved, setSaved] = useState(
    () => post.savedBy?.some(id => id === dbUser?._id) ?? false
  );
  const [saveCount, setSaveCount] = useState(post.savedBy?.length ?? 0);
  const [saving,    setSaving]    = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) { toast.error('Please log in to save posts'); return; }
    setSaving(true);
    try {
      const { data } = await postsAPI.toggleSave(post._id);
      setSaved(data.saved);
      setSaveCount(data.savedCount);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Link to={`/posts/${post._id}`} className="group block">
      <article className="h-full bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden
        hover:border-gray-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40
        transition-all duration-200">

        {/* Image */}
        <div className="relative h-48 bg-gray-800 overflow-hidden">
          {post.images?.[0] ? (
            <img src={post.images[0].url} alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl opacity-10">
              {cat?.icon}
            </div>
          )}

          {/* Category badge overlay */}
          <div className="absolute top-3 left-3">
            <CategoryBadge category={post.category} />
          </div>

          {/* Save button */}
          <button onClick={handleSave} disabled={saving}
            className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full
              bg-black/50 backdrop-blur-sm border border-white/10 text-xs text-white
              hover:bg-black/70 transition-all">
            <span>{saved ? '❤️' : '🤍'}</span>
            {saveCount > 0 && <span>{saveCount}</span>}
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2">
          <h3 className="font-semibold text-white line-clamp-2 leading-snug">{post.title}</h3>

          {badge && (
            <p className={`text-xs font-medium ${cat?.text}`}>{badge}</p>
          )}

          {post.location && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <span>📍</span> {post.location}
            </p>
          )}

          <p className="text-xs text-gray-400 line-clamp-2">{post.description}</p>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-800 mt-1">
            <div className="flex items-center gap-2">
              <Avatar user={post.author} size={26} />
              <span className="text-xs text-gray-500 truncate max-w-20">{post.author?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {post.avgRating > 0 && (
                <span className="text-xs text-yellow-400">★ {post.avgRating}</span>
              )}
              {price && (
                <span className={`text-sm font-bold ${cat?.text}`}>{price}</span>
              )}
              {!price && (
                <span className="text-xs text-gray-600">{timeAgo(post.createdAt)}</span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
