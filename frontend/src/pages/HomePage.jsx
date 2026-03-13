// HomePage — dynamic hero + category cards that open dedicated pages + recent listings
import { Link } from 'react-router-dom';
import { usePosts } from '../hooks/usePosts';
import PostCard, { PostCardSkeleton } from '../components/posts/PostCard';
import { CATEGORIES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const ROUTES = { housing: '/housing', rides: '/rides', jobs: '/jobs', community: '/community' };

const STATS = [
  { label: 'Active Listings', value: '2,400+', icon: '📋' },
  { label: 'Students Helped', value: '8,000+', icon: '🎓' },
  { label: 'Universities',    value: '150+',   icon: '🏛' },
  { label: 'Cities Covered',  value: '50+',    icon: '🌍' },
];

export default function HomePage() {
  const { isLoggedIn } = useAuth();
  const { posts: recent, loading } = usePosts({ sortBy: 'newest', limit: 8 });

  return (
    <div className="bg-gray-950 min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sky-900/40 border border-sky-700/40 rounded-full text-sky-400 text-sm font-medium mb-6">
            🎓 The platform built for international students
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-5 leading-[1.05] tracking-tight">
            Everything You Need<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400">
              On One Platform
            </span>
          </h1>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Find housing, share rides, discover jobs, and connect with your campus community — all in one place.
          </p>
          {!isLoggedIn ? (
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/register"
                className="px-8 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-sky-900/40 text-lg">
                Get Started Free →
              </Link>
              <Link to="/login"
                className="px-8 py-3.5 border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-2xl transition-all text-lg">
                Log In
              </Link>
            </div>
          ) : (
            <Link to="/posts/new"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-sky-900/40 text-lg">
              ✏️ Create a Post
            </Link>
          )}
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Feature category cards ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Browse by Category</h2>
          <p className="text-gray-400">Click any category to explore listings with search, filters & map view</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} to={ROUTES[cat.id]}
              className={`group relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-200
                hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/40 cursor-pointer
                ${cat.bg} ${cat.border}`}>
              {/* Glow */}
              <div className="absolute -bottom-8 -right-8 w-28 h-28 rounded-full opacity-20 blur-xl transition-all duration-300 group-hover:opacity-40"
                style={{ background: `var(--tw-${cat.color}-500, #0ea5e9)` }} />

              <div className="relative">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200 inline-block">{cat.icon}</div>
                <h3 className={`text-xl font-bold mb-2 ${cat.text}`}>{cat.label}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{cat.description}</p>
                <div className={`flex items-center gap-1.5 text-sm font-semibold ${cat.text}`}>
                  <span>Browse listings</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent listings — narrower cards ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Recent Listings</h2>
            <p className="text-gray-500 text-sm mt-0.5">Latest posts from all categories</p>
          </div>
          <div className="hidden sm:flex gap-2">
            {CATEGORIES.map(c => (
              <Link key={c.id} to={ROUTES[c.id]}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all hover:-translate-y-0.5 ${c.bg} ${c.text} ${c.border}`}>
                {c.icon} {c.label}
              </Link>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {Array(8).fill(0).map((_,i) => <PostCardSkeleton key={i} />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-2xl">
            <div className="text-5xl mb-4">✨</div>
            <p className="text-gray-400 text-lg mb-4">Be the first to post!</p>
            {isLoggedIn && (
              <Link to="/posts/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl transition-all">
                + Create First Post
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Narrow grid — more columns for smaller cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {recent.map(p => <PostCard key={p._id} post={p} />)}
            </div>
            <div className="flex justify-center gap-3 flex-wrap mt-8">
              {CATEGORIES.map(c => (
                <Link key={c.id} to={ROUTES[c.id]}
                  className={`px-5 py-2.5 rounded-xl font-semibold text-sm border transition-all hover:-translate-y-0.5 ${c.bg} ${c.text} ${c.border}`}>
                  All {c.label} →
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
