import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../context/authStore';
import { FiMail, FiLoader, FiArrowLeft, FiCheck } from 'react-icons/fi';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
});

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, loading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    const result = await forgotPassword(data.email);
    
    if (result.success) {
      setIsSubmitted(true);
    } else {
      setError('email', { message: result.error });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">FreelanceHub</span>
            </Link>
            
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Check your email
            </h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to{' '}
              <span className="font-medium text-gray-900">{getValues('email')}</span>
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Try another email
              </button>
              
              <Link
                to="/login"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">FreelanceHub</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* Forgot Password Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <FiLoader className="w-5 h-5 animate-spin" />
              ) : (
                'Send reset link'
              )}
            </button>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              <FiArrowLeft className="w-4 h-4 mr-1" />
              Back to sign in
            </Link>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Having trouble?
          </h3>
          <p className="text-sm text-blue-700">
            If you don't receive an email within a few minutes, please check your spam folder or{' '}
            <Link to="/contact" className="underline hover:no-underline">
              contact our support team
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
