import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
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
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
};

// Cars API
export const carsAPI = {
  getAllCars: (params = {}) => api.get('/cars', { params }),
  getCarById: (id) => api.get(`/cars/${id}`),
  createCar: (carData) => {
    const formData = new FormData();
    Object.keys(carData).forEach(key => {
      if (key === 'features' && Array.isArray(carData[key])) {
        carData[key].forEach(feature => formData.append('features', feature));
      } else {
        formData.append(key, carData[key]);
      }
    });
    return api.post('/cars', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateCar: (id, carData) => {
    const formData = new FormData();
    Object.keys(carData).forEach(key => {
      if (key === 'features' && Array.isArray(carData[key])) {
        carData[key].forEach(feature => formData.append('features', feature));
      } else {
        formData.append(key, carData[key]);
      }
    });
    return api.put(`/cars/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteCar: (id) => api.delete(`/cars/${id}`),
  getAdminCars: (params = {}) => api.get('/cars/admin/all', { params }),
};

// Requests API
export const requestsAPI = {
  createRequest: (requestData) => api.post('/requests', requestData),
  getMyRequests: () => api.get('/requests/my-requests'),
  getAllRequests: (params = {}) => api.get('/requests/admin/all', { params }),
  updateRequestStatus: (id, statusData) => api.put(`/requests/${id}/status`, statusData),
  getRequestById: (id) => api.get(`/requests/${id}`),
  deleteRequest: (id) => api.delete(`/requests/${id}`),
  getRequestStats: () => api.get('/requests/admin/stats'),
};

// Utility function to get image URL
export const getImageUrl = (imageName) => {
  if (!imageName || imageName === 'default-car.jpg') {
    return '/images/default-car.jpg';
  }
  return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${imageName}`;
};

export default api;