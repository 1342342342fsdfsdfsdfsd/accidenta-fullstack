import * as Location from 'expo-location';
import { ObtenerUbicacionParams } from 'src/types/types';
export async function obtenerDireccionDesdeCoordenadas(lat: number, lon: number) {
  const reverseGeocode = await Location.reverseGeocodeAsync({
    latitude: lat,
    longitude: lon,
  });

  if (reverseGeocode.length > 0) {
    const data = reverseGeocode[0];
    const direccion = `${data.street || ''} ${data.name || ''}, ${data.city || ''}, ${data.region || ''}, ${data.country || ''}`;
    return direccion;
  } else {
    return 'Ubicación aproximada no disponible';
  }
}

export async function obtenerUbicacion({
  setUbicacionError,
}: ObtenerUbicacionParams): Promise<string | null> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      setUbicacionError('Permiso de ubicación no otorgado');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    if (!location) {
      setUbicacionError('No se habilitó el acceso a la ubicación');
      return null;
    }

    const direccion = await obtenerDireccionDesdeCoordenadas(
      location.coords.latitude,
      location.coords.longitude,
    );

    setUbicacionError(''); // ✅ limpiar error si todo salió bien
    return direccion;
  } catch (error: unknown) {
    console.log('Error ubicación:', error);
    setUbicacionError('Ocurrió un error al obtener la ubicación');
    return null;
  }
}
