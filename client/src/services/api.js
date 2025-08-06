import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      console.error('Network Error: Unable to connect to server');
      error.message = 'Unable to connect to server. Please check if the server is running.';
      return Promise.reject(error);
    }

    const { response } = error;

    if (response) {
      const { status, data } = response;
      
      switch (status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          
          // Only show toast if not already on login page
          if (!window.location.pathname.includes('/login')) {
            toast.error('Session expired. Please login again.');
            window.location.href = '/login';
          }
          break;
          
        case 403:
          toast.error('Access denied. You do not have permission to perform this action.');
          break;
          
        case 404:
          toast.error('Resource not found.');
          break;
          
        case 422:
          // Validation errors
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach(err => toast.error(err));
          } else if (data.message) {
            toast.error(data.message);
          }
          break;
          
        case 429:
          toast.error('Too many requests. Please try again later.');
          break;
          
        case 500:
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          if (data.message) {
            toast.error(data.message);
          } else {
            toast.error('An unexpected error occurred.');
          }
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Other error
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/update-details', data),
  changePassword: (data) => api.put('/auth/update-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify/${token}`),
};

export const gigAPI = {
  getAll: (params) => api.get('/gigs', { params }),
  getById: (id) => api.get(`/gigs/${id}`),
  create: (data) => api.post('/gigs', data),
  update: (id, data) => api.put(`/gigs/${id}`, data),
  delete: (id) => api.delete(`/gigs/${id}`),
  search: (query, filters) => api.get('/gigs/search', { params: { q: query, ...filters } }),
  getByCategory: (category, subcategory) => api.get(`/gigs/category/${category}`, { params: { subcategory } }),
  getMyGigs: () => api.get('/gigs/my-gigs'),
};

export const orderAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  requestRevision: (id, reason) => api.post(`/orders/${id}/revision`, { reason }),
  deliverWork: (id, work) => api.post(`/orders/${id}/deliver`, { work }),
  complete: (id) => api.put(`/orders/${id}/complete`),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
  getMyOrders: (role) => api.get('/orders/my-orders', { params: { role } }),
};

export const reviewAPI = {
  getByGig: (gigId, params) => api.get(`/reviews/gig/${gigId}`, { params }),
  getBySeller: (sellerId, params) => api.get(`/reviews/seller/${sellerId}`, { params }),
  create: (data) => api.post('/reviews', data),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  delete: (id) => api.delete(`/reviews/${id}`),
  markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
  flag: (id, reason) => api.post(`/reviews/${id}/flag`, { reason }),
  respond: (id, response) => api.post(`/reviews/${id}/respond`, { response }),
};

export const messageAPI = {
  getConversations: (params) => api.get('/messages/conversations', { params }),
  getConversation: (id) => api.get(`/messages/conversations/${id}`),
  getMessages: (conversationId, params) => api.get(`/messages/conversations/${conversationId}/messages`, { params }),
  sendMessage: (conversationId, data) => api.post(`/messages/conversations/${conversationId}/messages`, data),
  sendFile: (conversationId, formData) => api.post(`/messages/conversations/${conversationId}/files`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  sendVoiceMessage: (conversationId, formData) => api.post(`/messages/conversations/${conversationId}/voice`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  sendPaymentRequest: (conversationId, data) => api.post(`/messages/conversations/${conversationId}/payment-request`, data),
  markAsRead: (conversationId) => api.put(`/messages/conversations/${conversationId}/read`),
  editMessage: (messageId, data) => api.put(`/messages/${messageId}`, data),
  deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
  flagMessage: (messageId, reason) => api.post(`/messages/${messageId}/flag`, { reason }),
  translateMessage: (messageId, targetLanguage) => api.post(`/messages/${messageId}/translate`, { targetLanguage }),
  summarizeConversation: (conversationId) => api.post(`/messages/conversations/${conversationId}/summarize`),
  createConversation: (data) => api.post('/messages/conversations', data),
};

export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: (publicId) => api.delete(`/upload/image/${publicId}`),
};

export const userAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getStats: () => api.get('/users/stats'),
  getNotifications: () => api.get('/users/notifications'),
  markNotificationRead: (id) => api.put(`/users/notifications/${id}/read`),
};

export default api;
