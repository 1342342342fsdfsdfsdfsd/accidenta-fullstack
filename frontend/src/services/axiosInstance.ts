import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const baseURL = API_BASE_URL;

const axiosInstance = axios.create({ baseURL, timeout: 5000 });

// NO TOCAR
axiosInstance.interceptors.request.use(
  (config) => {
    return AsyncStorage.getItem('token')
      .then((token) => {
        config.headers = config.headers || {};
        if (token) {
          config.headers.Authorization = token;
        }
        return config;
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
