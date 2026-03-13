// Navbar — category tabs each navigate to dedicated feature page
import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import { CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

const ROUTES = { housing: '/housing', rides: '/rides', jobs: '/jobs', community: '/community' };

export default function Navbar() {
  const { isLoggedIn, dbUser, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [dropOpen, setDropOpen] = useState(false);
  const [mobOpen,  setMobOpen]  = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => setMobOpen(false), [location.pathname]);

  const handleLogout = async () => {
    await logout(); toast.success('Logged out'); navigate('/'); setDropOpen(false);
  };

  const activeCat = CATEGORIES.find(c => location.pathname.startsWith(ROUTES[c.id]))?.id;

  return (
    <nav className="sticky top-0 z-40 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-3">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 mr-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-base shadow-lg">🎓</div>
          <span className="font-bold text-lg hidden sm:block">Student<span className="text-sky-400">Hub</span></span>
        </Link>

        {/* Category tabs — desktop, each goes to dedicated page */}
        <div className="hidden md:flex items-center gap-0.5 flex-1">
          {CATEGORIES.map(cat => (
            <NavLink key={cat.id} to={ROUTES[cat.id]}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all
                ${activeCat === cat.id
                  ? `${cat.bg} ${cat.text} border ${cat.border}`
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              <span>{cat.icon}</span> {cat.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {isLoggedIn ? (
            <>
              <Link to="/posts/new"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 hover:bg-sky-500
                  text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-sky-900/30">
                <span>+</span> Post
              </Link>

              <div className="relative" ref={dropRef}>
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-gray-800 transition-all">
                  <Avatar user={dbUser} size={30} />
                  <span className="hidden sm:block text-sm font-medium text-gray-200 max-w-[80px] truncate">
                    {dbUser?.name?.split(' ')[0]}
                  </span>
                  <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="currentColor"><path d="M7 10l5 5 5-5H7z"/></svg>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-800">
                      <p className="font-semibold text-sm truncate">{dbUser?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{dbUser?.email}</p>
                    </div>
                    {[
                      ['/profile',  '👤', 'My Profile'],
                      ['/my-posts', '📋', 'My Listings'],
                      ['/saved',    '❤️', 'Saved Posts'],
                      ['/messages', '💬', 'Messages'],
                      ['/posts/new','✏️', 'New Post'],
                    ].map(([to, icon, label]) => (
                      <Link key={to} to={to} onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                        <span>{icon}</span> {label}
                      </Link>
                    ))}
                    <div className="border-t border-gray-800">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 transition-colors">
                        <span>🚪</span> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3.5 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-xl hover:bg-gray-800 transition-all">Log In</Link>
              <Link to="/register" className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl transition-all">Sign Up</Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button onClick={() => setMobOpen(!mobOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900/95 px-4 py-3 grid grid-cols-2 gap-2">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} to={ROUTES[cat.id]}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${cat.bg} ${cat.text} ${cat.border}`}>
              <span>{cat.icon}</span> {cat.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
