import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { orderAPI, reviewAPI } from '../../services/api';
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
  FiFileText
} from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const OrderDetail = () => {
  const { orderId } = useParams();
  const { user } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [deliveryFiles, setDeliveryFiles] = useState([]);
  const [revisionReason, setRevisionReason] = useState('');
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      // Mock order data for now
      const mockOrder = {
        _id: orderId,
        status: 'in_progress',
        price: 150,
        createdAt: new Date().toISOString(),
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
      };
      setOrder(mockOrder);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
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

  const orderStatuses = [
    { key: 'pending', label: 'Order Placed', description: 'Waiting for seller confirmation' },
    { key: 'in_progress', label: 'In Progress', description: 'Seller is working on your order' },
    { key: 'delivered', label: 'Delivered', description: 'Work has been delivered' },
    { key: 'completed', label: 'Completed', description: 'Order completed successfully' }
  ];

  const getCurrentStatusIndex = () => {
    if (!order) return 0;
    return orderStatuses.findIndex(status => status.key === order.status);
  };

  const handleDeliverWork = async () => {
    try {
      toast.success('Work delivered successfully!');
      setShowDeliveryModal(false);
      fetchOrder();
    } catch (error) {
      console.error('Error delivering work:', error);
      toast.error('Failed to deliver work');
    }
  };

  const handleRequestRevision = async () => {
    try {
      toast.success('Revision requested successfully!');
      setShowRevisionModal(false);
      setRevisionReason('');
      fetchOrder();
    } catch (error) {
      console.error('Error requesting revision:', error);
      toast.error('Failed to request revision');
    }
  };

  const handleCompleteOrder = async () => {
    try {
      toast.success('Order completed successfully!');
      fetchOrder();
    } catch (error) {
      console.error('Error completing order:', error);
      toast.error('Failed to complete order');
    }
  };

  const handleSubmitReview = async () => {
    try {
      toast.success('Review submitted successfully!');
      setShowReviewModal(false);
      fetchOrder();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  // Calculate derived values
  const currentStatusIndex = getCurrentStatusIndex();
  const isSellerView = user?.role === 'freelancer' && order?.seller?._id === user?._id;
  const isBuyerView = user?.role === 'client' && order?.buyer?._id === user?._id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have access to it.</p>
          <Link to="/orders" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order #{order._id?.slice(-8)}</h1>
              <p className="text-gray-600">
                Order placed on {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-full flex items-center space-x-2 ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="font-medium capitalize">{order.status?.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gig Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transform hover:scale-105 transition-transform duration-300">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Service Details</h2>
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                  {order.gig?.images?.[0] ? (
                    <img 
                      src={order.gig.images[0]} 
                      alt={order.gig.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {order.gig?.title?.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{order.gig?.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">Professional logo design service with unlimited revisions</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FiDollarSign className="w-4 h-4 mr-1" />
                      <span>${order.price}</span>
                    </div>
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 mr-1" />
                      <span>3 days delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/messages"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 transform hover:scale-105"
                >
                  <FiMessageSquare className="w-5 h-5" />
                  <span>Message {user?.role === 'freelancer' ? 'Buyer' : 'Seller'}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">#{order._id?.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-green-600">${order.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
