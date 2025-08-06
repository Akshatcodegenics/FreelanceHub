import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/authStore';
import { useEffect } from 'react';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Gig Pages
import GigList from './pages/gigs/GigList';
import GigDetail from './pages/gigs/GigDetail';
import CreateGig from './pages/gigs/CreateGig';
import EditGig from './pages/gigs/EditGig';

// Order Pages
import OrderDetail from './pages/orders/OrderDetail';
import OrderHistory from './pages/orders/OrderHistory';

// Dashboard Pages
import FreelancerDashboard from './pages/dashboard/FreelancerDashboard';
import ClientDashboard from './pages/dashboard/ClientDashboard';

// Profile Pages
import Profile from './pages/profile/Profile';
import EditProfile from './pages/profile/EditProfile';

// Message Pages
import Messages from './pages/messages/Messages';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleBasedRoute from './components/auth/RoleBasedRoute';

// Loading Component
import LoadingSpinner from './components/ui/LoadingSpinner';

function App() {
  const { user, loading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4">Loading FreelanceHub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/gigs" element={<GigList />} />
          <Route path="/gigs/:slug" element={<GigDetail />} />
          
          {/* Auth Routes - Redirect if already logged in */}
          <Route 
            path="/login" 
            element={user ? <Navigate to="/" replace /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" replace /> : <Register />} 
          />
          <Route 
            path="/forgot-password" 
            element={user ? <Navigate to="/" replace /> : <ForgotPassword />} 
          />
          <Route 
            path="/reset-password/:token" 
            element={user ? <Navigate to="/" replace /> : <ResetPassword />} 
          />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            {/* Profile Routes */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            
            {/* Messages */}
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:conversationId" element={<Messages />} />
            
            {/* Orders */}
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/orders/:orderId" element={<OrderDetail />} />
            
            {/* Role-based Dashboard Routes */}
            <Route 
              path="/dashboard" 
              element={
                user?.role === 'freelancer' ? (
                  <Navigate to="/dashboard/freelancer" replace />
                ) : (
                  <Navigate to="/dashboard/client" replace />
                )
              } 
            />
            
            {/* Freelancer Routes */}
            <Route element={<RoleBasedRoute allowedRoles={['freelancer']} />}>
              <Route path="/dashboard/freelancer" element={<FreelancerDashboard />} />
              <Route path="/gigs/create" element={<CreateGig />} />
              <Route path="/gigs/:id/edit" element={<EditGig />} />
            </Route>
            
            {/* Client Routes */}
            <Route element={<RoleBasedRoute allowedRoles={['client']} />}>
              <Route path="/dashboard/client" element={<ClientDashboard />} />
            </Route>
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
