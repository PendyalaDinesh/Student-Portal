// Week 8 — User profile (view & edit own profile)
import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usersAPI, authAPI } from '../../services/api';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import PostCard from '../../components/posts/PostCard';
import { PageLoader } from '../../components/common/Spinner';
import { timeAgo } from '../../utils/helpers';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { id }          = useParams();
  const { dbUser, refreshDbUser } = useAuth();
  const isOwnProfile    = !id || id === dbUser?._id;

  const [profile,  setProfile]  = useState(null);
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [form,     setForm]     = useState({});
  const avatarRef = useRef();

  useEffect(() => {
    const userId = id || dbUser?._id;
    if (!userId) return;
    setLoading(true);
    usersAPI.getProfile(userId)
      .then(({ data }) => {
        setProfile(data.user);
        setPosts(data.posts);
        setForm({
          name: data.user.name, bio: data.user.bio,
          university: data.user.university, country: data.user.country,
        });
      })
      .catch(err => toast.error(err.message))
      .finally(() => setLoading(false));
  }, [id, dbUser?._id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (avatarRef.current?.files[0]) fd.append('avatar', avatarRef.current.files[0]);
      await authAPI.updateProfile(fd);
      await refreshDbUser();
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <PageLoader />;
  if (!profile) return <div className="text-center py-20 text-gray-500">Profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* Profile card */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        {editing ? (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Edit Profile</h2>

            {/* Avatar upload */}
            <div className="flex items-center gap-4">
              <Avatar user={isOwnProfile ? dbUser : profile} size={72} />
              <div>
                <input type="file" accept="image/*" ref={avatarRef} className="hidden"
                  onChange={e => e.target.files[0] && toast('New photo ready to save')} />
                <Button variant="outline" size="sm" onClick={() => avatarRef.current?.click()}>
                  Change Photo
                </Button>
              </div>
            </div>

            <Input label="Name" value={form.name || ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            <Input label="University" placeholder="Your university" value={form.university || ''} onChange={e => setForm(p => ({ ...p, university: e.target.value }))} />
            <Input label="Country" placeholder="Your country" value={form.country || ''} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-300">Bio</label>
              <textarea rows={3} placeholder="Tell others about yourself..."
                value={form.bio || ''} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                className="form-input resize-none" maxLength={500} />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              <Button loading={saving} onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-6">
            <Avatar user={profile} size={80} />
            <div className="flex-1">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-2xl font-bold">{profile.name}</h1>
                  {profile.university && <p className="text-sky-400 text-sm mt-1">🎓 {profile.university}</p>}
                  {profile.country    && <p className="text-gray-400 text-sm">🌍 {profile.country}</p>}
                  <p className="text-gray-500 text-xs mt-1">Member since {timeAgo(profile.createdAt)}</p>
                </div>
                {isOwnProfile && (
                  <Button variant="outline" size="sm" onClick={() => setEditing(true)}>✏️ Edit Profile</Button>
                )}
              </div>
              {profile.bio && <p className="text-gray-300 mt-3 leading-relaxed">{profile.bio}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Posts */}
      <div>
        <h2 className="text-xl font-bold mb-5">
          {isOwnProfile ? 'My Listings' : `${profile.name}'s Listings`} ({posts.length})
        </h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map(p => <PostCard key={p._id} post={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
