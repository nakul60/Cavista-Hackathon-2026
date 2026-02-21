import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
};

export const consultationAPI = {
  create: (data) => api.post('/consultation', data),
  getAll: () => api.get('/consultation'),
  getById: (id) => api.get(`/consultation/${id}`),
  update: (id, data) => api.put(`/consultation/${id}`, data),
};

export const patientAPI = {
  getAll: () => api.get('/patient'),
  getById: (id) => api.get(`/patient/${id}`),
  create: (data) => api.post('/patient', data),
  update: (id, data) => api.put(`/patient/${id}`, data),
};

export default api;
