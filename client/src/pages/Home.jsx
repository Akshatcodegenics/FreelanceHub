import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../context/authStore';
import { gigAPI } from '../services/api';
import { sampleDataService } from '../services/sampleDataService';
import {
  FiSearch,
  FiStar,
  FiArrowRight,
  FiPlay,
  FiCheck,
  FiTrendingUp,
  FiUsers,
  FiAward,
  FiCode,
  FiPenTool,
  FiEdit,
  FiVideo,
  FiMusic,
  FiTarget
} from 'react-icons/fi';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home = () => {
  const [featuredGigs, setFeaturedGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();



  useEffect(() => {
    fetchFeaturedGigs();
  }, []);

  const fetchFeaturedGigs = async () => {
    try {
      // Use sample data service for now
      const featuredGigs = sampleDataService.getFeaturedGigs(8);
      setFeaturedGigs(featuredGigs);
    } catch (error) {
      console.error('Error fetching featured gigs:', error);
      // Set empty array as fallback
      setFeaturedGigs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gigs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categories = [
    {
      name: 'Graphics & Design',
      icon: <FiPenTool className="w-8 h-8" />,
      emoji: '🎨',
      description: 'Logo design, web design, print design',
      href: '/gigs?category=graphics-design',
      gigCount: '1,247+ services',
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Programming & Tech',
      icon: <FiCode className="w-8 h-8" />,
      emoji: '💻',
      description: 'Web development, mobile apps, software',
      href: '/gigs?category=programming-tech',
      gigCount: '892+ services',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Digital Marketing',
      icon: <FiTarget className="w-8 h-8" />,
      emoji: '📈',
      description: 'Social media, SEO, content marketing',
      href: '/gigs?category=digital-marketing',
      gigCount: '634+ services',
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Writing & Translation',
      icon: <FiEdit className="w-8 h-8" />,
      emoji: '✍️',
      description: 'Content writing, copywriting, translation',
      href: '/gigs?category=writing-translation',
      gigCount: '756+ services',
      color: 'from-purple-500 to-violet-500'
    },
    {
      name: 'Video & Animation',
      icon: <FiVideo className="w-8 h-8" />,
      emoji: '🎬',
      description: 'Video editing, animation, motion graphics',
      href: '/gigs?category=video-animation',
      gigCount: '423+ services',
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Music & Audio',
      icon: <FiMusic className="w-8 h-8" />,
      emoji: '🎵',
      description: 'Voice over, music production, audio editing',
      href: '/gigs?category=music-audio',
      gigCount: '298+ services',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const stats = [
    { icon: FiUsers, value: '2M+', label: 'Active Users' },
    { icon: FiTrendingUp, value: '500K+', label: 'Projects Completed' },
    { icon: FiAward, value: '99%', label: 'Customer Satisfaction' },
  ];

  const features = [
    {
      title: 'Find the perfect freelancer',
      description: 'Browse through thousands of talented professionals ready to help with your project.',
      icon: '🔍'
    },
    {
      title: 'Work with confidence',
      description: 'Our secure payment system ensures you only pay when you\'re 100% satisfied.',
      icon: '🛡️'
    },
    {
      title: 'Get work done fast',
      description: 'Most projects are completed within days, not weeks or months.',
      icon: '⚡'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white py-20 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-400 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-pink-400 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-32 right-1/3 w-14 h-14 bg-green-400 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fadeInUp">
              Find the perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 animate-slideInLeft">
                freelance services
              </span>
              for your business
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-fadeInUp animate-stagger-2">
              Connect with talented freelancers worldwide and get your projects done with quality and speed
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 animate-fadeInUp animate-stagger-3">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Try 'logo design' or 'website development'"
                  className="w-full px-6 py-4 text-lg text-gray-900 rounded-xl focus:ring-4 focus:ring-blue-300 focus:outline-none shadow-lg transition-all duration-300 group-hover:shadow-xl"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Popular Searches */}
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="text-blue-200">Popular:</span>
              {['Logo Design', 'WordPress', 'Voice Over', 'Video Editing', 'Translation'].map((term) => (
                <button
                  key={term}
                  onClick={() => navigate(`/gigs?search=${encodeURIComponent(term)}`)}
                  className="px-3 py-1 bg-blue-500 bg-opacity-30 rounded-full hover:bg-opacity-50 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explore our categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect service for your needs from our diverse range of categories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={category.href}
                className={`group relative p-8 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fadeInUp overflow-hidden`}
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <div className="text-3xl absolute -top-2 -right-2 opacity-20 group-hover:opacity-40 transition-opacity">
                    {category.emoji}
                  </div>
                </div>

                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 font-medium">{category.gigCount}</span>
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
                      <span className="text-sm">Explore</span>
                      <FiArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Gigs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover top-rated services from our most talented freelancers
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredGigs.slice(0, 8).map((gig) => (
                <Link
                  key={gig._id}
                  to={`/gigs/${gig.slug}`}
                  className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    {gig.images?.[0] ? (
                      <img
                        src={gig.images[0]}
                        alt={gig.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">
                          {gig.title.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {gig.title}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {gig.rating?.toFixed(1) || '5.0'} ({gig.reviewCount || 0})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        From ${gig.pricing?.basic?.price || gig.startingPrice}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/gigs"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Services
              <FiArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why choose FreelanceHub?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join millions of people who use FreelanceHub to turn their ideas into reality
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Join as a Client
                </Link>
                <Link
                  to="/register?role=freelancer"
                  className="px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors border border-blue-500"
                >
                  Become a Freelancer
                </Link>
              </>
            ) : (
              <Link
                to={user?.role === 'freelancer' ? '/dashboard/freelancer' : '/gigs'}
                className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                {user?.role === 'freelancer' ? 'Go to Dashboard' : 'Browse Services'}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
