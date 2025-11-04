import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ReactNode } from 'react';

export type RootTabParamList = {
  'Formulario de reporte': undefined;
  Reportes: undefined;
  Login: undefined;
  PerfilUserPrueba: { token: string };
};

export type TabProps<T extends keyof RootTabParamList> = BottomTabScreenProps<RootTabParamList, T>;

export type User = {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
  fechaNacimiento: string;
  imagen: string;
  lastReport: AccidentReportDTO | null;
  datoDeSalud: HealthDataDTO | null;
};

export type CreateAccidentReportDTO = {
  tipoAccidente: string;
  dni: string;
  ubicacion: string | null;
  descripcion: string;
  imagenes: string[];
};

export type AccidentReportDTO = {
  id: string;
  tipoAccidente: string;
  dni: string;
  ubicacion: string | null;
  descripcion: string;
  createdAt: string;
  imagenes: string[];
  usuario: User;
};

export type HealthDataDTO = {
  id: string;
  grupoSanguineo: string;
  altura: string;
  peso: string;
  patologias: string[];
  medicacion: string[];
  sexo: string;
  alergias: string[];
};

export interface TipoAccidenteTopType {
  type: string | null;
  amount?: number;
  message?: string;
}

export type UserContextType = {
  loggedUser: User | null;
  token: string | null;
  setLoggedUser: (user: User | null) => void;
  setToken: (token: string) => void;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
};

export type UserProviderProps = {
  children: ReactNode;
};
export type ObtenerUbicacionParams = {
  setUbicacionError: (mensaje: string) => void;
};
