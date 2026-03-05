// App.jsx — Router setup (Week 2: auth routes, Week 3+: post routes)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';

// Pages
import HomePage          from './pages/HomePage';
import LoginPage         from './pages/auth/LoginPage';
import RegisterPage      from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import PostDetailPage    from './pages/posts/PostDetailPage';
import CreatePostPage    from './pages/posts/CreatePostPage';
import EditPostPage      from './pages/posts/EditPostPage';
import ProfilePage       from './pages/user/ProfilePage';
import MyPostsPage       from './pages/user/MyPostsPage';
import SavedPostsPage    from './pages/user/SavedPostsPage';
import MessagesPage      from './pages/MessagesPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/posts/:id" element={<Layout><PostDetailPage /></Layout>} />
          <Route path="/users/:id" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected routes (Week 2) */}
          <Route path="/posts/new" element={
            <ProtectedRoute><Layout><CreatePostPage /></Layout></ProtectedRoute>
          }/>
          <Route path="/posts/:id/edit" element={
            <ProtectedRoute><Layout><EditPostPage /></Layout></ProtectedRoute>
          }/>
          <Route path="/profile" element={
            <ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>
          }/>
          <Route path="/my-posts" element={
            <ProtectedRoute><Layout><MyPostsPage /></Layout></ProtectedRoute>
          }/>
          <Route path="/saved" element={
            <ProtectedRoute><Layout><SavedPostsPage /></Layout></ProtectedRoute>
          }/>
          <Route path="/messages" element={
            <ProtectedRoute><Layout><MessagesPage /></Layout></ProtectedRoute>
          }/>

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <div className="text-center py-20">
                <div className="text-6xl mb-4">404</div>
                <p className="text-gray-400 mb-6">Page not found</p>
                <a href="/" className="text-sky-400 hover:text-sky-300">← Go home</a>
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
