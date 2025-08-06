import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../context/authStore';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiLoader } from 'react-icons/fi';

// Validation schema
const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Full name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  role: z.enum(['client', 'freelancer'], {
    required_error: 'Please select your role',
  }),
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'You must agree to the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, loading } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const defaultRole = searchParams.get('role') || 'client';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: defaultRole,
    },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data) => {
    const { confirmPassword, agreeToTerms, ...userData } = data;
    
    const result = await registerUser(userData);
    
    if (result.success) {
      navigate('/');
    } else {
      // Handle specific error cases
      if (result.error?.includes('email')) {
        setError('email', { message: result.error });
      } else {
        setError('root', { message: result.error });
      }
    }
  };

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
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join thousands of freelancers and clients
          </p>
        </div>

        {/* Registration Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Root Error */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.root.message}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I want to:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                  selectedRole === 'client' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}>
                  <input
                    {...register('role')}
                    type="radio"
                    value="client"
                    className="sr-only"
                  />
                  <div className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      Hire freelancers
                    </span>
                    <span className="block text-sm text-gray-500">
                      I'm a client
                    </span>
                  </div>
                  {selectedRole === 'client' && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </label>

                <label className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                  selectedRole === 'freelancer' 
                    ? 'border-blue-600 bg-blue-50' 
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}>
                  <input
                    {...register('role')}
                    type="radio"
                    value="freelancer"
                    className="sr-only"
                  />
                  <div className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      Work as freelancer
                    </span>
                    <span className="block text-sm text-gray-500">
                      I'm a freelancer
                    </span>
                  </div>
                  {selectedRole === 'freelancer' && (
                    <div className="absolute top-2 right-2 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Full Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('name')}
                  type="text"
                  autoComplete="name"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

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
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-300 bg-white'
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                {...register('agreeToTerms')}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreeToTerms" className="text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                  Privacy Policy
                </Link>
              </label>
              {errors.agreeToTerms && (
                <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms.message}</p>
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
                'Create Account'
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
