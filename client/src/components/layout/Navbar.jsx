import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { 
  FiSearch, 
  FiMenu, 
  FiX, 
  FiUser, 
  FiSettings, 
  FiLogOut,
  FiMessageSquare,
  FiShoppingBag,
  FiPlus
} from 'react-icons/fi';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gigs?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold text-gray-900">FreelanceHub</span>
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for services..."
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/gigs"
              className={`text-sm font-medium transition-colors ${
                isActive('/gigs') 
                  ? 'text-blue-600' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Browse Gigs
            </Link>

            {isAuthenticated ? (
              <>
                {/* Authenticated User Menu */}
                <Link
                  to="/messages"
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FiMessageSquare className="w-5 h-5" />
                </Link>

                <Link
                  to="/orders"
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <FiShoppingBag className="w-5 h-5" />
                </Link>

                {user?.role === 'freelancer' && (
                  <Link
                    to="/gigs/create"
                    className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                    <span>Create Gig</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <FiUser className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name?.split(' ')[0]}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiUser className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiSettings className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Guest User Menu */}
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Join
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6" />
              ) : (
                <FiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for services..."
                  className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                to="/gigs"
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Browse Gigs
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/messages"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Messages
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Profile Settings
                  </Link>
                  {user?.role === 'freelancer' && (
                    <Link
                      to="/gigs/create"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Gig
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Join
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay for profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
