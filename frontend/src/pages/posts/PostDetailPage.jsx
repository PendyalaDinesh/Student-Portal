// Week 4 (view), Week 7 (save, contact), Week 8 (reviews)
import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { usePost } from '../../hooks/usePosts';
import { useAuth } from '../../context/AuthContext';
import { postsAPI, messagesAPI } from '../../services/api';
import { PageLoader } from '../../components/common/Spinner';
import Avatar from '../../components/common/Avatar';
import CategoryBadge from '../../components/common/CategoryBadge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import StarRating from '../../components/common/StarRating';
import { timeAgo, formatDate, formatCurrency, getPostPrice } from '../../utils/helpers';
import { getCategoryById } from '../../utils/constants';
import toast from 'react-hot-toast';

function DetailRow({ label, value }) {
  if (!value && value !== 0 && value !== false) return null;
  return (
    <div className="flex justify-between py-3 border-b border-gray-800 last:border-0">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white text-sm font-medium text-right max-w-48">{String(value)}</span>
    </div>
  );
}

export default function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, dbUser } = useAuth();
  const { post, setPost, loading, error } = usePost(id);

  const [msgModal,  setMsgModal]  = useState(false);
  const [msgText,   setMsgText]   = useState('');
  const [sending,   setSending]   = useState(false);
  const [deleting,  setDeleting]  = useState(false);
  const [imgIndex,  setImgIndex]  = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText,   setReviewText]   = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  if (loading) return <PageLoader />;
  if (error || !post) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="text-xl font-semibold text-gray-300 mb-4">{error || 'Post not found'}</h2>
      <Link to="/" className="text-sky-400 hover:text-sky-300">← Back to listings</Link>
    </div>
  );

  const cat      = getCategoryById(post.category);
  const isOwner  = dbUser?._id === post.author?._id?.toString();
  const isSaved  = post.savedBy?.some(id => id === dbUser?._id);
  const price    = getPostPrice(post);

  const handleToggleSave = async () => {
    if (!isLoggedIn) { toast.error('Please log in to save posts'); return; }
    try {
      const { data } = await postsAPI.toggleSave(post._id);
      setPost(p => ({
        ...p,
        savedBy: data.saved
          ? [...(p.savedBy || []), dbUser._id]
          : (p.savedBy || []).filter(id => id !== dbUser._id),
      }));
      toast.success(data.saved ? 'Saved!' : 'Removed from saved');
    } catch (err) { toast.error(err.message); }
  };

  const handleSendMessage = async () => {
    if (!msgText.trim()) return;
    setSending(true);
    try {
      await messagesAPI.send({ receiverId: post.author._id, text: msgText, postId: post._id });
      toast.success('Message sent!');
      setMsgModal(false);
      setMsgText('');
    } catch (err) { toast.error(err.message); }
    finally { setSending(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    setDeleting(true);
    try {
      await postsAPI.remove(post._id);
      toast.success('Post deleted');
      navigate('/');
    } catch (err) { toast.error(err.message); }
    finally { setDeleting(false); }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const { data } = await postsAPI.addReview(post._id, { rating: reviewRating, comment: reviewText });
      setPost(p => ({ ...p, reviews: data }));
      setShowReview(false);
      toast.success('Review added!');
    } catch (err) { toast.error(err.message); }
    finally { setSubmittingReview(false); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/" className="text-sky-400 hover:text-sky-300 text-sm flex items-center gap-1 mb-6 w-fit">
        ← Back to listings
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* ── Left: main content ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Image gallery */}
          {post.images?.length > 0 && (
            <div className="rounded-2xl overflow-hidden border border-gray-800">
              <img src={post.images[imgIndex].url} alt={post.title}
                className="w-full aspect-video object-cover" />
              {post.images.length > 1 && (
                <div className="flex gap-2 p-3 bg-gray-900">
                  {post.images.map((img, i) => (
                    <button key={i} onClick={() => setImgIndex(i)}
                      className={`h-14 w-20 rounded-lg overflow-hidden border-2 transition-all
                        ${i === imgIndex ? 'border-sky-500' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Title & meta */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <CategoryBadge category={post.category} />
              {price && <span className={`text-xl font-bold ${cat?.text}`}>{price}</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-snug">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
              {post.location && <span>📍 {post.location}</span>}
              <span>👁 {post.views} views</span>
              <span>🕐 {timeAgo(post.createdAt)}</span>
              {post.avgRating > 0 && <span className="text-yellow-400">★ {post.avgRating} ({post.reviews.length})</span>}
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="font-semibold mb-3">Description</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{post.description}</p>
          </div>

          {/* Category-specific details (Week 5) */}
          <div className={`rounded-2xl border p-6 ${cat?.bg} ${cat?.border}`}>
            <h2 className={`font-semibold mb-4 ${cat?.text}`}>{cat?.icon} {cat?.label} Details</h2>
            <div className="divide-y divide-gray-800/50">
              {/* Housing */}
              {post.category === 'housing' && (<>
                <DetailRow label="Property Type"  value={post.housing?.type} />
                <DetailRow label="Monthly Rent"   value={post.housing?.rent ? formatCurrency(post.housing.rent) + '/mo' : null} />
                <DetailRow label="Deposit"        value={post.housing?.deposit ? formatCurrency(post.housing.deposit) : null} />
                <DetailRow label="Bedrooms"       value={post.housing?.bedrooms} />
                <DetailRow label="Bathrooms"      value={post.housing?.bathrooms} />
                <DetailRow label="Available"      value={post.housing?.availableFrom ? formatDate(post.housing.availableFrom) : null} />
                <DetailRow label="Utilities"      value={post.housing?.utilities ? 'Included' : null} />
                <DetailRow label="Pet Friendly"   value={post.housing?.petFriendly ? 'Yes' : null} />
                <DetailRow label="Furnished"      value={post.housing?.furnished ? 'Yes' : null} />
              </>)}
              {/* Rides */}
              {post.category === 'rides' && (<>
                <DetailRow label="Route"     value={post.rides?.from && post.rides?.to ? `${post.rides.from} → ${post.rides.to}` : null} />
                <DetailRow label="Date"      value={post.rides?.departureDate ? formatDate(post.rides.departureDate) : null} />
                <DetailRow label="Time"      value={post.rides?.departureTime} />
                <DetailRow label="Seats"     value={post.rides?.seats} />
                <DetailRow label="Cost"      value={post.rides?.costPerPerson != null ? formatCurrency(post.rides.costPerPerson) + '/person' : null} />
                <DetailRow label="Recurring" value={post.rides?.recurring ? 'Weekly' : null} />
              </>)}
              {/* Jobs */}
              {post.category === 'jobs' && (<>
                <DetailRow label="Job Type"       value={post.jobs?.jobType} />
                <DetailRow label="Hours/Week"     value={post.jobs?.hoursPerWeek} />
                <DetailRow label="Pay Rate"       value={post.jobs?.payRate ? formatCurrency(post.jobs.payRate) + '/hr' : null} />
                <DetailRow label="Required Skills" value={post.jobs?.requiredSkills?.join(', ')} />
                <DetailRow label="Work Auth"      value={post.jobs?.workAuthRequired ? 'Required' : 'Not Required'} />
                <DetailRow label="Deadline"       value={post.jobs?.deadline ? formatDate(post.jobs.deadline) : null} />
              </>)}
              {/* Community */}
              {post.category === 'community' && (<>
                <DetailRow label="Sub-Category" value={post.community?.subCategory} />
                <DetailRow label="Price"        value={post.community?.price != null ? formatCurrency(post.community.price) : null} />
                <DetailRow label="Condition"    value={post.community?.condition} />
                <DetailRow label="Event Date"   value={post.community?.eventDate ? formatDate(post.community.eventDate) : null} />
                <DetailRow label="Negotiable"   value={post.community?.negotiable ? 'Yes' : null} />
              </>)}
            </div>
          </div>

          {/* Reviews (Week 8) */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Reviews ({post.reviews?.length || 0})</h2>
              {isLoggedIn && !isOwner && (
                <Button variant="outline" size="sm" onClick={() => setShowReview(!showReview)}>
                  + Write Review
                </Button>
              )}
            </div>
            {showReview && (
              <form onSubmit={handleAddReview} className="bg-gray-800 rounded-xl p-4 space-y-3">
                <StarRating value={reviewRating} onChange={setReviewRating} size="lg" />
                <textarea value={reviewText} onChange={e => setReviewText(e.target.value)}
                  placeholder="Share your experience..." rows={3} maxLength={500}
                  className="form-input resize-none" />
                <Button type="submit" size="sm" loading={submittingReview}>Submit Review</Button>
              </form>
            )}
            {post.reviews?.length === 0 && <p className="text-gray-500 text-sm">No reviews yet.</p>}
            {post.reviews?.map((rev, i) => (
              <div key={i} className="border-t border-gray-800 pt-4 flex gap-3">
                <Avatar user={rev.user} size={36} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{rev.user?.name}</span>
                    <StarRating value={rev.rating} size="sm" />
                  </div>
                  {rev.comment && <p className="text-gray-400 text-sm mt-1">{rev.comment}</p>}
                  <p className="text-gray-600 text-xs mt-1">{timeAgo(rev.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: sidebar ── */}
        <div className="space-y-4 lg:sticky lg:top-20 h-fit">

          {/* Author card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar user={post.author} size={52} />
              <div>
                <p className="font-semibold">{post.author?.name}</p>
                {post.author?.university && <p className="text-xs text-gray-400">{post.author.university}</p>}
                <p className="text-xs text-gray-500">Joined {formatDate(post.author?.createdAt, 'MMM yyyy')}</p>
              </div>
            </div>

            {isOwner ? (
              <div className="space-y-2">
                <Link to={`/posts/${post._id}/edit`}>
                  <Button variant="secondary" className="w-full">✏️ Edit Post</Button>
                </Link>
                <Button variant="danger" className="w-full" loading={deleting} onClick={handleDelete}>
                  🗑 Delete Post
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {isLoggedIn ? (
                  <Button className="w-full" onClick={() => setMsgModal(true)}>
                    💬 Send Message
                  </Button>
                ) : (
                  <Link to="/login">
                    <Button className="w-full">Log in to Contact</Button>
                  </Link>
                )}
                <Button variant="outline" className="w-full" onClick={handleToggleSave}>
                  {isSaved ? '❤️ Saved' : '🤍 Save Post'}
                </Button>
              </div>
            )}

            {post.author?.email && (
              <a href={`mailto:${post.author.email}`} className="block text-center text-sm text-sky-400 hover:text-sky-300">
                📧 {post.author.email}
              </a>
            )}
          </div>

          {/* Quick info */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-2 text-sm">
            <p className="text-gray-400">Posted {timeAgo(post.createdAt)}</p>
            <p className="text-gray-400">{post.views} views · {post.savedBy?.length || 0} saves</p>
          </div>
        </div>
      </div>

      {/* Message Modal (Week 7) */}
      <Modal open={msgModal} onClose={() => setMsgModal(false)} title={`Message ${post.author?.name}`}>
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-xl p-3 text-sm text-gray-400">
            Re: <span className="text-white">{post.title}</span>
          </div>
          <textarea
            value={msgText}
            onChange={e => setMsgText(e.target.value)}
            placeholder="Hi, I'm interested in your listing..."
            rows={5} maxLength={2000}
            className="form-input resize-none"
          />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setMsgModal(false)}>Cancel</Button>
            <Button className="flex-1" loading={sending} onClick={handleSendMessage} disabled={!msgText.trim()}>
              Send Message
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
