// Week 3 — Edit post page
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { usePost } from '../../hooks/usePosts';
import { postsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import PostForm from '../../components/posts/PostForm';
import { PageLoader } from '../../components/common/Spinner';
import toast from 'react-hot-toast';

export default function EditPostPage() {
  const { id }        = useParams();
  const { dbUser }    = useAuth();
  const navigate      = useNavigate();
  const { post, loading, error } = usePost(id);
  const [saving, setSaving] = useState(false);

  if (loading) return <PageLoader />;
  if (!post || post.author?._id?.toString() !== dbUser?._id) {
    return <div className="text-center py-20 text-red-400">Not authorized to edit this post.</div>;
  }

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      await postsAPI.update(id, formData);
      toast.success('Post updated!');
      navigate(`/posts/${id}`);
    } catch (err) {
      toast.error(err.message);
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">✏️ Edit Post</h1>
      <PostForm initialData={post} onSubmit={handleSubmit} submitting={saving} />
    </div>
  );
}
