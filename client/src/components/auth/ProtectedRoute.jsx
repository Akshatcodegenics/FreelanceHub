import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import LoadingSpinner from '../ui/LoadingSpinner';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
