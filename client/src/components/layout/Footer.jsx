import { Link } from 'react-router-dom';
import { 
  FiTwitter, 
  FiFacebook, 
  FiInstagram, 
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    categories: [
      { name: 'Graphics & Design', href: '/gigs?category=graphics-design' },
      { name: 'Digital Marketing', href: '/gigs?category=digital-marketing' },
      { name: 'Writing & Translation', href: '/gigs?category=writing-translation' },
      { name: 'Video & Animation', href: '/gigs?category=video-animation' },
      { name: 'Music & Audio', href: '/gigs?category=music-audio' },
      { name: 'Programming & Tech', href: '/gigs?category=programming-tech' },
    ],
    about: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press & News', href: '/press' },
      { name: 'Partnerships', href: '/partnerships' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    support: [
      { name: 'Help & Support', href: '/help' },
      { name: 'Trust & Safety', href: '/safety' },
      { name: 'Selling on FreelanceHub', href: '/selling-guide' },
      { name: 'Buying on FreelanceHub', href: '/buying-guide' },
      { name: 'Community', href: '/community' },
      { name: 'Contact Us', href: '/contact' },
    ],
    community: [
      { name: 'Customer Success Stories', href: '/success-stories' },
      { name: 'Community Hub', href: '/community-hub' },
      { name: 'Forum', href: '/forum' },
      { name: 'Events', href: '/events' },
      { name: 'Blog', href: '/blog' },
      { name: 'Influencers', href: '/influencers' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', icon: FiTwitter, href: 'https://twitter.com/freelancehub' },
    { name: 'Facebook', icon: FiFacebook, href: 'https://facebook.com/freelancehub' },
    { name: 'Instagram', icon: FiInstagram, href: 'https://instagram.com/freelancehub' },
    { name: 'LinkedIn', icon: FiLinkedin, href: 'https://linkedin.com/company/freelancehub' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-xl font-bold">FreelanceHub</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              The world's largest marketplace for creative and professional services. 
              Connect with talented freelancers and grow your business.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4" />
                <span>support@freelancehub.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiPhone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to our newsletter for the latest updates and opportunities.
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} FreelanceHub. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Follow us:</span>
              <div className="flex space-x-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Language/Currency Selector */}
            <div className="flex items-center space-x-4 text-sm">
              <select className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-gray-400 focus:ring-2 focus:ring-blue-500">
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
              <select className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-gray-400 focus:ring-2 focus:ring-blue-500">
                <option value="usd">USD</option>
                <option value="eur">EUR</option>
                <option value="gbp">GBP</option>
                <option value="cad">CAD</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
