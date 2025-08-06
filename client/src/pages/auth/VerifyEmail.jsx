import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../context/authStore';
import { FiCheck, FiX, FiLoader, FiMail } from 'react-icons/fi';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuthStore();

  useEffect(() => {
    if (token) {
      handleVerification();
    } else {
      setStatus('error');
      setMessage('Invalid verification token');
    }
  }, [token]);

  const handleVerification = async () => {
    try {
      const result = await verifyEmail(token);
      
      if (result.success) {
        setStatus('success');
        setMessage('Your email has been successfully verified!');
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.error || 'Email verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred during verification');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        return <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />;
      case 'success':
        return <FiCheck className="w-8 h-8 text-green-600" />;
      case 'error':
        return <FiX className="w-8 h-8 text-red-600" />;
      default:
        return <FiMail className="w-8 h-8 text-gray-600" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'verifying':
        return 'bg-blue-100';
      case 'success':
        return 'bg-green-100';
      case 'error':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  const getTitle = () => {
    switch (status) {
      case 'verifying':
        return 'Verifying your email...';
      case 'success':
        return 'Email verified successfully!';
      case 'error':
        return 'Verification failed';
      default:
        return 'Email verification';
    }
  };

  const getDescription = () => {
    switch (status) {
      case 'verifying':
        return 'Please wait while we verify your email address.';
      case 'success':
        return 'Your email has been verified. You can now access all features of your account.';
      case 'error':
        return message || 'We were unable to verify your email address.';
      default:
        return 'Verifying your email address...';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">FreelanceHub</span>
          </Link>

          {/* Status Icon */}
          <div className={`w-16 h-16 ${getStatusColor()} rounded-full flex items-center justify-center mx-auto mb-6`}>
            {getStatusIcon()}
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {getTitle()}
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-8">
            {getDescription()}
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            {status === 'success' && (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Redirecting to your dashboard in 3 seconds...
                </p>
                <Link
                  to="/dashboard"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/"
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Back to Home
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <button
                  onClick={handleVerification}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Try Again
                </button>
                <Link
                  to="/login"
                  className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Back to Sign In
                </Link>
              </>
            )}

            {status === 'verifying' && (
              <div className="flex justify-center">
                <div className="text-sm text-gray-500">
                  This may take a few moments...
                </div>
              </div>
            )}
          </div>

          {/* Help Text */}
          {status === 'error' && (
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-900 mb-2">
                Need help?
              </h3>
              <p className="text-sm text-yellow-700">
                If you continue to have issues verifying your email, please{' '}
                <Link to="/contact" className="underline hover:no-underline">
                  contact our support team
                </Link>{' '}
                for assistance.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                What's next?
              </h3>
              <p className="text-sm text-blue-700">
                Now that your email is verified, you can:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Complete your profile setup</li>
                <li>• Browse and purchase services</li>
                <li>• Start selling your own services</li>
                <li>• Connect with other freelancers</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
