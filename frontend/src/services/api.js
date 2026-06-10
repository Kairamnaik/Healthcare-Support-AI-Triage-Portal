import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

// Request interceptor to add JWT token if exists
API.interceptors.request.use(
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

// Patient API requests
export const submitRequest = (data) => API.post('/patients', data);
export const getRequests = (params) => API.get('/patients', { params });
export const getRequestDetails = (id) => API.get(`/patients/${id}`);
export const updateRequestStatus = (id, status) => API.put(`/patients/${id}`, { status });
export const deleteRequest = (id) => API.delete(`/patients/${id}`);

// Admin Auth API requests
export const adminLogin = (email, password) => API.post('/auth/login', { email, password });
export const adminRegister = (email, password) => API.post('/auth/register', { email, password });

export default API;
