import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  updatePassword: (data) => api.put('/auth/password', data),
  getMe: () => api.get('/auth/me')
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStores: (params) => api.get('/admin/stores', { params }),
  createStore: (data) => api.post('/admin/stores', data),
  getUsers: (params) => api.get('/admin/users', { params }),
  createUser: (data) => api.post('/admin/users', data),
  getUserDetails: (id) => api.get(`/admin/users/${id}`)
};

export const userAPI = {
  getStores: (params) => api.get('/user/stores', { params }),
  submitRating: (data) => api.post('/user/ratings', data),
  deleteRating: (storeId) => api.delete(`/user/ratings/${storeId}`)
};

export const storeOwnerAPI = {
  getDashboard: () => api.get('/store-owner/dashboard'),
  getStore: () => api.get('/store-owner/store')
};

export default api;