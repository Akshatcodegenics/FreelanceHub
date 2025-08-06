import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import api from '../services/api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      isAuthenticated: false,

      // Login action
      login: async (credentials) => {
        try {
          set({ loading: true });
          const response = await api.post('/auth/login', credentials);

          const { user, token } = response.data;

          // Store token in localStorage and set axios default header
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });

          toast.success('Login successful!');
          return { success: true };
        } catch (error) {
          set({ loading: false });
          console.error('Login error:', error);

          let message = 'Login failed';

          if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            message = 'Unable to connect to server. Please check if the server is running.';
          } else if (error.response?.data?.message) {
            message = error.response.data.message;
          } else if (error.message) {
            message = error.message;
          }

          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Register action
      register: async (userData) => {
        try {
          set({ loading: true });
          const response = await api.post('/auth/register', userData);

          const { user, token } = response.data;

          // Store token in localStorage and set axios default header
          localStorage.setItem('token', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });

          toast.success('Registration successful!');
          return { success: true };
        } catch (error) {
          set({ loading: false });
          console.error('Registration error:', error);

          let message = 'Registration failed';

          if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            message = 'Unable to connect to server. Please check if the server is running.';
          } else if (error.response?.data?.message) {
            message = error.response.data.message;
          } else if (error.message) {
            message = error.message;
          }

          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Logout action
      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear local storage and reset state
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
          
          toast.success('Logged out successfully');
        }
      },

      // Check authentication status
      checkAuth: async () => {
        try {
          set({ loading: true });

          const token = localStorage.getItem('token');

          if (!token) {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
              loading: false
            });
            return;
          }

          // For demo purposes, skip backend verification
          // In production, this would verify with the backend
          console.log('Demo mode: Skipping backend auth verification');

          // Set token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Mock user data for demo
          const mockUser = {
            _id: 'demo-user',
            name: 'Demo User',
            email: 'demo@freelancehub.com',
            role: 'client',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          };

          set({
            user: mockUser,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          console.error('Auth check failed:', error);

          // Clear invalid token
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];

          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
          });
        }
      },

      // Update user profile
      updateProfile: async (profileData) => {
        try {
          set({ loading: true });
          const response = await api.put('/auth/update-details', profileData);
          
          const { user } = response.data;
          
          set({
            user,
            loading: false,
          });
          
          toast.success('Profile updated successfully!');
          return { success: true };
        } catch (error) {
          set({ loading: false });
          const message = error.response?.data?.message || 'Profile update failed';
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Change password
      changePassword: async (passwordData) => {
        try {
          set({ loading: true });
          await api.put('/auth/update-password', passwordData);
          
          set({ loading: false });
          toast.success('Password updated successfully!');
          return { success: true };
        } catch (error) {
          set({ loading: false });
          const message = error.response?.data?.message || 'Password update failed';
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Forgot password
      forgotPassword: async (email) => {
        try {
          set({ loading: true });
          await api.post('/auth/forgot-password', { email });
          
          set({ loading: false });
          toast.success('Password reset email sent!');
          return { success: true };
        } catch (error) {
          set({ loading: false });
          const message = error.response?.data?.message || 'Failed to send reset email';
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Reset password
      resetPassword: async (token, password) => {
        try {
          set({ loading: true });
          await api.put(`/auth/reset-password/${token}`, { password });
          
          set({ loading: false });
          toast.success('Password reset successful!');
          return { success: true };
        } catch (error) {
          set({ loading: false });
          const message = error.response?.data?.message || 'Password reset failed';
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Verify email
      verifyEmail: async (token) => {
        try {
          set({ loading: true });
          await api.get(`/auth/verify/${token}`);
          
          // Update user's email verification status
          const currentUser = get().user;
          if (currentUser) {
            set({
              user: { ...currentUser, isEmailVerified: true },
              loading: false,
            });
          } else {
            set({ loading: false });
          }
          
          toast.success('Email verified successfully!');
          return { success: true };
        } catch (error) {
          set({ loading: false });
          const message = error.response?.data?.message || 'Email verification failed';
          toast.error(message);
          return { success: false, error: message };
        }
      },

      // Clear errors
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export { useAuthStore };
