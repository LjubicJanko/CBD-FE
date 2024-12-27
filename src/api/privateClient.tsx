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

privateClient.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized error
    if (error.response?.status === 498) {
      console.error('Token expired or unauthorized access');

      localStorageService.clearData();
    }

    return Promise.reject(error);
  }
);

export default privateClient;
