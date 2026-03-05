// Week 7 — Saved posts page
import { useState, useEffect } from 'react';
import { usersAPI } from '../../services/api';
import PostCard from '../../components/posts/PostCard';
import { PageLoader } from '../../components/common/Spinner';

export default function SavedPostsPage() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersAPI.getSaved()
      .then(({ data }) => setPosts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">❤️ Saved Posts ({posts.length})</h1>
      {posts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🤍</div>
          <p className="text-gray-500">No saved posts yet — tap 🤍 on any listing to save it.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map(post => <PostCard key={post._id} post={post} />)}
        </div>
      )}
    </div>
  );
}
