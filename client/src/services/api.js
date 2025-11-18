import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

export const analyzeChannel = async (channelId) => {
  const { data } = await api.post('/analyze/channel', { channelId });
  return data;
};

export const fetchHistory = async () => {
  const { data } = await api.get('/history');
  return data;
};

export default api;

