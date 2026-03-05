/**
 * HomePage.jsx — Split screen layout
 * LEFT:  Live auto-sliding post carousel (all posts)
 * RIGHT: Category selector — clicking opens only that category's features
 */
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getCategoryById, CATEGORIES } from '../utils/constants';
import { timeAgo, getPostPrice } from '../utils/helpers';
import Avatar from '../components/common/Avatar';
import CategoryBadge from '../components/common/CategoryBadge';

// ── Dot indicator ─────────────────────────────────────────────
function Dots({ total, active, onDotClick }) {
  return (
    <div className="flex items-center gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className={`rounded-full transition-all duration-300
            ${i === active
              ? 'bg-white w-5 h-2'
              : 'bg-white/30 w-2 h-2 hover:bg-white/60'
            }`}
        />
      ))}
    </div>
  );
}

// ── Single slide card ─────────────────────────────────────────
function SlideCard({ post, active }) {
  const cat   = getCategoryById(post.category);
  const price = getPostPrice(post);
  return (
    <div className={`absolute inset-0 transition-all duration-700 ease-in-out
      ${active ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
      <div className="absolute inset-0">
        {post.images?.[0] ? (
          <img src={post.images[0].url} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-9xl ${cat?.bg || 'bg-gray-800'}`}>
            {cat?.icon}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-7">
        <CategoryBadge category={post.category} />
        <h2 className="text-2xl font-bold text-white mt-3 leading-tight line-clamp-2">{post.title}</h2>
        {post.location && (
          <p className="text-white/60 text-sm mt-1.5">📍 {post.location}</p>
        )}
        <p className="text-white/70 text-sm mt-2 line-clamp-2">{post.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Avatar user={post.author} size={30} />
            <span className="text-white/70 text-xs">{post.author?.name}</span>
            <span className="text-white/40 text-xs">· {timeAgo(post.createdAt)}</span>
          </div>
          {price && <span className={`text-lg font-bold ${cat?.text}`}>{price}</span>}
        </div>
        <Link to={`/posts/${post._id}`}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5
            bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20
            rounded-xl text-white text-sm font-medium transition-all">
          View Details →
        </Link>
      </div>
    </div>
  );
}

// ── Live Carousel ─────────────────────────────────────────────
function LiveCarousel({ posts }) {
  const [current, setCurrent] = useState(0);
  const [paused,  setPaused]  = useState(false);
  const intervalRef = useRef(null);

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % posts.length);
    }, 4000);
  };

  useEffect(() => {
    if (posts.length > 1 && !paused) startInterval();
    return () => clearInterval(intervalRef.current);
  }, [posts.length, paused]);

  const goTo = (i) => { setCurrent(i); startInterval(); };
  const prev = () => goTo((current - 1 + posts.length) % posts.length);
  const next = () => goTo((current + 1) % posts.length);

  if (!posts.length) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="text-center text-gray-500">
          <div className="text-5xl mb-3">📭</div>
          <p>No posts yet — be the first!</p>
          <Link to="/posts/new" className="mt-4 inline-block text-sky-400 hover:text-sky-300 text-sm">
            Create a post →
          </Link>
        </div>
      </div>
    );
  }

  const dotCount = Math.min(posts.length, 10);

  return (
    <div className="relative flex-1 bg-gray-950 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>

      {/* LIVE badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2
        bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-white text-xs font-semibold tracking-wider">LIVE</span>
        <span className="text-white/40 text-xs">{posts.length} posts</span>
      </div>

      {/* Slides */}
      <div className="relative w-full h-full">
        {posts.map((post, i) => (
          <SlideCard key={post._id} post={post} active={i === current} />
        ))}
      </div>

      {/* Arrows */}
      {posts.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full
              bg-black/40 hover:bg-black/70 backdrop-blur-sm border border-white/10 text-white
              flex items-center justify-center text-xl transition-all hover:scale-110">
            ‹
          </button>
          <button onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full
              bg-black/40 hover:bg-black/70 backdrop-blur-sm border border-white/10 text-white
              flex items-center justify-center text-xl transition-all hover:scale-110">
            ›
          </button>
        </>
      )}

      {/* Dots */}
      <div className="absolute bottom-36 left-0 right-0 z-20">
        <Dots total={dotCount} active={current % dotCount} onDotClick={goTo} />
      </div>

      {/* Progress bar */}
      {!paused && posts.length > 1 && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/10 w-full z-20">
          <div key={current} className="h-full bg-white/50"
            style={{ animation: 'slideProgress 4s linear forwards' }} />
        </div>
      )}

      <style>{`@keyframes slideProgress { from { width:0% } to { width:100% } }`}</style>
    </div>
  );
}

// ── Category feature panels ───────────────────────────────────
function HousingPanel({ navigate }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <p className="text-gray-400 text-sm">Find rooms, apartments and houses near your campus.</p>
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { icon: '🛏', label: 'Rooms',      desc: 'Single & shared',   type: 'Room' },
          { icon: '🏢', label: 'Apartments', desc: 'Full apartments',    type: 'Apartment' },
          { icon: '🏠', label: 'Houses',     desc: 'Full house rentals', type: 'House' },
          { icon: '🛋', label: 'Studios',    desc: 'Studio units',       type: 'Studio' },
        ].map(item => (
          <button key={item.label}
            onClick={() => navigate(`/?category=housing&search=${item.type}`)}
            className="p-4 bg-gray-800/60 hover:bg-blue-500/10 border border-gray-700
              hover:border-blue-500/40 rounded-xl text-left transition-all group">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-sm font-semibold text-white group-hover:text-blue-400">{item.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <Link to="/?category=housing"
          className="py-2.5 text-center bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all">
          Browse All
        </Link>
        <Link to="/posts/new"
          className="py-2.5 text-center border border-blue-500/40 hover:border-blue-400 text-blue-400 hover:text-blue-300 text-sm font-semibold rounded-xl transition-all">
          + Post Listing
        </Link>
      </div>
    </div>
  );
}

function RidesPanel({ navigate }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <p className="text-gray-400 text-sm">Share rides with students and split travel costs.</p>
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { icon: '🚗', label: 'Offer a Ride', desc: "You're driving",  q: '/posts/new' },
          { icon: '🙋', label: 'Need a Ride',  desc: 'Looking for one', q: '/?category=rides' },
          { icon: '🔁', label: 'Weekly Rides', desc: 'Recurring routes', q: '/?category=rides&search=weekly' },
          { icon: '✈️', label: 'Airport Runs', desc: 'To/from airport',  q: '/?category=rides&search=airport' },
        ].map(item => (
          <button key={item.label} onClick={() => navigate(item.q)}
            className="p-4 bg-gray-800/60 hover:bg-emerald-500/10 border border-gray-700
              hover:border-emerald-500/40 rounded-xl text-left transition-all group">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-sm font-semibold text-white group-hover:text-emerald-400">{item.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <Link to="/?category=rides"
          className="py-2.5 text-center bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all">
          Browse All
        </Link>
        <Link to="/posts/new"
          className="py-2.5 text-center border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 text-sm font-semibold rounded-xl transition-all">
          + Post Ride
        </Link>
      </div>
    </div>
  );
}

function JobsPanel({ navigate }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <p className="text-gray-400 text-sm">Student-friendly jobs — on campus, remote, and local.</p>
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { icon: '🏫', label: 'On-Campus', desc: 'University jobs', q: 'On-campus' },
          { icon: '💻', label: 'Remote',    desc: 'Work anywhere',    q: 'Remote' },
          { icon: '🏙', label: 'Off-Campus',desc: 'Local area jobs',  q: 'Off-campus' },
          { icon: '🔀', label: 'Hybrid',    desc: 'Mix of both',      q: 'Hybrid' },
        ].map(item => (
          <button key={item.label} onClick={() => navigate(`/?category=jobs&search=${item.q}`)}
            className="p-4 bg-gray-800/60 hover:bg-amber-500/10 border border-gray-700
              hover:border-amber-500/40 rounded-xl text-left transition-all group">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-sm font-semibold text-white group-hover:text-amber-400">{item.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <Link to="/?category=jobs"
          className="py-2.5 text-center bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl transition-all">
          Browse All
        </Link>
        <Link to="/posts/new"
          className="py-2.5 text-center border border-amber-500/40 hover:border-amber-400 text-amber-400 hover:text-amber-300 text-sm font-semibold rounded-xl transition-all">
          + Post Job
        </Link>
      </div>
    </div>
  );
}

function CommunityPanel({ navigate }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <p className="text-gray-400 text-sm">Buy, sell, events, Q&A and general campus posts.</p>
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { icon: '🛒', label: 'Buy / Sell', desc: 'Items & goods',    sub: 'Buy/Sell' },
          { icon: '🎉', label: 'Events',     desc: 'Campus events',    sub: 'Events' },
          { icon: '❓', label: 'Q&A',        desc: 'Ask the community', sub: 'Q&A' },
          { icon: '💬', label: 'General',    desc: 'Anything else',    sub: 'General' },
        ].map(item => (
          <button key={item.label} onClick={() => navigate(`/?category=community&search=${item.sub}`)}
            className="p-4 bg-gray-800/60 hover:bg-purple-500/10 border border-gray-700
              hover:border-purple-500/40 rounded-xl text-left transition-all group">
            <div className="text-2xl mb-1">{item.icon}</div>
            <div className="text-sm font-semibold text-white group-hover:text-purple-400">{item.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <Link to="/?category=community"
          className="py-2.5 text-center bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all">
          Browse All
        </Link>
        <Link to="/posts/new"
          className="py-2.5 text-center border border-purple-500/40 hover:border-purple-400 text-purple-400 hover:text-purple-300 text-sm font-semibold rounded-xl transition-all">
          + Post Here
        </Link>
      </div>
    </div>
  );
}

// ── Right Panel ───────────────────────────────────────────────
function RightPanel({ posts }) {
  const [active, setActive] = useState(null);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const cat = getCategoryById(active);

  const panels = {
    housing:   <HousingPanel   navigate={navigate} />,
    rides:     <RidesPanel     navigate={navigate} />,
    jobs:      <JobsPanel      navigate={navigate} />,
    community: <CommunityPanel navigate={navigate} />,
  };

  return (
    <div className="w-full lg:w-[400px] xl:w-[440px] shrink-0 flex flex-col
      bg-gray-950 border-t lg:border-t-0 lg:border-l border-gray-800 overflow-y-auto">

      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-800">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600
            flex items-center justify-center text-base shadow-lg">🎓</div>
          <div>
            <h1 className="font-bold text-base leading-tight">StudentHub</h1>
            <p className="text-gray-500 text-xs">Select a category to explore</p>
          </div>
        </div>
      </div>

      {/* 4 Category buttons */}
      <div className="px-4 py-4 grid grid-cols-2 gap-2 border-b border-gray-800">
        {CATEGORIES.map(c => {
          const count = posts.filter(p => p.category === c.id).length;
          return (
            <button key={c.id}
              onClick={() => setActive(active === c.id ? null : c.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2
                font-semibold text-sm transition-all text-left
                ${active === c.id
                  ? `${c.bg} ${c.text} border-current/50`
                  : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 bg-gray-900/40'
                }`}>
              <span className="text-2xl shrink-0">{c.icon}</span>
              <div>
                <div>{c.label}</div>
                <div className={`text-xs font-normal ${active === c.id ? 'opacity-70' : 'text-gray-600'}`}>
                  {count} post{count !== 1 ? 's' : ''}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Feature panel — only shows when a category is active */}
      <div className="flex-1 px-5 py-5">
        {active ? (
          <div>
            <div className={`flex items-center justify-between mb-4`}>
              <h2 className={`font-bold flex items-center gap-2 ${cat?.text}`}>
                {cat?.icon} {cat?.label} Features
              </h2>
              <button onClick={() => setActive(null)}
                className="w-6 h-6 flex items-center justify-center rounded-lg
                  text-gray-500 hover:text-white hover:bg-gray-700 transition-all text-lg">
                ×
              </button>
            </div>
            {panels[active]}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center pb-4">
            <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center text-3xl mb-4">
              👆
            </div>
            <p className="text-gray-400 font-medium text-sm mb-1">Pick a category</p>
            <p className="text-gray-600 text-xs">
              Each one opens its own set of features
            </p>

            {/* Mini stat strip */}
            <div className="mt-8 w-full grid grid-cols-2 gap-2">
              {CATEGORIES.map(c => {
                const count = posts.filter(p => p.category === c.id).length;
                return (
                  <button key={c.id} onClick={() => setActive(c.id)}
                    className={`p-3 rounded-xl border text-left hover:scale-[1.02] transition-transform
                      ${c.bg} ${c.border}`}>
                    <span className="text-lg">{c.icon}</span>
                    <div className={`text-xs font-bold mt-1 ${c.text}`}>{c.label}</div>
                    <div className="text-xs text-gray-500">{count} active</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-5 pb-5 pt-3 border-t border-gray-800 space-y-2">
        {isLoggedIn ? (
          <Link to="/posts/new"
            className="flex items-center justify-center gap-2 w-full py-3
              bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500
              text-white font-semibold rounded-xl transition-all text-sm shadow-lg shadow-sky-900/20">
            ✏️ Create New Post
          </Link>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <Link to="/login"
              className="py-2.5 text-center border border-gray-700 hover:border-gray-500
                text-gray-300 hover:text-white text-sm font-medium rounded-xl transition-all">
              Log In
            </Link>
            <Link to="/register"
              className="py-2.5 text-center bg-sky-600 hover:bg-sky-500
                text-white text-sm font-semibold rounded-xl transition-all">
              Sign Up Free
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function HomePage() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    postsAPI.getAll({ limit: 20, sortBy: 'newest' })
      .then(({ data }) => setPosts(data.posts))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 64px)' }}>

      {/* LEFT — Live post carousel */}
      <div className="flex-1 flex flex-col min-h-64 lg:min-h-0">
        {loading ? (
          <div className="flex-1 flex items-center justify-center bg-gray-900">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-sky-500 border-t-transparent
                rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Loading posts...</p>
            </div>
          </div>
        ) : (
          <LiveCarousel posts={posts} />
        )}
      </div>

      {/* RIGHT — Category feature panel */}
      <RightPanel posts={posts} />
    </div>
  );
}
