import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { orderAPI } from '../../services/api';
import { FiSearch, FiShoppingBag, FiClock, FiCheckCircle } from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const ClientDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalSpent: 0,
    activeOrders: 0,
    completedOrders: 0,
    savedServices: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch recent orders
      const ordersResponse = await orderAPI.getMyOrders('client');
      setRecentOrders(ordersResponse.data.orders?.slice(0, 5) || []);

      // Calculate stats (mock data for now)
      setStats({
        totalSpent: 1250,
        activeOrders: 2,
        completedOrders: 8,
        savedServices: 5,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mt-2">Find the perfect freelance services for your projects</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/gigs"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiSearch className="w-4 h-4 mr-2" />
              Browse Services
            </Link>
            <Link
              to="/orders"
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiShoppingBag className="w-4 h-4 mr-2" />
              My Orders
            </Link>
            <Link
              to="/messages"
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Messages
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalSpent}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiClock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiSearch className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saved Services</p>
                <p className="text-2xl font-bold text-gray-900">{stats.savedServices}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
              <Link
                to="/orders"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                View All
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{order.gig?.title}</h3>
                      <p className="text-sm text-gray-600">
                        From {order.seller?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${order.price}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status?.replace('_', ' ') || 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No recent orders</p>
                <Link
                  to="/gigs"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiSearch className="w-4 h-4 mr-2" />
                  Browse Services
                </Link>
              </div>
            )}
          </div>

          {/* Recommended Services */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
              <Link
                to="/gigs"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                View All
              </Link>
            </div>

            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Personalized recommendations coming soon</p>
              <Link
                to="/gigs"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiSearch className="w-4 h-4 mr-2" />
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
