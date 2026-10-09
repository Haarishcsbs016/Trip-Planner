import axios from 'axios';
import { useAuthStore } from '../store/tripStore';

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api') && !url.includes('/api/')) {
    url = `${url}/api`;
  }
  return url;
};

const API_URL = getBaseURL();

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor – attach token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token || localStorage.getItem('tripplanner_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRedirecting = false;

// Response interceptor – handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (!isRedirecting && !window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        isRedirecting = true;
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
};

// ─── Trips ───
export const tripsAPI = {
  create: (data) => api.post('/trips', data),
  getAll: (params) => api.get('/trips', { params }),
  getOne: (id) => api.get(`/trips/${id}`),
  update: (id, data) => api.put(`/trips/${id}`, data),
  delete: (id) => api.delete(`/trips/${id}`),
  generate: (id) => api.post(`/trips/${id}/generate`),
  regenerate: (id, instruction) => api.post(`/trips/${id}/regenerate`, { instruction }),
  share: (id) => api.post(`/trips/${id}/share`),
  save: (id) => api.put(`/trips/${id}/save`),
  getShared: (shareId) => api.get(`/shared/${shareId}`),
  getHotels: (params) => api.get('/trips/hotels', { params }),
  getDistance: (data) => api.post('/trips/distance', data),
};

// ─── User ───
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

export default api;
