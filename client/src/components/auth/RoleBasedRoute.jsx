import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';

const RoleBasedRoute = ({ allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath = user?.role === 'freelancer' 
      ? '/dashboard/freelancer' 
      : '/dashboard/client';
    
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
