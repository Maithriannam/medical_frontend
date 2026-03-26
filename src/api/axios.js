import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  // If we had JWT, we'd add it here. The prompt specifies No JWT, use user.email for future APIs.
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  toast.error(error.response?.data?.message || 'Server connection error');
  return Promise.reject(error);
});

export default api;
