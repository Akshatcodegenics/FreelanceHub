import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { orderAPI } from '../../services/api';
import { 
  FiClock, 
  FiCheck, 
  FiX, 
  FiDownload, 
  FiUpload, 
  FiMessageSquare,
  FiStar,
  FiRefreshCw,
  FiAlertCircle,
  FiDollarSign,
  FiCalendar,
  FiUser,
  FiFileText,
  FiGrid,
  FiList,
  FiFilter,
  FiSearch,
  FiEye
} from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const OrderHistory = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Mock orders data for now
      const mockOrders = [
        {
          _id: '1',
          status: 'completed',
          price: 150,
          createdAt: new Date('2024-01-15').toISOString(),
          gig: {
            title: 'Professional Logo Design',
            images: [],
          },
          seller: {
            _id: 'seller1',
            name: 'John Designer',
            avatar: '/default-avatar.png'
          },
          buyer: {
            _id: 'buyer1', 
            name: 'Jane Client',
            avatar: '/default-avatar.png'
          }
        },
        {
          _id: '2',
          status: 'in_progress',
          price: 250,
          createdAt: new Date('2024-01-20').toISOString(),
          gig: {
            title: 'Website Development',
            images: [],
          },
          seller: {
            _id: 'seller2',
            name: 'Mike Developer',
            avatar: '/default-avatar.png'
          },
          buyer: {
            _id: 'buyer1', 
            name: 'Jane Client',
            avatar: '/default-avatar.png'
          }
        },
        {
          _id: '3',
          status: 'delivered',
          price: 75,
          createdAt: new Date('2024-01-25').toISOString(),
          gig: {
            title: 'Content Writing',
            images: [],
          },
          seller: {
            _id: 'seller3',
            name: 'Sarah Writer',
            avatar: '/default-avatar.png'
          },
          buyer: {
            _id: 'buyer1', 
            name: 'Jane Client',
            avatar: '/default-avatar.png'
          }
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.price, 0);
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    const activeOrders = orders.filter(order => ['pending', 'in_progress', 'delivered'].includes(order.status)).length;
    
    return { totalOrders, totalSpent, completedOrders, activeOrders };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FiClock className="w-4 h-4" />;
      case 'in_progress': return <FiRefreshCw className="w-4 h-4" />;
      case 'delivered': return <FiUpload className="w-4 h-4" />;
      case 'completed': return <FiCheck className="w-4 h-4" />;
      case 'cancelled': return <FiX className="w-4 h-4" />;
      default: return <FiAlertCircle className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.seller.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'price':
        return b.price - a.price;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  // Calculate stats
  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Track and manage all your orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiFileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalSpent}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiDollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedOrders}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeOrders}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiClock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="delivered">Delivered</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Orders Grid/List */}
        {sortedOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet or no orders match your filters.</p>
            <Link
              to="/gigs"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Services
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {sortedOrders.map((order) => (
              <div
                key={order._id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex items-center space-x-6' : ''
                }`}
              >
                <div className={viewMode === 'list' ? 'flex-1' : ''}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{order.gig.title}</h3>
                      <p className="text-sm text-gray-600">Order #{order._id.slice(-8)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FiUser className="w-4 h-4 mr-1" />
                      <span>{order.seller.name}</span>
                    </div>
                    <div className="flex items-center">
                      <FiDollarSign className="w-4 h-4 mr-1" />
                      <span>${order.price}</span>
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="w-4 h-4 mr-1" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Link
                      to={`/orders/${order._id}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <FiEye className="w-4 h-4" />
                      <span>View Details</span>
                    </Link>
                    <Link
                      to="/messages"
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <FiMessageSquare className="w-4 h-4" />
                      <span>Message</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
