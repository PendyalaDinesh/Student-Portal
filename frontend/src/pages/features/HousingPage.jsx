/**
 * HousingPage — full housing browse with map, filters, grid/map toggle
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import PostCard, { PostCardSkeleton } from '../../components/posts/PostCard';
import { MapView, LocationSearch, geocodeAddress } from '../../components/common/MapPicker';
import { formatCurrency } from '../../utils/helpers';

const TYPES = ['All', 'Room', 'Apartment', 'House', 'Studio', 'Other'];

export default function HousingPage() {
  const [posts,      setPosts]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [view,       setView]       = useState('grid');
  const [markers,    setMarkers]    = useState([]);
  const [mapCenter,  setMapCenter]  = useState([40.7128, -74.0060]);

  // Filters
  const [type,    setType]    = useState('All');
  const [maxRent, setMaxRent] = useState('');
  const [beds,    setBeds]    = useState('');
  const [search,  setSearch]  = useState('');
  const [locText, setLocText] = useState('');

  useEffect(() => {
    setLoading(true);
    postsAPI.getAll({ category: 'housing', search, location: locText, sortBy: 'newest', limit: 30 })
      .then(async ({ data }) => {
        let list = data.posts;
        if (type !== 'All') list = list.filter(p => p.housing?.type === type);
        if (maxRent)        list = list.filter(p => !p.housing?.rent || p.housing.rent <= +maxRent);
        if (beds)           list = list.filter(p => !p.housing?.bedrooms || p.housing.bedrooms >= +beds);
        setPosts(list);

        // Build map markers
        const m = await Promise.all(list.slice(0, 20).map(async p => {
          if (!p.location) return null;
          const geo = await geocodeAddress(p.location);
          if (!geo) return null;
          return { lat: geo.lat, lng: geo.lng, title: p.title, subtitle: p.location,
            price: p.housing?.rent ? formatCurrency(p.housing.rent) + '/mo' : null, id: p._id };
        }));
        const valid = m.filter(Boolean);
        setMarkers(valid);
        if (valid.length) setMapCenter([valid[0].lat, valid[0].lng]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [type, maxRent, beds, search, locText]);

  const clearFilters = () => { setType('All'); setMaxRent(''); setBeds(''); setSearch(''); setLocText(''); };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-gray-950 to-gray-950 border-b border-blue-900/30">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 50%, rgba(59,130,246,0.15) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🏠</span>
            <div>
              <h1 className="text-3xl font-bold text-white">Student Housing</h1>
              <p className="text-blue-300 text-sm mt-0.5">Find rooms, apartments & houses near your campus</p>
            </div>
          </div>

          {/* Search row */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-2xl">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by keyword..." className="form-input flex-1 text-sm" />
            <LocationSearch placeholder="Search by city or address..."
              onSelect={loc => { setLocText(loc.display.split(',')[0]); setMapCenter([loc.lat, loc.lng]); setView('map'); }}
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
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Property Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {TYPES.map(t => (
                    <button key={t} onClick={() => setType(t)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all
                        ${type === t ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Max Rent / month</label>
                <select value={maxRent} onChange={e => setMaxRent(e.target.value)} className="form-input text-sm py-2">
                  <option value="">Any price</option>
                  {[500,800,1000,1200,1500,2000,2500,3000].map(v => <option key={v} value={v}>${v.toLocaleString()}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Min Bedrooms</label>
                <select value={beds} onChange={e => setBeds(e.target.value)} className="form-input text-sm py-2">
                  <option value="">Any</option>
                  {[1,2,3,4].map(v => <option key={v} value={v}>{v}+</option>)}
                </select>
              </div>

              <button onClick={clearFilters}
                className="w-full py-2 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-all">
                Clear All Filters
              </button>
            </div>

            <Link to="/posts/new"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-500
                text-white text-sm font-semibold rounded-xl transition-all">
              🏠 List Your Place
            </Link>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{posts.length} listings</p>
              <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
                {[['grid','⊞ Grid'],['map','🗺 Map']].map(([v,lbl]) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                      ${view === v ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>{lbl}</button>
                ))}
              </div>
            </div>

            {/* Map */}
            {view === 'map' && (
              <div className="mb-5">
                <MapView markers={markers} height={420} center={mapCenter} zoom={12} accentColor="#3b82f6" />
                <p className="text-xs text-gray-500 mt-2 text-center">Showing {markers.length} locations · Click a pin for details</p>
              </div>
            )}

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array(8).fill(0).map((_,i) => <PostCardSkeleton key={i} />)}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-2xl">
                <div className="text-4xl mb-3">🏠</div>
                <p className="text-gray-400">No listings found. Try adjusting your filters.</p>
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
