import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { gigAPI, orderAPI } from '../../services/api';
import { FiPlus, FiDollarSign, FiShoppingBag, FiStar } from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const FreelancerDashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeOrders: 0,
    totalGigs: 0,
    averageRating: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [myGigs, setMyGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's gigs
      const gigsResponse = await gigAPI.getMyGigs();
      setMyGigs(gigsResponse.data.gigs || []);

      // Fetch recent orders
      const ordersResponse = await orderAPI.getMyOrders('freelancer');
      setRecentOrders(ordersResponse.data.orders?.slice(0, 5) || []);

      // Calculate stats (mock data for now)
      setStats({
        totalEarnings: 2450,
        activeOrders: 3,
        totalGigs: gigsResponse.data.gigs?.length || 0,
        averageRating: 4.8,
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
          <p className="text-gray-600 mt-2">Here's what's happening with your freelance business</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiShoppingBag className="w-6 h-6 text-blue-600" />
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
                <FiPlus className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Gigs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalGigs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiStar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Gigs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">My Gigs</h2>
              <Link
                to="/gigs/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Gig
              </Link>
            </div>

            {myGigs.length > 0 ? (
              <div className="space-y-4">
                {myGigs.slice(0, 3).map((gig) => (
                  <div key={gig._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{gig.title}</h3>
                      <p className="text-sm text-gray-600">
                        Starting at ${gig.pricing?.basic?.price || gig.startingPrice}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        gig.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {gig.status || 'Active'}
                      </span>
                      <Link
                        to={`/gigs/${gig._id}/edit`}
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't created any gigs yet</p>
                <Link
                  to="/gigs/create"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="w-4 h-4 mr-2" />
                  Create Your First Gig
                </Link>
              </div>
            )}
          </div>

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
                        From {order.buyer?.name}
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
                <p className="text-gray-500">No recent orders</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
