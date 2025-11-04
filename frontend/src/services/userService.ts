import { normalizeAxiosError } from 'src/error/apiError';
import axiosInstance from './axiosInstance';

export const getUser = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

interface TrustedContact {
  nombre: string;
  mail: string;
}

export const getTrustedContacts = async () => {
  try {
    const response = await axiosInstance.get('users/contactos');

    return response.data;
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};

export const addTrustedContact = async (trustedContactData: TrustedContact) => {
  try {
    const response = await axiosInstance.post('users/contactos', trustedContactData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};

export const removeTrustedContact = async (contactId: string) => {
  try {
    const response = await axiosInstance.delete(`users/contactos/${contactId}`);

    return response.data;
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};

export const editTrustedContact = async (contactId: string, trustedContactData: TrustedContact) => {
  try {
    const response = await axiosInstance.put(`users/contactos/${contactId}`, trustedContactData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};

// ---------------------------------------------
// 🩺 DATOS DE SALUD
// ---------------------------------------------

interface HealthData {
  grupoSanguineo: string;
  altura: string;
  peso: string;
  patologias: string[];
  medicacion: string[];
  sexo: string;
  alergias: string[];
}

export const getHealthData = async () => {
  try {
    const response = await axiosInstance.get('/users/datosSalud');
    return response.data.datoDeSalud; // Si no hay datos, devolvemos null
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    if (normalizedError?.status === 404) return null;
    throw normalizedError;
  }
};

export const addHealthData = async (healthData: HealthData) => {
  try {
    const response = await axiosInstance.post('users/datosSalud', healthData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};
export const updateHealthData = async (healthData: Partial<HealthData>) => {
  try {
    const response = await axiosInstance.patch('users/datosSalud', healthData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (err: unknown) {
    const normalizedError = normalizeAxiosError(err);
    throw normalizedError;
  }
};
