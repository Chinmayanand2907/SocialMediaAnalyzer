import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Enhanced error logging
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.config.url);
      error.message = 'Request timed out. The server is taking too long to respond.';
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network error:', error.message);
      error.message = 'Unable to connect to the server. Please check if the server is running.';
    } else if (error.response) {
      // Server responded with error status
      console.error('Server error:', error.response.status, error.response.data);
    } else {
      console.error('Request error:', error.message);
    }
    return Promise.reject(error);
  }
);

// Retry logic for network errors
const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      const isNetworkError = 
        error.code === 'ERR_NETWORK' || 
        error.message === 'Network Error' ||
        error.code === 'ECONNABORTED';
      
      if (isNetworkError && i < maxRetries - 1) {
        console.log(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
        continue;
      }
      throw error;
    }
  }
};

// Health check function
export const checkServerHealth = async () => {
  try {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    // Remove /api from baseURL to access root health endpoint
    const serverBaseURL = baseURL.replace('/api', '');
    const response = await axios.get(
      `${serverBaseURL}/health`,
      { timeout: 5000 }
    );
    return response.status === 200 && response.data?.status === 'ok';
  } catch (error) {
    console.error('Server health check failed:', error.message);
    return false;
  }
};

export const analyzeChannel = async (channelId) => {
  const requestFn = async () => {
    const { data } = await api.post('/analyze/channel', { channelId });
    return data;
  };
  
  return retryRequest(requestFn, 3, 1000);
};

export const fetchHistory = async () => {
  const requestFn = async () => {
    const { data } = await api.get('/history');
    return data;
  };
  
  return retryRequest(requestFn, 2, 500);
};

export default api;

