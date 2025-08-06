import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { gigAPI, orderAPI, reviewAPI } from '../../services/api';
import { sampleDataService, sampleReviews } from '../../services/sampleDataService';
import {
  FiStar,
  FiHeart,
  FiShare2,
  FiFlag,
  FiClock,
  FiRefreshCw,
  FiCheck,
  FiMessageSquare,
  FiUser,
  FiCalendar,
  FiTruck,
  FiShield,
  FiMapPin,
  FiAward
} from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import toast from 'react-hot-toast';

const GigDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  const [gig, setGig] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState('basic');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchGigDetails();
    }
  }, [slug]);

  const fetchGigDetails = async () => {
    try {
      setLoading(true);
      // Use sample data service for now
      const gigData = sampleDataService.getGigBySlug(slug);
      if (gigData) {
        setGig(gigData);
        // Fetch reviews for this gig
        fetchReviews(gigData._id);
      } else {
        toast.error('Gig not found');
        navigate('/gigs');
      }
    } catch (error) {
      console.error('Error fetching gig details:', error);
      toast.error('Failed to load gig details');
      navigate('/gigs');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (gigId) => {
    try {
      setReviewsLoading(true);
      // Use sample reviews for now
      const gigReviews = sampleReviews.filter(review => review.gigId === gigId);
      setReviews(gigReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleOrderNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to place an order');
      navigate('/login', { state: { from: location } });
      return;
    }

    if (user?.role === 'freelancer' && gig?.seller?._id === user?._id) {
      toast.error('You cannot order your own gig');
      return;
    }

    try {
      const packageData = gig.pricing[selectedPackage];
      const orderData = {
        gig: gig._id,
        seller: gig.seller._id,
        package: selectedPackage,
        price: packageData.price,
        deliveryTime: packageData.deliveryTime,
        requirements: packageData.features,
      };

      const response = await orderAPI.create(orderData);
      toast.success('Order placed successfully!');
      navigate(`/orders/${response.data._id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to contact the seller');
      navigate('/login', { state: { from: location } });
      return;
    }

    // Navigate to messages with seller
    navigate(`/messages?seller=${gig.seller._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!gig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Gig not found</h2>
          <Link to="/gigs" className="text-blue-600 hover:text-blue-700">
            Browse all gigs
          </Link>
        </div>
      </div>
    );
  }

  const currentPackage = gig.pricing?.[selectedPackage] || gig.pricing?.basic;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Breadcrumb */}
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link to="/" className="text-gray-500 hover:text-gray-700">
                    Home
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500">/</span>
                </li>
                <li>
                  <Link to="/gigs" className="text-gray-500 hover:text-gray-700">
                    Services
                  </Link>
                </li>
                <li>
                  <span className="text-gray-500">/</span>
                </li>
                <li>
                  <span className="text-gray-900 font-medium">{gig.category}</span>
                </li>
              </ol>
            </nav>

            {/* Title and Actions */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {gig.title}
                </h1>
                
                {/* Seller Info */}
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={gig.seller?.avatar || '/default-avatar.png'}
                    alt={gig.seller?.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <Link
                      to={`/profile/${gig.seller?._id}`}
                      className="font-semibold text-gray-900 hover:text-blue-600"
                    >
                      {gig.seller?.name}
                    </Link>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiStar className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>{gig.rating?.toFixed(1) || '5.0'}</span>
                      </div>
                      <span>•</span>
                      <span>{gig.reviewCount || 0} reviews</span>
                      <span>•</span>
                      <span>{gig.ordersInQueue || 0} in queue</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                  <FiHeart className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <FiShare2 className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                  <FiFlag className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {gig.images && gig.images.length > 0 ? (
                <div>
                  <img
                    src={gig.images[currentImageIndex]}
                    alt={gig.title}
                    className="w-full h-96 object-cover"
                  />
                  {gig.images.length > 1 && (
                    <div className="p-4 flex space-x-2 overflow-x-auto">
                      {gig.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            currentImageIndex === index
                              ? 'border-blue-600'
                              : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image}
                            alt={`${gig.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold">
                    {gig.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                About this gig
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {showFullDescription 
                    ? gig.description 
                    : `${gig.description?.substring(0, 300)}${gig.description?.length > 300 ? '...' : ''}`
                  }
                </p>
                {gig.description?.length > 300 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:text-blue-700 font-medium mt-2"
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Reviews ({gig.reviewCount || 0})
                </h2>
                <div className="flex items-center">
                  <FiStar className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-semibold">{gig.rating?.toFixed(1) || '5.0'}</span>
                </div>
              </div>

              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-start space-x-4">
                        <img
                          src={review.buyer?.avatar || '/default-avatar.png'}
                          alt={review.buyer?.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {review.buyer?.name}
                              </h4>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reviews yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Pricing */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {/* Package Selection */}
                {gig.pricing && (
                  <div className="mb-6">
                    <div className="flex border-b border-gray-200">
                      {Object.keys(gig.pricing).map((packageType) => (
                        <button
                          key={packageType}
                          onClick={() => setSelectedPackage(packageType)}
                          className={`flex-1 py-3 px-4 text-sm font-medium capitalize ${
                            selectedPackage === packageType
                              ? 'border-b-2 border-blue-600 text-blue-600'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          {packageType}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Package Details */}
                {currentPackage && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ${currentPackage.price}
                      </span>
                      <div className="flex items-center text-sm text-gray-600">
                        <FiClock className="w-4 h-4 mr-1" />
                        <span>{currentPackage.deliveryTime} days delivery</span>
                      </div>
                    </div>

                    <p className="text-gray-700">{currentPackage.description}</p>

                    {/* Features */}
                    <div className="space-y-2">
                      {currentPackage.features?.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <FiCheck className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Revisions */}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Revisions:</span>
                      <span className="font-medium">
                        {currentPackage.revisions === -1 ? 'Unlimited' : currentPackage.revisions}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3 pt-4">
                      <button
                        onClick={handleOrderNow}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Continue (${currentPackage.price})
                      </button>
                      
                      <button
                        onClick={handleContactSeller}
                        className="w-full py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Contact Seller
                      </button>
                    </div>
                  </div>
                )}

                {/* Seller Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">About the seller</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Response time:</span>
                      <span className="text-sm font-medium">1 hour</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last delivery:</span>
                      <span className="text-sm font-medium">1 day</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Orders completed:</span>
                      <span className="text-sm font-medium">{gig.seller?.completedOrders || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigDetail;
