import axios, { AxiosHeaders } from 'axios';
import localStorageService from '../services/localStorage.service';

const API_URL = import.meta.env.VITE_API_URL;

const privateClient = axios.create({
  baseURL: `${API_URL}/api`,
});

privateClient.interceptors.request.use(
  (config) => {
    if (localStorageService.token) {
      if (!config.headers) config.headers = new AxiosHeaders();
      config.headers.set(
        'Authorization',
        `Bearer ${localStorageService.token}`
      ); 
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default privateClient;
