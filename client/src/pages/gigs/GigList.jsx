import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { gigAPI } from '../../services/api';
import { sampleDataService } from '../../services/sampleDataService';
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiHeart,
  FiGrid,
  FiList,
  FiChevronDown,
  FiX,
  FiMapPin,
  FiClock
} from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import SkeletonLoader from '../../components/ui/SkeletonLoader';

const GigList = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');
  const [deliveryTime, setDeliveryTime] = useState(searchParams.get('delivery') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGigs, setTotalGigs] = useState(0);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'graphics-design', label: 'Graphics & Design' },
    { value: 'digital-marketing', label: 'Digital Marketing' },
    { value: 'writing-translation', label: 'Writing & Translation' },
    { value: 'video-animation', label: 'Video & Animation' },
    { value: 'music-audio', label: 'Music & Audio' },
    { value: 'programming-tech', label: 'Programming & Tech' },
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'rating', label: 'Best Rating' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
  ];

  useEffect(() => {
    fetchGigs();
  }, [searchParams, currentPage]);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchQuery,
        category: selectedCategory,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        sort: sortBy,
        delivery: deliveryTime,
        rating: rating,
        page: currentPage,
        limit: 12,
      };

      // Remove empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });

      // Use sample data service for now
      const response = sampleDataService.getGigs(params);
      setGigs(response.gigs || []);
      setTotalPages(response.totalPages || 1);
      setTotalGigs(response.total || 0);
    } catch (error) {
      console.error('Error fetching gigs:', error);
      setGigs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateSearchParams({ search: searchQuery, page: 1 });
  };

  const updateSearchParams = (newParams) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    setSearchParams(params);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setSortBy('relevance');
    setDeliveryTime('');
    setRating('');
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for services..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      updateSearchParams({ category: e.target.value });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={() => updateSearchParams({ minPrice: priceRange.min, maxPrice: priceRange.max })}
                    className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Apply
                  </button>
                </div>

                {/* Delivery Time Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Time
                  </label>
                  <select
                    value={deliveryTime}
                    onChange={(e) => {
                      setDeliveryTime(e.target.value);
                      updateSearchParams({ delivery: e.target.value });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Any time</option>
                    <option value="1">Express 24H</option>
                    <option value="3">Up to 3 days</option>
                    <option value="7">Up to 1 week</option>
                    <option value="30">Up to 1 month</option>
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seller Rating
                  </label>
                  <div className="space-y-2">
                    {[5, 4, 3].map((stars) => (
                      <label key={stars} className="flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          value={stars}
                          checked={rating === stars.toString()}
                          onChange={(e) => {
                            setRating(e.target.value);
                            updateSearchParams({ rating: e.target.value });
                          }}
                          className="mr-2"
                        />
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-4 h-4 ${
                                i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">& up</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Results for "${searchQuery}"` : 'All Services'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {totalGigs} services available
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    updateSearchParams({ sort: e.target.value });
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                {/* View Mode Toggle */}
                <div className="flex border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${
                      viewMode === 'grid'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${
                      viewMode === 'list'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <SkeletonLoader type="gig" count={12} viewMode={viewMode} />
            ) : (
              <>
                {/* Gigs Grid/List */}
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                    : 'space-y-6'
                }`}>
                  {gigs.map((gig) => (
                    <GigCard key={gig._id} gig={gig} viewMode={viewMode} />
                  ))}
                </div>

                {/* Empty State */}
                {gigs.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No services found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your search criteria or browse different categories
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 border rounded-lg ${
                              currentPage === page
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Gig Card Component
const GigCard = ({ gig, viewMode }) => {
  return (
    <Link
      to={`/gigs/${gig.slug}`}
      className={`group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fadeInUp ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
        {gig.images?.[0] ? (
          <img
            src={gig.images[0]}
            alt={gig.title}
            className={`w-full object-cover group-hover:scale-110 transition-transform duration-500 ${
              viewMode === 'list' ? 'h-full' : 'h-48'
            }`}
          />
        ) : (
          <div className={`w-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${
            viewMode === 'list' ? 'h-full' : 'h-48'
          }`}>
            <span className="text-white text-2xl font-bold">
              {gig.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {gig.featured && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
              ⭐ Featured
            </span>
          </div>
        )}

        {/* Heart Icon */}
        <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 rounded-full text-gray-400 hover:text-red-500 hover:bg-white transition-all duration-300 opacity-0 group-hover:opacity-100">
          <FiHeart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 flex-1">
        <div className="mb-3">
          <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors text-lg leading-tight">
            {gig.title}
          </h3>
        </div>

        <div className="flex items-center mb-3">
          <img
            src={gig.seller?.avatar || '/default-avatar.png'}
            alt={gig.seller?.name}
            className="w-8 h-8 rounded-full mr-3 border-2 border-gray-100"
          />
          <div>
            <span className="text-sm font-medium text-gray-700">{gig.seller?.name}</span>
            <div className="flex items-center text-xs text-gray-500">
              <FiMapPin className="w-3 h-3 mr-1" />
              <span>{gig.seller?.location || 'Global'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(gig.rating) ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2 font-medium">
              {gig.rating?.toFixed(1) || '5.0'} ({gig.reviewCount || 0})
            </span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <FiClock className="w-4 h-4 mr-1" />
            <span>{gig.deliveryTime || 3} days</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Starting at</span>
            <div className="text-xl font-bold text-gray-900">
              ${gig.pricing?.basic?.price || gig.startingPrice}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GigList;
