import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
// If user is not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
// If route is admin-only and user is not an admin, redirect to home page
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}


export default ProtectedRoute;

