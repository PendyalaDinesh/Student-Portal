// Week 2 — Blocks unauthenticated users from protected pages
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PageLoader } from '../common/Spinner';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
  const location = useLocation();

  if (loading)    return <PageLoader />;
  if (!isLoggedIn) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  return children;
}
