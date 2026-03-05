// Week 2 + Week 4 — Top navigation bar
import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import { CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { isLoggedIn, dbUser, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [dropOpen, setDropOpen] = useState(false);
  const [mobOpen,  setMobOpen]  = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => setMobOpen(false), [location.pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
    setDropOpen(false);
  };

  const activeCat = new URLSearchParams(location.search).get('category');

  return (
    <nav className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-lg shadow-lg">🎓</div>
          <span className="font-display font-bold text-xl hidden sm:block">
            Student<span className="text-sky-400">Hub</span>
          </span>
        </Link>

        {/* Category tabs — desktop */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {CATEGORIES.map(cat => (
            <NavLink key={cat.id} to={`/?category=${cat.id}`}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all
                ${activeCat === cat.id
                  ? `${cat.bg} ${cat.text} border ${cat.border}`
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
              <span>{cat.icon}</span> {cat.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {isLoggedIn ? (
            <>
              <Link to="/posts/new"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500
                  text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-sky-900/30">
                <span className="text-base leading-none">+</span> New Post
              </Link>

              {/* User menu */}
              <div className="relative" ref={dropRef}>
                <button onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-800 transition-all">
                  <Avatar user={dbUser} size={32} />
                  <span className="hidden sm:block text-sm font-medium text-gray-200 max-w-24 truncate">
                    {dbUser?.name?.split(' ')[0]}
                  </span>
                  <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7 10l5 5 5-5H7z"/>
                  </svg>
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-gray-700
                    rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                    <div className="px-4 py-3 border-b border-gray-800">
                      <p className="font-semibold text-sm">{dbUser?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{dbUser?.email}</p>
                    </div>
                    {[
                      { to: '/profile', icon: '👤', label: 'My Profile' },
                      { to: '/my-posts', icon: '📋', label: 'My Listings' },
                      { to: '/saved', icon: '❤️', label: 'Saved Posts' },
                      { to: '/messages', icon: '💬', label: 'Messages' },
                    ].map(item => (
                      <Link key={item.to} to={item.to}
                        onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300
                          hover:bg-gray-800 hover:text-white transition-colors">
                        <span>{item.icon}</span> {item.label}
                      </Link>
                    ))}
                    <Link to="/posts/new" className="sm:hidden flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800" onClick={() => setDropOpen(false)}>
                      <span>✏️</span> New Post
                    </Link>
                    <div className="border-t border-gray-800">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400
                          hover:bg-red-900/20 transition-colors">
                        <span>🚪</span> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white rounded-xl hover:bg-gray-800 transition-all">
                Log In
              </Link>
              <Link to="/register"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-sky-900/30">
                Sign Up
              </Link>
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

      {/* Mobile category menu */}
      {mobOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900 px-4 py-3 grid grid-cols-2 gap-2">
          {CATEGORIES.map(cat => (
            <Link key={cat.id} to={`/?category=${cat.id}`}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium
                border transition-all ${cat.bg} ${cat.text} ${cat.border}`}>
              <span>{cat.icon}</span> {cat.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
