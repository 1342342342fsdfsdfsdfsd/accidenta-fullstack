import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useState, useContext } from 'react';
import { getUser } from '../services/userService';
import { User, UserContextType, UserProviderProps } from '../types/types';

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    // ✅ CORRECCIÓN: Gestionamos el estado de carga aquí.
    setLoading(true);
    try {
      const userData = await getUser();
      setLoggedUser(userData);
    } catch (e) {
      console.log('Error al refrescar el usuario:', e);
      // Opcional: limpiar sesión si el token es inválido
      setLoggedUser(null);
      await AsyncStorage.removeItem('token');
      setToken(null);
    } finally {
      // ✅ CORRECCIÓN: Aseguramos que la carga termine siempre.
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadUserFromToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      // La lógica de refreshUser ya incluye setLoading,
      // por lo que no es necesario ponerlo aquí.
      await refreshUser();
    };

    loadUserFromToken();
  }, [token]);

  return (
    <UserContext.Provider
      value={{
        loggedUser,
        setLoggedUser,
        token,
        setToken,
        isLoading,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe ser usado dentro de un UserProvider');
  return ctx;
};
