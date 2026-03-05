// Week 3 — Create post page
import { useNavigate } from 'react-router-dom';
import PostForm from '../../components/posts/PostForm';
import { postsAPI } from '../../services/api';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function CreatePostPage() {
  const navigate    = useNavigate();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (formData) => {
    setSaving(true);
    try {
      const { data } = await postsAPI.create(formData);
      toast.success('Post published!');
      navigate(`/posts/${data._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally { setSaving(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl font-bold mb-8">✏️ Create New Post</h1>
      <PostForm onSubmit={handleSubmit} submitting={saving} />
    </div>
  );
}
