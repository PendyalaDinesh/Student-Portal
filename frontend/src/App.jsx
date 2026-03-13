// App.jsx — Updated routing with dedicated feature pages
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import HomePage           from './pages/HomePage';
import LoginPage          from './pages/auth/LoginPage';
import RegisterPage       from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import PostDetailPage     from './pages/posts/PostDetailPage';
import CreatePostPage     from './pages/posts/CreatePostPage';
import EditPostPage       from './pages/posts/EditPostPage';
import ProfilePage        from './pages/user/ProfilePage';
import MyPostsPage        from './pages/user/MyPostsPage';
import SavedPostsPage     from './pages/user/SavedPostsPage';
import MessagesPage       from './pages/MessagesPage';

// ── Dedicated feature pages (NEW) ─────────────────────────────
import HousingPage   from './pages/features/HousingPage';
import RidesPage     from './pages/features/RidesPage';
import JobsPage      from './pages/features/JobsPage';
import CommunityPage from './pages/features/CommunityPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ── Home ── */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />

          {/* ── Feature pages (each category = its own page with map) ── */}
          <Route path="/housing"   element={<Layout><HousingPage   /></Layout>} />
          <Route path="/rides"     element={<Layout><RidesPage     /></Layout>} />
          <Route path="/jobs"      element={<Layout><JobsPage      /></Layout>} />
          <Route path="/community" element={<Layout><CommunityPage /></Layout>} />

          {/* ── Post detail & CRUD ── */}
          <Route path="/posts/:id"      element={<Layout><PostDetailPage /></Layout>} />
          <Route path="/posts/new"      element={<ProtectedRoute><Layout><CreatePostPage /></Layout></ProtectedRoute>} />
          <Route path="/posts/:id/edit" element={<ProtectedRoute><Layout><EditPostPage   /></Layout></ProtectedRoute>} />

          {/* ── User pages ── */}
          <Route path="/users/:id"  element={<Layout><ProfilePage /></Layout>} />
          <Route path="/profile"    element={<ProtectedRoute><Layout><ProfilePage    /></Layout></ProtectedRoute>} />
          <Route path="/my-posts"   element={<ProtectedRoute><Layout><MyPostsPage   /></Layout></ProtectedRoute>} />
          <Route path="/saved"      element={<ProtectedRoute><Layout><SavedPostsPage /></Layout></ProtectedRoute>} />
          <Route path="/messages"   element={<ProtectedRoute><Layout><MessagesPage  /></Layout></ProtectedRoute>} />

          {/* ── Auth ── */}
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/register"        element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* ── 404 ── */}
          <Route path="*" element={
            <Layout>
              <div className="text-center py-20">
                <div className="text-7xl font-bold text-gray-800 mb-4">404</div>
                <p className="text-gray-400 mb-6">Page not found</p>
                <a href="/" className="text-sky-400 hover:text-sky-300 font-medium">← Go home</a>
              </div>
            </Layout>
          }/>
        </Routes>
      </BrowserRouter>

      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1f2937', color: '#f9fafb', border: '1px solid #374151' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#f9fafb' } },
          error:   { iconTheme: { primary: '#ef4444', secondary: '#f9fafb' } },
        }}
      />
    </AuthProvider>
  );
}
