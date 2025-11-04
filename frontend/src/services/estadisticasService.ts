import { normalizeAxiosError } from 'src/error/apiError';
import { TipoAccidenteTopType } from 'src/types/types';
import axiosInstance from './axiosInstance';

export const getTipoAccidenteTop = async (
  range?: 'day' | 'week' | 'month',
): Promise<{ type: string | null; amount: number }> => {
  try {
    const response = await axiosInstance.get<{ type: string | null; amount: number }>(
      '/statistics/accident-type-top',
      {
        params: { range },
      },
    );
    return response.data;
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};

export const getTotalAccidents = async (
  range?: 'day' | 'week' | 'month',
): Promise<TipoAccidenteTopType> => {
  try {
    const response = await axiosInstance.get('/statistics/total-accidents', {
      params: { range },
    });
    return response.data;
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};

export const getTopZone = async (
  range?: 'day' | 'week' | 'month',
): Promise<{ zone: string | null; amount: number }> => {
  try {
    const response = await axiosInstance.get<{ zone: string | null; amount: number }>(
      '/statistics/zone-top',
      {
        params: { range },
      },
    );
    return response.data;
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};
