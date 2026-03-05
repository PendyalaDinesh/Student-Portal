// Week 8 — My listings management page
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usersAPI } from '../../services/api';
import PostCard from '../../components/posts/PostCard';
import { PageLoader } from '../../components/common/Spinner';
import { CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function MyPostsPage() {
  const [posts,     setPosts]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [category,  setCategory]  = useState('');

  useEffect(() => {
    setLoading(true);
    usersAPI.getMyPosts({ category })
      .then(({ data }) => setPosts(data))
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [category]);

  const handleToggle = async (postId) => {
    try {
      const { data } = await usersAPI.toggleActive(postId);
      setPosts(p => p.map(post => post._id === postId ? { ...post, isActive: data.isActive } : post));
    } catch (err) { toast.error(err.message); }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Link to="/posts/new" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl transition-all">
          + New Post
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        <button onClick={() => setCategory('')}
          className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all
            ${!category ? 'bg-sky-600 border-sky-600 text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
          All
        </button>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)}
            className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all
              ${category === c.id ? `${c.bg} ${c.text} ${c.border}` : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-gray-500 mb-4">No listings yet</p>
          <Link to="/posts/new" className="text-sky-400 hover:text-sky-300 font-medium">Create your first post →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post._id} className={`bg-gray-900 border rounded-2xl p-4 flex items-center gap-4
              ${post.isActive ? 'border-gray-800' : 'border-gray-800 opacity-60'}`}>
              {post.images?.[0] && (
                <img src={post.images[0].url} alt="" className="w-20 h-16 object-cover rounded-xl shrink-0"/>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{post.title}</h3>
                <p className="text-xs text-gray-500">{post.category} · {post.views} views</p>
                {!post.isActive && <span className="text-xs text-amber-400">⚠ Inactive</span>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleToggle(post._id)}
                  className="text-xs px-3 py-1.5 border border-gray-600 hover:border-gray-400 rounded-lg text-gray-400 hover:text-white transition-all">
                  {post.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <Link to={`/posts/${post._id}/edit`}
                  className="text-xs px-3 py-1.5 border border-gray-600 hover:border-gray-400 rounded-lg text-gray-400 hover:text-white transition-all">
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
