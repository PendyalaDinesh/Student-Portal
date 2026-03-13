/**
 * RidesPage — ride sharing with route map and filters
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import PostCard, { PostCardSkeleton } from '../../components/posts/PostCard';
import { MapView, LocationSearch, geocodeAddress } from '../../components/common/MapPicker';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function RidesPage() {
  const [posts,     setPosts]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [view,      setView]      = useState('grid');
  const [markers,   setMarkers]   = useState([]);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);

  const [search,    setSearch]    = useState('');
  const [fromLoc,   setFromLoc]   = useState('');
  const [toLoc,     setToLoc]     = useState('');
  const [maxCost,   setMaxCost]   = useState('');
  const [minSeats,  setMinSeats]  = useState('');
  const [dateFilter,setDateFilter]= useState('');

  useEffect(() => {
    setLoading(true);
    postsAPI.getAll({ category: 'rides', search, sortBy: 'newest', limit: 30 })
      .then(async ({ data }) => {
        let list = data.posts;
        if (fromLoc)    list = list.filter(p => p.rides?.from?.toLowerCase().includes(fromLoc.toLowerCase()));
        if (toLoc)      list = list.filter(p => p.rides?.to?.toLowerCase().includes(toLoc.toLowerCase()));
        if (maxCost)    list = list.filter(p => !p.rides?.costPerPerson || p.rides.costPerPerson <= +maxCost);
        if (minSeats)   list = list.filter(p => !p.rides?.seats || p.rides.seats >= +minSeats);
        if (dateFilter) list = list.filter(p => {
          if (!p.rides?.departureDate) return false;
          return new Date(p.rides.departureDate).toDateString() === new Date(dateFilter).toDateString();
        });
        setPosts(list);

        // Map markers — pin both from and to locations
        const ms = [];
        for (const p of list.slice(0, 15)) {
          if (p.rides?.from) {
            const g = await geocodeAddress(p.rides.from);
            if (g) ms.push({ lat: g.lat, lng: g.lng, title: `📍 From: ${p.rides.from}`, subtitle: `→ ${p.rides.to || '?'}`, price: p.rides?.costPerPerson ? formatCurrency(p.rides.costPerPerson) + '/person' : null, id: p._id });
          }
        }
        setMarkers(ms);
        if (ms.length) setMapCenter([ms[0].lat, ms[0].lng]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, fromLoc, toLoc, maxCost, minSeats, dateFilter]);

  const clearFilters = () => { setSearch(''); setFromLoc(''); setToLoc(''); setMaxCost(''); setMinSeats(''); setDateFilter(''); };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-gray-950 to-gray-950 border-b border-emerald-900/30">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 50%, rgba(16,185,129,0.15) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🚗</span>
            <div>
              <h1 className="text-3xl font-bold text-white">Ride Sharing</h1>
              <p className="text-emerald-300 text-sm mt-0.5">Share rides and split costs with fellow students</p>
            </div>
          </div>

          {/* Route search */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-2xl">
            <LocationSearch placeholder="🚩 Leaving from..."
              onSelect={loc => { setFromLoc(loc.display.split(',')[0]); setMapCenter([loc.lat, loc.lng]); setView('map'); }}
              className="flex-1" />
            <LocationSearch placeholder="🏁 Going to..."
              onSelect={loc => { setToLoc(loc.display.split(',')[0]); }}
              className="flex-1" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Sidebar */}
          <aside className="lg:w-56 shrink-0 space-y-4">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-4">
              <h3 className="font-bold text-sm text-white">Filters</h3>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Keyword</label>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search rides..." className="form-input text-sm py-2" />
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Date</label>
                <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)}
                  className="form-input text-sm py-2" />
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Max Cost / person</label>
                <select value={maxCost} onChange={e => setMaxCost(e.target.value)} className="form-input text-sm py-2">
                  <option value="">Any</option>
                  {[5,10,15,20,30,50].map(v => <option key={v} value={v}>${v}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Min Seats</label>
                <select value={minSeats} onChange={e => setMinSeats(e.target.value)} className="form-input text-sm py-2">
                  <option value="">Any</option>
                  {[1,2,3,4].map(v => <option key={v} value={v}>{v}+</option>)}
                </select>
              </div>

              <button onClick={clearFilters}
                className="w-full py-2 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-all">
                Clear All
              </button>
            </div>

            <Link to="/posts/new"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all">
              🚗 Offer a Ride
            </Link>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{posts.length} rides found</p>
              <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
                {[['grid','⊞ Grid'],['map','🗺 Map']].map(([v,lbl]) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                      ${view === v ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}>{lbl}</button>
                ))}
              </div>
            </div>

            {view === 'map' && (
              <div className="mb-5">
                <MapView markers={markers} height={420} center={mapCenter} zoom={10} accentColor="#10b981" />
                <p className="text-xs text-gray-500 mt-2 text-center">📍 Departure locations · {markers.length} rides plotted</p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array(8).fill(0).map((_,i) => <PostCardSkeleton key={i} />)}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-2xl">
                <div className="text-4xl mb-3">🚗</div>
                <p className="text-gray-400 mb-4">No rides found. Try adjusting your filters.</p>
                <Link to="/posts/new" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium">+ Offer a ride →</Link>
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
