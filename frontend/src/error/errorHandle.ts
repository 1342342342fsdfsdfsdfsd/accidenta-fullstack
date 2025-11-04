// errorHandler.ts
import { ApiError } from './apiError';

export function handleApiError(error: ApiError) {
  switch (error.status) {
    case 400:
      alert('Datos inválidos: ' + error.message);
      break;
    case 401:
      alert('No autorizado, inicia sesión de nuevo');
      break;
    case 404:
      alert('Recurso no encontrado');
      break;
    case 500:
      alert('Error interno, intenta más tarde');
      break;
    default:
      alert(error.message);
  }
}
