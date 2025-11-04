import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeAxiosError } from 'src/error/apiError';
import axiosInstance from './axiosInstance';

export const login = async (loginData: any) => {
  try {
    const response = await axiosInstance.post('auth/login', loginData, {
      headers: { 'Content-Type': 'application/json' },
    });

    const token = response.headers['authorization'];

    if (token) await AsyncStorage.setItem('token', token);

    return response.data;
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};

export const register = async (registerData: any) => {
  try {
    const response = await axiosInstance.post('auth/register', registerData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (err: unknown) {
    console.log(err, 'ERR');
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};
