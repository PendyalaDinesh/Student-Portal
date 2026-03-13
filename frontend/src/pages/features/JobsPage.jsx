/**
 * JobsPage — jobs board with location map and filters
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../../services/api';
import PostCard, { PostCardSkeleton } from '../../components/posts/PostCard';
import { MapView, LocationSearch, geocodeAddress } from '../../components/common/MapPicker';
import { formatCurrency } from '../../utils/helpers';

const JOB_TYPES = ['All', 'On-campus', 'Off-campus', 'Remote', 'Hybrid'];

export default function JobsPage() {
  const [posts,     setPosts]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [view,      setView]      = useState('grid');
  const [markers,   setMarkers]   = useState([]);
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]);

  const [search,    setSearch]    = useState('');
  const [jobType,   setJobType]   = useState('All');
  const [minPay,    setMinPay]    = useState('');
  const [maxHours,  setMaxHours]  = useState('');
  const [locText,   setLocText]   = useState('');
  const [noAuth,    setNoAuth]    = useState(false);

  useEffect(() => {
    setLoading(true);
    postsAPI.getAll({ category: 'jobs', search, location: locText, sortBy: 'newest', limit: 30 })
      .then(async ({ data }) => {
        let list = data.posts;
        if (jobType !== 'All') list = list.filter(p => p.jobs?.jobType === jobType);
        if (minPay)   list = list.filter(p => !p.jobs?.payRate || p.jobs.payRate >= +minPay);
        if (maxHours) list = list.filter(p => !p.jobs?.hoursPerWeek || p.jobs.hoursPerWeek <= +maxHours);
        if (noAuth)   list = list.filter(p => !p.jobs?.workAuthRequired);
        setPosts(list);

        // Map for non-remote jobs
        const ms = await Promise.all(
          list.filter(p => p.jobs?.jobType !== 'Remote' && p.location).slice(0,15).map(async p => {
            const g = await geocodeAddress(p.location);
            if (!g) return null;
            return { lat: g.lat, lng: g.lng, title: p.title, subtitle: p.location,
              price: p.jobs?.payRate ? formatCurrency(p.jobs.payRate) + '/hr' : null, id: p._id };
          })
        );
        const valid = ms.filter(Boolean);
        setMarkers(valid);
        if (valid.length) setMapCenter([valid[0].lat, valid[0].lng]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [search, jobType, minPay, maxHours, locText, noAuth]);

  const clearFilters = () => { setSearch(''); setJobType('All'); setMinPay(''); setMaxHours(''); setLocText(''); setNoAuth(false); };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-950 via-gray-950 to-gray-950 border-b border-amber-900/30">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 20% 50%, rgba(245,158,11,0.15) 0%, transparent 60%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">💼</span>
            <div>
              <h1 className="text-3xl font-bold text-white">Student Jobs</h1>
              <p className="text-amber-300 text-sm mt-0.5">On-campus, remote & part-time jobs for students</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 max-w-2xl">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Job title, skill, keyword..." className="form-input flex-1 text-sm" />
            <LocationSearch placeholder="📍 City or campus..."
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
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Job Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {JOB_TYPES.map(t => (
                    <button key={t} onClick={() => setJobType(t)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all
                        ${jobType === t ? 'bg-amber-600 border-amber-600 text-white' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Min Pay / hr</label>
                <select value={minPay} onChange={e => setMinPay(e.target.value)} className="form-input text-sm py-2">
                  <option value="">Any</option>
                  {[10,12,15,17,20,25].map(v => <option key={v} value={v}>${v}+</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1.5 block">Max Hours / week</label>
                <select value={maxHours} onChange={e => setMaxHours(e.target.value)} className="form-input text-sm py-2">
                  <option value="">Any</option>
                  {[10,15,20,25,30].map(v => <option key={v} value={v}>≤{v} hrs</option>)}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={noAuth} onChange={e => setNoAuth(e.target.checked)}
                  className="w-4 h-4 accent-amber-500" />
                <span className="text-xs text-gray-300">No work auth required</span>
              </label>

              <button onClick={clearFilters}
                className="w-full py-2 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl transition-all">
                Clear All
              </button>
            </div>

            <Link to="/posts/new"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-xl transition-all">
              💼 Post a Job
            </Link>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-400 text-sm font-medium">{posts.length} jobs found</p>
              <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1">
                {[['grid','⊞ Grid'],['map','🗺 Map']].map(([v,lbl]) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                      ${view === v ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'}`}>{lbl}</button>
                ))}
              </div>
            </div>

            {view === 'map' && (
              <div className="mb-5">
                <MapView markers={markers} height={420} center={mapCenter} zoom={12} accentColor="#f59e0b" />
                <p className="text-xs text-gray-500 mt-2 text-center">📍 Job locations · Remote jobs not shown on map</p>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array(8).fill(0).map((_,i) => <PostCardSkeleton key={i} />)}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-2xl">
                <div className="text-4xl mb-3">💼</div>
                <p className="text-gray-400 mb-4">No jobs found. Try different filters.</p>
                <Link to="/posts/new" className="text-amber-400 hover:text-amber-300 text-sm font-medium">+ Post a job →</Link>
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
