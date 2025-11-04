import { API_BASE_URL } from '@env';
import { RouteProp, useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Clock,
  FileText,
  IdCard,
  Image as ImgIcon,
  MapPin,
  User,
} from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AccidentReportDTO } from 'src/types/types';

type RootStackParamList = {
  ReportDetail: { reporte: AccidentReportDTO };
};

type Props = {
  route: RouteProp<RootStackParamList, 'ReportDetail'>;
};

export default function ReportDetailScreen({ route }: Props) {
  const { reporte } = route.params;
  const navigation = useNavigation();
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);

  const fetchCoords = useCallback(async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(reporte.ubicacion!)}&format=json`,
        {
          headers: {
            'User-Agent': 'AccidentaApp/1.0 (yoel.ventoso@gmail.com)',
          },
        },
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setCoords({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  }, [reporte.ubicacion]);

  useEffect(() => {
    fetchCoords();
  }, [fetchCoords]);

  if (!coords) {
    return <ActivityIndicator size="large" color="#34c25d" style={{ flex: 1 }} />;
  }

  // console.log(reporte, 'REPORTEEEEEEEEEE');

  console.log(`${API_BASE_URL}uploads/${reporte.imagenes[0]}`);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={styles.container}>
        {/* Botón de volver */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color="#333" />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        {coords && (
          <MapView
            style={styles.map}
            region={{
              latitude: coords.latitude,
              longitude: coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
          >
            <Marker
              coordinate={coords}
              title={reporte.tipoAccidente}
              description={reporte.ubicacion!}
            />
          </MapView>
        )}

        {/* Info del reporte */}
        <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.title}>{reporte.tipoAccidente.toUpperCase()}</Text>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <FileText size={20} color="#34c25d" />
              <Text style={styles.cardLabel}>Descripción</Text>
            </View>
            <Text style={styles.cardValue}>{reporte.descripcion}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <User size={20} color="#34c25d" />
              <Text style={styles.cardLabel}>Reportante</Text>
            </View>
            <Text style={styles.cardValue}>{reporte.usuario?.nombre}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <IdCard size={20} color="#34c25d" />
              <Text style={styles.cardLabel}>DNI</Text>
            </View>
            <Text style={styles.cardValue}>{reporte.dni}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Clock size={20} color="#34c25d" />
              <Text style={styles.cardLabel}>Fecha y hora</Text>
            </View>
            <Text style={styles.cardValue}>
              {new Date(reporte.createdAt).toLocaleString('es-AR', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MapPin size={20} color="#34c25d" />
              <Text style={styles.cardLabel}>Ubicación</Text>
            </View>
            <Text style={styles.cardValue}>{reporte.ubicacion}</Text>
          </View>

          {reporte.imagenes && reporte.imagenes.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <ImgIcon size={20} color="#34c25d" />
                <Text style={styles.cardLabel}>Imágenes</Text>
              </View>
              <View style={styles.imagesContainer}>
                {reporte.imagenes.map((imgUrl, index) => (
                  <Image
                    key={index}
                    source={{ uri: `${API_BASE_URL}uploads/${imgUrl}` }}
                    style={styles.reporteImage}
                    resizeMode="stretch"
                  />
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 4,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#333',
  },
  map: {
    height: 250,
    width: '100%',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 4,
  },
  cardLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  imagesContainer: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  reporteImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginTop: 10,
  },
});
