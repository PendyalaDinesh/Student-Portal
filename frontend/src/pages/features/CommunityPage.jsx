/**
 * CommunityPage — Buy/Sell, Events, Q&A with map for events/local items
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import PostCard, { PostCardSkeleton } from '../../components/posts/PostCard';
import { MapView, LocationSearch, geocodeAddress } from '../../components/common/MapPicker';
import { formatCurrency, formatDate } from '../../utils/helpers';

const SUB_CATS = ['All', 'Buy/Sell', 'Events', 'Q&A', 'General'];
const CONDITIONS = ['All', 'New', 'Like New', 'Good', 'Fair'];

export default function CommunityPage() {
  const [posts,     setPosts]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [view,      setView]      = useState('grid');
  const [markers,   setMarkers]   = useState([]);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);

  const [search,    setSearch]    = useState('');
  const [subCat,    setSubCat]    = useState('All');
  const [condition, setCondition] = useState('All');
  const [maxPrice,  setMaxPrice]  = useState('');
  const [locText,   setLocText]   = useState('');
  const [freeOnly,  setFreeOnly]  = useState(false);

  useEffect(() => {
    setLoading(true);
    postsAPI.getAll({ category: 'community', search, location: locText, sortBy: 'newest', limit: 30 })
      .then(async ({ data }) => {
        let list = data.posts;
        if (subCat !== 'All')    list = list.filter(p => p.community?.subCategory === subCat);
        if (condition !== 'All') list = list.filter(p => p.community?.condition === condition);
        if (maxPrice)            list = list.filter(p => p.community?.price == null || p.community.price <= +maxPrice);
        if (freeOnly)            list = list.filter(p => !p.community?.price || p.community.price === 0);
        setPosts(list);

        // Map markers for events & local items
        const ms = await Promise.all(
          list.filter(p => p.location && (p.community?.subCategory === 'Events' || p.community?.subCategory === 'Buy/Sell'))
            .slice(0, 15).map(async p => {
              const g = await geocodeAddress(p.location);
              if (!g) return null;
              const isEvent = p.community?.subCategory === 'Events';
              return {
                lat: g.lat, lng: g.lng,
                title: (isEvent ? '📅 ' : '🛍 ') + p.title,
                subtitle: p.location,
                price: p.community?.price ? formatCurrency(p.community.price) : (isEvent ? 'Event' : 'Free'),
                id: p._id,
              };
            })
        );
        const valid = ms.filter(Boolean);
        setMarkers(valid);
        if (valid.length) setMapCenter([valid[0].lat, valid[0].lng]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, subCat, condition, maxPrice, locText, freeOnly]);

  const clearFilters = () => { setSearch(''); setSubCat('All'); setCondition('All'); setMaxPrice(''); setLocText(''); setFreeOnly(false); };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-950 via-gray-950 to-gray-950 border-b border-purple-900/30">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 50%, rgba(139,92,246,0.15) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">📝</span>
            <div>
              <h1 className="text-3xl font-bold text-white">Community</h1>
              <p className="text-purple-300 text-sm mt-0.5">Buy/sell items, find events, ask questions & connect</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-2xl">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search posts..." className="form-input flex-1 text-sm" />
            <LocationSearch placeholder="📍 Filter by location..."
              onSelect={loc => { setLocText(loc.display.split(',')[0]); setMapCenter([loc.lat, loc.lng]); setView('map'); }}
              className="flex-1" />
          </div>

          {/* Sub-category tabs */}
          <div className="flex gap-2 flex-wrap mt-4">
            {SUB_CATS.map(s => (
              <button key={s} onClick={() => setSubCat(s)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all
                  ${subCat === s
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-purple-800/50 text-purple-300 hover:border-purple-600 hover:text-white'}`}>
                {s === 'All' ? '🌐 All' : s === 'Buy/Sell' ? '🛍 Buy/Sell' : s === 'Events' ? '📅 Events' : s === 'Q&A' ? '❓ Q&A' : '💬 General'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0 space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-4">
              <h3 className="font-bold text-sm text-white">Filters</h3>

              {(subCat === 'All' || subCat === 'Buy/Sell') && (<>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Condition</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CONDITIONS.map(c => (
                      <button key={c} onClick={() => setCondition(c)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all
                          ${condition === c ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Max Price</label>
                  <select value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="form-input text-sm py-2">
                    <option value="">Any</option>
                    {[10,25,50,100,200,500].map(v => <option key={v} value={v}>${v}</option>)}
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={freeOnly} onChange={e => setFreeOnly(e.target.checked)}
                    className="w-4 h-4 accent-purple-500" />
                  <span className="text-xs text-gray-300">Free items only</span>
                </label>
              </>)}

              <button onClick={clearFilters}
                className="w-full py-2 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-all">
                Clear All
              </button>
            </div>

            <Link to="/posts/new"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold rounded-xl transition-all">
              📝 Create Post
            </Link>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{posts.length} posts</p>
              <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
                {[['grid','⊞ Grid'],['map','🗺 Map']].map(([v,lbl]) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                      ${view === v ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}>{lbl}</button>
                ))}
              </div>
            </div>

            {view === 'map' && (
              <div className="mb-5">
                <MapView markers={markers} height={420} center={mapCenter} zoom={12} accentColor="#8b5cf6" />
                <p className="text-xs text-gray-500 mt-2 text-center">📍 Events & local items on map</p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array(8).fill(0).map((_,i) => <PostCardSkeleton key={i} />)}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-2xl">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-gray-400 mb-4">Nothing here yet. Be the first to post!</p>
                <Link to="/posts/new" className="text-purple-400 hover:text-purple-300 text-sm font-medium">+ Create a post →</Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {posts.map(p => <PostCard key={p._id} post={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
