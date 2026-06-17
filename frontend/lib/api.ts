import axios from 'axios';

const resolvedBaseURL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: resolvedBaseURL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('finance_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('finance_token');
      localStorage.removeItem('finance_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
