import api from './api';

// Set up request interceptor to add auth token
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

// Set up response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid token from localStorage
      localStorage.removeItem('token');
      
      // Only redirect for specific auth endpoints that require user action
      // Don't redirect for background checks like /auth/me
      const redirectEndpoints = ['/auth/login', '/auth/register', '/auth/profile', '/auth/change-password'];
      const shouldRedirect = redirectEndpoints.some(endpoint => error.config?.url?.includes(endpoint));
      
      if (shouldRedirect) {
        // Only redirect to login if we're not already on public pages
        const currentPath = window.location.pathname;
        const publicPaths = ['/', '/login', '/signup'];
        if (!publicPaths.includes(currentPath)) {
          window.location.href = '/login';
        }
      }
      // For other endpoints (including /auth/me), just clean up token but don't redirect
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};

export const changePassword = async (passwordData) => {
  const response = await api.put('/auth/change-password', passwordData);
  return response.data;
};

export default {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword
};
