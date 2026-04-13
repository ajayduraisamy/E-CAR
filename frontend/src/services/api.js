import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecar_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: (payload) => api.post('/api/auth/register', payload),
  login: (payload) => api.post('/api/auth/login', payload)
};

export const carService = {
  getCars: () => api.get('/api/cars'),
  getCarById: (id) => api.get(`/api/cars/${id}`),
  compareCars: (id1, id2) => api.get(`/api/cars/compare/${id1}/${id2}`),
  addCar: (formData) => api.post('/api/cars', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCar: (id) => api.delete(`/api/cars/${id}`)
};

export const marketService = {
  getListings: () => api.get('/api/market'),
  getUserListings: () => api.get('/api/market/user'),
  createListing: (formData) =>
    api.post('/api/market', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
};

export const orderService = {
  createOrder: (payload) => api.post('/api/order/create', payload),
  getUserOrders: () => api.get('/api/order/user')
};

export const paymentService = {
  payOrder: (payload) => api.post('/api/payment/pay', payload)
};

export default api;

