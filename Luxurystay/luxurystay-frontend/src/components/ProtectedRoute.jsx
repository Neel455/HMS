import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a route that requires authentication.
 * Optionally restricts to specific roles via the `roles` prop.
 *
 * @param {string[]} [roles] - Allowed roles. Omit to allow any authenticated user.
 */
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'guest' ? '/guest' : '/'} replace />;
  }

  return children;
}
