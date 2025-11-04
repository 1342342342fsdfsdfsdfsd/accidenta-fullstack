import { normalizeAxiosError } from 'src/error/apiError';
import axiosInstance from './axiosInstance';

export const fetchCreatedReports = async (lastId?: string) => {
  try {
    const response = await axiosInstance.get('reports', { params: { lastId } });
    // console.log(response.data.items, 'DATAAAAAAAAAAAAAAAAAA');
    return response.data;
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};

export const fetchReportsWhereUserIsInvolved = async (lastId?: string) => {
  try {
    const response = await axiosInstance.get('reports/involved', { params: { lastId } });
    return response.data;
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};

export const createAccidentReport = async (reporteData: any) => {
  try {
    const response = await axiosInstance.post('reports', reporteData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};

export const createUrgenciaReport = async (direccion: string | null) => {
  try {
    const response = await axiosInstance.post(
      'reports/urgencia',
      { ubicacion: direccion || 'desconocida' },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};
