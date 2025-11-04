import { isAxiosError } from 'axios';

export type ApiError = {
  status?: number;
  message: string;
  details?: any;
};

export function normalizeAxiosError(err: unknown): ApiError {
  if (isAxiosError(err) && err.response) {
    return {
      status: err.response.status,
      message: err.response.data?.message || err.response.data?.title || 'Ocurrió un error',
      details: err.response.data,
    };
  }
  return { message: 'No se pudo conectar con el servidor', details: err };
}
